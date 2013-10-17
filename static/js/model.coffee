root = global ? window
unless view_model.newFiddle
  $.extend view_model,
    title: $('title').text().replace(/\s\|\s(Python Fiddle|Fiddle Salad)/, '')
    description: $('[name=description]').attr('content')
    tags: $('[name=keywords]').attr('content')
else
  $.extend view_model,
    title: ''
    description: ''
    tags: ''
root.snippetModel = ko.mapping.fromJS(view_model)

LocalHistory = Class.$extend(
  __init__: (@revisions) ->
    @title = '' 
  
  initialize_revisions: _.once((@title) ->
    if store.get(title)? # Snippet object exists
      @revisions store.get(@title)
    else # create Snippet object
      @create_revision()
  )

  get_revision: (timestamp) ->
    store.get(timestamp)
    
  create_revision: ->
    code = engine.get_code()
    return  if _.any(@revisions(), (revision) => @get_revision(revision) is code)
    timestamp = dateFormat()
    store.set timestamp, code
    @revisions.push(timestamp)
    @saveRevisions()
    
  saveRevisions: ->
    store.set @title, @revisions()
)
TitleMessage = ->
  @icon = ko.observable('')
  @text = ko.observable('')
  @set_message = (message, image='blank') ->
    @text message
    @icon [base_url, '/images/', image, '.png'].join('')
  @clear = ->
    @set_message ''
  @
RevisionsMenu = ->
  @revisions = ko.observableArray([])
  @selectedRevision = ko.observable()
  @selectedRevision.prev = ''
  @diffEnabled = ko.observable(false)
  @selectedDiffRevision = ko.observable()
  @selectedDiffRevision.prev = ''
  @
ViewModel = Class.$extend(
  __init__: ->
    @formMessage = ko.observable('')
    @importUrl = ko.observable('').extend(url: '')
    @packages = ko.observableArray([])
    @snippetUrl = ko.computed =>
      urlPattern = /(\w+):\/\/([\w.]+(?:\:8000)?)\//
      result = document.URL.match(urlPattern)
      url = result[0] + slugify(@title())
      url
    @revisionsMenu = new RevisionsMenu()
    @localHistory = LocalHistory(@revisionsMenu.revisions)
    @titleMessage = new TitleMessage()
    @afterLogin = ->
    ko.computed =>
      # if the user just logged in
      if @authenticated() and !view_model.authenticated
        @afterLogin()
  
  __include__: [snippetModel],

  timestampChanged: (selectedRevision) ->
    # checks and updates timestamp
    timestamp = selectedRevision()
    # if timestamp is different from the previous one
    if selectedRevision.prev isnt timestamp
      # update it and return true
      selectedRevision.prev = timestamp
      return true
    else
      return false

  load_history: ->
    ko.computed =>
      if not @newFiddle() and @isOwner()
        @localHistory.initialize_revisions @title()
    ko.computed =>
      if not @revisionsMenu.diffEnabled()
        return  if not (_.isString(@revisionsMenu.selectedRevision()) and @timestampChanged(@revisionsMenu.selectedRevision))
        # when the selectedRevision changes multiple times in a few minutes, skip creating a new revision
        @saveCurrentRevision()
        engine.set_code @localHistory.get_revision(@revisionsMenu.selectedRevision())
      else
        return  if not (_.isString(@revisionsMenu.selectedRevision()) and _.isString(@revisionsMenu.selectedDiffRevision()) and (@timestampChanged(@revisionsMenu.selectedRevision) or @timestampChanged(@revisionsMenu.selectedDiffRevision)))
        engine.compare_revisions @revisionsMenu.selectedRevision(), @revisionsMenu.selectedDiffRevision()
    @saveCurrentRevision = _.throttle @localHistory.create_revision, 2*MINUTE, leading: false

  save: ->
    unless @authenticated()
      @formMessage 'login is required'
      popup('/login/')
      @afterLogin = @save
      return
    code = engine.get_code()
    if @emptyFiddle(code)
      @formMessage 'please fill in code'
      return
    title = @title()
    if title isnt title.compact()
      @formMessage 'check for extraneous spaces in title'
      return
    titleWords = title.split(' ')
    if _.all(titleWords, (word) -> word.length < 3)
      @formMessage 'title contains invalid words'
      return
    profanity = false
    $.ajax(
      url: [ajax_url, '/ajax/checkprofanity.php?q=', @title(), ' ', @description()].join('')
      success: (result) ->
        if JSON.parse(result).response is 'true'
          profanity = true
      async: false
    )
    if profanity
      @formMessage 'no profanity allowed'
      return
    if @newFiddle()
      @checkSpelling titleWords
    else
      @submitForm()

  checkSpelling: (words) ->
    @numSpellcheckCallbacks = words.length #wikipedia callback for each word
    @misspelledWordsWikipedia = []
    @misspelledWordsDictionary = []
    dictionary = BJSpell('en_US')
    for word in words
      if not dictionary.check word
        @misspelledWordsDictionary.push word
    $LAB.setGlobalDefaults(AllowDuplicates: true)
    _.each words, (word) -> $LAB.script('http://en.wikipedia.org/w/api.php?action=opensearch&search='+word+'&format=json&callback=viewModel.spellcheckCallback')

  spellcheckCallback: (response) ->
    word = response[0]
    suggestions = response[1]
    word = word.toLowerCase()
    if not _.contains _.map(suggestions, (suggestion) -> suggestion.toLowerCase()), word
      @misspelledWordsWikipedia.push(word)
    @formAutoSubmit()

  formAutoSubmit: ->
    @numSpellcheckCallbacks--
    misspelledWords = _.intersection @misspelledWordsWikipedia, @misspelledWordsDictionary
    if @numSpellcheckCallbacks is 0
      if misspelledWords.length
        @formMessage 'please check for misspellings'
        @titleMessage.set_message misspelledWords.join(', '), 'error'
        return
      else
        @submitForm()

  prepare_form: ->
    $('form').validate submitHandler: =>
      @save()
    @checkTitleOnKeyup()

  #  private
  submitForm: ->
    code = engine.get_code()
    primaryLanguage = engine.get_primary_language()
    model = $('form').serializeArray()
    model.push.apply model, [
        name: 'code'
        value: code
      ,
        name: 'language'
        value: engine.get_primary_language()
    ]
    $.post(
      '/save/'
      model
      (response) =>
        if response.success
          $('p.error').remove()
          @formMessage 'success'
          @titleMessage.clear()
          @updateShareUrl()
          slug = slugify(@title())
          if @newFiddle()
          # create the first revision
            @newFiddle false
            # change browser location
            if primaryLanguage isnt engine.get_url_path_language()
              window.location.assign [ window.location.origin, primaryLanguage, slug ].join('/')
            else
              History.pushState null, @title(), slug  if History.enabled
          else
            @localHistory.create_revision()
        else
          @showValidationErrors response.errors
      'json'
    )

  checkTitleOnKeyup: ->
    @title.subscribe _.debounce((title) =>
        return  if title.split(' ').length < 3
        $.getJSON '/check_title/',
          title: title,
          (json) =>
            if json.available
              @titleMessage.set_message 'available', 'check'
            else
              @titleMessage.set_message 'unavailable', 'error'
      , 750)

  updateShareUrl: ->
    return  if debug
    stWidget.addEntry _.defaults(
      url: @snippetUrl()
      , defaultShare)
    $('#share_this span').first().remove()  if $('#share_this span').length > 1

  showValidationErrors: (errors) ->
    for field of errors
      msg = $('<p/>',
        class: 'error'
        html: errors[field].join('<br />')
      )
      $('#id_' + field).before msg
)
PythonViewModel = ViewModel.$extend(
  __init__: ->
    @$super()
    @examples = ko.observableArray([])
    @importOption = ko.observable('pythonsnippet')
    @embedUrl = ko.computed =>
      iframe = '<iframe style=\'width: 100%; height: 300px\' src=\'url/embedded/\'></iframe>'
      iframe.replace 'url', @snippetUrl()
    @busy = ko.observable(true)
    @output = ko.observableArray([])
    @consoleOutput = ko.computed =>
      @output().join ''
    .extend(throttle: 50)
    @accordionTemplate = 'pythonAccordion'

  emptyFiddle: (code) ->
    code.length is 0

  selectExample: (example) ->
    engine.set_code atob(example.code)

  importExternal: ->
    callback = stackoverflow: scrapeStackoverflowQuestion
    if @importOption() of callback
      cbFunc = makeCallback(callback[@importOption()])
      requestCrossDomain @importUrl()
    else
      $.get ajax_url + '/ajax/get.php?url=' + encodeURIComponent(@importUrl()), {}, scrapePythonCode, 'html'
)
Template = (configuration) ->
  @title = configuration.title
  @templates = configuration.templates
  @type = configuration.type
  @selected = ko.observable('')
  @
WorkspaceConfiguration = ->
  @enableTransparency = ko.observable(false)
  @cssLintEnabled = ko.observable(true)
  @jsLintEnabled = ko.observable(true)
  clearErrorMarkers = ->
    codeRunner.reset()
    for style in ['CodeMirror-lint-marker-warning', 'CodeMirror-lint-marker-error', 'highlight-error']
      $('.' + style).removeClass(style)
  @cssLintEnabled.subscribe clearErrorMarkers
  @jsLintEnabled.subscribe clearErrorMarkers
  @refreshPreview = ko.observable(false)
  @refreshPreview.subscribe (enabled) ->
    if enabled
      root.codeRunner = StaticCodeRunner()
    else
      window = root.codeRunner.window
      root.codeRunner = null
      window.location.reload()
      root.codeRunner = DynamicCodeRunner()
  @completeHtmlTags = ko.observable(true)
  @
FiddleViewModel = ViewModel.$extend(
  __init__: ->
    @$super()
    @containers = ko.observableArray([])
    @loadTemplates()
    @loadFrameworks()
    @loadWidgetLibrary()
    @resources = ko.observableArray([])
    @newResourceText = ko.observable()
    @configuration = new WorkspaceConfiguration()
    @loadTips()

  add_resource: (file) ->
    resource = (source, ownerViewModel) ->
      pathSegments = source.split('/')
      title = undefined
      if pathSegments.length - 1 < 1
        title = source
      else if pathSegments[pathSegments.length - 1].length
        title = pathSegments[pathSegments.length - 1]
      else
        title = pathSegments[pathSegments.length - 2]
      @source = ko.observable(source)
      @title = ko.observable(title)
      if title.has /angular|mustache/
        ownerViewModel.configuration.refreshPreview(true)
      @remove = ->
        filetype = codeRunner.filetype(@source())
        if filetype is 'css'
          _.defer ->
            codeRunner.remove_css source
        else if filetype is 'js'
          _.defer ->
            engine.reset()
        ownerViewModel.resources.remove this
        true
      @
    source = (if _.isString(file) then file else @newResourceText())
    exists = not _.isEmpty(ko.utils.arrayFirst(@resources(), (resource) ->
        resource.source() is source
    ))
    return  if exists
    if codeRunner.add_file(source)
      @resources.push new resource(source, this)
      @newResourceText ''

  frameworks: ->
    if _.isString @selectedFramework().name
      [ @selectedFramework().name ]
    else
      []

  add_framework: (templateName) ->
    engine.set_code atob(frameworkLibrary[@styleLanguage()][templateName].source), LANGUAGE_TYPE.FRAMEWORK
    @starterFrameworks()[0].selected(templateName)

  lint_enabled: (language) ->
    switch language
      when LANGUAGE.CSS
        @configuration.cssLintEnabled()
      when LANGUAGE.JAVASCRIPT
        @configuration.jsLintEnabled()
      when LANGUAGE.TYPESCRIPT
        true
      else
        false

  #  private

  emptyFiddle: (code) ->
    code = $.parseJSON(code)
    Math.max(code[@documentLanguage()].length, code[@styleLanguage()].length, code[@programLanguage()].length) is 0

  disableLint: ->
    @configuration.cssLintEnabled(false)
    @configuration.jsLintEnabled(false)
  
  validateHtml: ->
    htmlBody = engine.get_code LANGUAGE_TYPE.DOCUMENT
    body = document.body
    form = document.createElement('form')
    input = document.createElement('input')
    
    form.action = 'http://validator.w3.org/check'
    form.enctype = 'multipart/form-data'
    form.method = 'post'
    form.target = '_blank'
    input.name = 'fragment'
    input.value = """
            <!DOCTYPE html>
            <html>
              <head>
              </head>
              <body>
                #{ htmlBody }
              </body>
            </html>
            """
    form.appendChild input
    input = document.createElement('input')
    input.name = 'verbose'
    input.value = '1'
    form.appendChild input
    body.appendChild form
    form.submit()
    body.removeChild form
  
  validateCss: ->
    css = engine.get_code LANGUAGE_TYPE.STYLE
    body = document.body
    form = document.createElement('form')
    input = document.createElement('input')
    
    form.action = 'http://jigsaw.w3.org/css-validator/validator'
    form.enctype = 'multipart/form-data'
    form.method = 'post'
    form.target = '_blank'
    input.name = 'text'
    input.value = css
    form.appendChild input
    input = document.createElement('input')
    input.name = 'profile'
    input.value = 'css3'
    form.appendChild input
    input = document.createElement('input')
    input.name = 'warning'
    input.value = '2'
    form.appendChild input
    body.appendChild form
    form.submit()
    body.removeChild form
    
  beautifyJavascript: ->
    engine.set_code js_beautify(engine.get_code(LANGUAGE_TYPE.PROGRAM)), LANGUAGE_TYPE.PROGRAM
    
  beautifyCss: ->
    engine.set_code @reindentCss(engine.get_code(LANGUAGE_TYPE.STYLE)), LANGUAGE_TYPE.STYLE
    
  reindentCss: (css) ->
    s = css
    s = s.replace(/\t+/g, "")
    s = s.replace(/(\S)\s*\{/g, "$1 {")
    s = s.replace(/;\s*([a-z\-\*\_])/g, ";\n\t$1")
    s = s.replace(/;.*(\/\*.*\*\/)\s*([a-z\-\*\_])/g, "; $1\n\t$2")
    s = s.replace(/\}\s*(\S)/g, "}\n$1")
    s = s.replace(/(\S)\s*\}/g, "$1\n}")
    s = s.replace(/\{\s*([a-z\-\*\_])/g, "{\n\t$1")
    s = s.replace(/\{.*(\/\*.*\*\/)\s*([a-z\-])/g, "{ $1\n\t$2")
    s = s.replace(/\t([a-z\-\*\_]+): */g, "\t$1: ")
    s

  compatibleLanguages: ->
    if (@documentLanguage() in COMPATIBLE_LANGUAGES.HTML and @styleLanguage() in COMPATIBLE_LANGUAGES.CSS and @programLanguage() in COMPATIBLE_LANGUAGES.JAVASCRIPT)
      true
    else
      false

  updateShareUrl: ->
  
  importExternal: ->
    ###
    This routine imports inline CSS/JS and HTML into editors and external files as resources. If the scripting language
    is not compatible with JS, it is imported embedded in the HTML. Otherwise, jQuery strips out all link and script
    tags in the body. If one of the languages used is not compatible, a notification is shown. This routine assumes
    the languages are set in the view model, the server request returns a JSON result with the resources, inline 
    CSS/JS blocks, and the HTML body. This routine sets the associated editors with the imported code. 
    ###
    return  if not @importUrl().length or @importUrl.hasError()
    absolutePath = (resource, relative=false) =>
      # if resource isn't a full url
      if relative or resource.slice(0, 4) isnt 'http'
      # if resource is missing a slash at the start
        if resource.charAt(0) isnt '/'
          resource = '/' + resource
        # set it relative to root
        segments = @importUrl().split('/')
        resource = segments.splice(0, segments.length - 1).join('/') + resource
      resource

    # get JSON result from server
    $.getJSON '/utility/import/',
      url: @importUrl(),
      (scrapedContents) =>
        if scrapedContents.success
          # add all resources
          for resource in scrapedContents.resources
            @add_resource absolutePath(resource)
          @disableLint()
          urlAdjustedCssBlocks = _.map(scrapedContents.inlineCssBlocks,
            (cssBlock) ->
              urlFunctionPattern = /url\([\w\-_\/.]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?\)/g
              cssBlock.replace(urlFunctionPattern,
                (url) ->
                  # adjust relative url paths
                  urlPath = absolutePath url.slice(4, url.length - 1).replace(/"|'/g, '')
                  "url(#{ urlPath })"
              )
          )
          # set style code with all inline styles joined together
          engine.set_code urlAdjustedCssBlocks.join('\n'), LANGUAGE_TYPE.STYLE
          # remove all style and link tags in body
          body = atob(scrapedContents.body)
          body = @replaceInlineBlocks(body, scrapedContents.inlineCssBlocks)
          body = body.replace(/<style[^>]*>[\s\S]*?<\/style>|<link[^>]*>/gi, '')
          # if program language is compatible with JS
          if @programLanguage() in COMPATIBLE_LANGUAGES.JAVASCRIPT
            # remove all script tags in body
            body = @replaceInlineBlocks(body, scrapedContents.inlineJavascriptBlocks)
            body = body.replace(/(?:<script>|<script[\s]+src[^>]*>|<script[\s\w="']+text\/javascript[^>]*>)[\s\S]*?<\/script>/gi, '') # don't remove templates
            # remove body tags
            body = body.replace(/<body[^>]*>|<\/body>/gi, '')
            # adjust relative urls
            relativeUrlPattern = /(src|href|action)\s*=\s*('|"|(?!"|'))(?!(http:|ftp:|mailto:|https:|#))[\w\-\.,@?^=%&amp;:/~\+#]+('|")/gi
            body = body.replace(relativeUrlPattern,
              (link) ->
                urlPath = absolutePath link.slice(link.indexOf('=') + 2, link.length - 1) # get the value of the path between quotes (eg script.js for src="script.js")
                "#{ link.slice(0, link.indexOf('=') + 1) }\"#{ urlPath }\""
            )
            # set document code
            engine.set_code body, LANGUAGE_TYPE.DOCUMENT
            # set program code with all inline scripts joined together
            inlineScripts = _.reject scrapedContents.inlineJavascriptBlocks, (block) ->
              /google-analytics|UA-/g.test block
            engine.set_code inlineScripts.join('\n'), LANGUAGE_TYPE.PROGRAM
          # otherwise
          else
            # set document code
            engine.set_code body, LANGUAGE_TYPE.DOCUMENT
        else
          @importUrl.hasError(true)
          @importUrl.validationMessage(scrapedContents.error)

  replaceInlineBlocks: (body, blocks) ->
    for block in blocks
      body = body.replace($.trim(block), '')
    body

  loadTemplates: ->
    ###
    This routine loads HTML and CSS templates that can be used with the languages. It assumes the style and document
    languages are already set in the view model.
    ###
    templateLibrary =
      css:
        title: 'CSS Framework'
        templates: ['twitterbootstrap2', 'twitterbootstrap3', 'jqueryui', 'html5boilerplate', '1140grid', '960gs', 'inuit', 'normalize']
        type: 'css'
      html:
        title: 'HTML Boilerplate'
        templates: ['html5boilerplate']
        type: 'html'
      combined:
        title: 'HTML/CSS Template'
        templates: ['projection', 'shape', 'solitude', '2_breed', 'artificial_casting', 'dusky']
        type: 'css/html'

    starterTemplates = []
    @showSelectedTemplates = false
    # if the styling language is compatible with css
    if @styleLanguage() in COMPATIBLE_LANGUAGES.CSS
      # load css templates
      starterTemplates.push(templateLibrary.css)
      # if the document language is compatible with html
      if @documentLanguage() in COMPATIBLE_LANGUAGES.HTML
        # load html and css combined templates
        starterTemplates.push(templateLibrary.combined)
        @showSelectedTemplates = true;
    # load html templates if document language language is html compatible
    if @documentLanguage() in COMPATIBLE_LANGUAGES.HTML
      starterTemplates.push(templateLibrary.html)

    @starterTemplates = $.map(starterTemplates, (configuration) ->
        new Template(configuration)
    )

    @cssSelected = ko.computed =>
      @selectedTemplate 'css'
    @htmlSelected = ko.computed =>
      @selectedTemplate 'html'

  selectedTemplate: (type) ->
    fileName =
      css: 'styles'
      html: 'index'
    languageType =
      css: LANGUAGE_TYPE.STYLE
      html: LANGUAGE_TYPE.DOCUMENT

    for starterTemplate in @starterTemplates
      unless starterTemplate.type.indexOf(type) is -1
        if _.isString(starterTemplate.selected())
          template = starterTemplate.selected()
          templateType = starterTemplate.type
    if _.isString(template) and template.length > 0
      if templateType is 'css/html'
        templatePath = [ 'templates/', template, '/', fileName[type] ].join('')
      else
        templatePath = template
      templatePath = [ ajax_url, '/files/', templatePath, '.', type ].join('')
      if type is 'css' and templateType isnt 'css/html'
        $('#accordion').accordion('activate', 0)
        _.defer(=> @add_resource templatePath)
      else
        $.get templatePath, {}, ((code) =>
          @disableLint()
          engine.set_code code, languageType[type]
        ), 'text'
    name: template
    url: templatePath

  loadFrameworks: ->
    ###
    This routine loads the frameworks that can be used with the styling language. When the user selects one of them,
    it loads the code for it in the engine. It assumes the style language is set in the view model and the framework
    dictionary is of the formate language followed by framework name. Also, the frameworks array in the view model
    is already set with the names of frameworks to be loaded. After this routine runs, starterFrameworks is set
    and frameworks are loaded.
    ###
    @starterFrameworks = ko.observableArray([])
    return  unless @styleLanguage() of frameworkLibrary
    # map the frameworks for the language to starterFrameworks
    @starterFrameworks([
      new Template(
        title: @styleLanguage().toUpperCase() + ' Boilerplate'
        templates: $.map(frameworkLibrary[@styleLanguage()], (framework, name) -> name)
        type: @styleLanguage()
      )
    ])

  selectedFramework: ->
    ###
    This method observes starterFrameworks so that changing selected loads the template and shows link to documentation
    ###
    framework = new Object
    # when a framework is selected
    for starterFramework in @starterFrameworks()
      if _.isString(starterFramework.selected())
        template = starterFramework.selected()
        templateType = starterFramework.type
        framework = frameworkLibrary[templateType][template]
        # set the framework in the engine
        engine.set_code atob(framework.source), LANGUAGE_TYPE.FRAMEWORK
    # return the name and url of the framework
    name: template
    url: framework.url

  loadWidgetLibrary: ->
    WidgetLibrary = ->
      @names = _.keys(widgetLibrary)
      @selected = ko.observable('')
      @selectedUrl = ko.computed =>
        library = widgetLibrary[@selected()]
        if library
          _.defer(-> _.each(library.sources, (source) -> viewModel.add_resource(source)))
          library.url
        else
          ''
      @
    @widgetLibrary = new WidgetLibrary()

  initializeTabs: (elements, data) ->
    $(elements).tabs()
    data.height(($('#' + data.parentId).height() - $('#' + data.id).find('.ui-tabs').outerHeight() - $('.ui-dialog-titlebar:first').outerHeight() + 2) + 'px')

  iframeContainers: _.memoize( ->
    containers = [ $('#source').parent(), $('#result').parent() ]
    if $('#documentation').length
      containers.push $('#documentation').parent()
    containers
  )

  maskOverlapIframe: _.throttle(
    (event, data) ->
      padding = 2
      cursorLocation =
        x: data.position.left + data.size.width + padding
        y: data.position.top + data.size.height + padding
      for container in viewModel.iframeContainers()
        containerPosition = container.offset()
        overlap =
          x: -> cursorLocation.x < (containerPosition.left + container.outerWidth()) and cursorLocation.x > containerPosition.left
          y: -> cursorLocation.y < (containerPosition.top + container.outerHeight()) and cursorLocation.y > containerPosition.top
        if overlap.x() and overlap.y()
          container.find('iframe').hide()
    100
  )

  showMaskedIframes: _.debounce(
    ->
      $('iframe:hidden').show()
    300
  )


  openHotkeysFrame: ->
    hotkeysFrame = Frame 'hotkeyscontainer', 'Hotkeys'
    hotkeysBox = TemplateComponent 'hotkeys'
    ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
    mac = ios || /Mac/.test(navigator.platform);
    if mac
      hotkeysBox.set_template 'macHotkeysTemplate'
    else
      hotkeysBox.set_template 'windowsHotkeysTemplate'
    width = 200
    accordionPosition = $('#accordion').offset()
    hotkeysFrame.set_location(x: accordionPosition.left - width, y: 180)
    hotkeysFrame.set_size(width: width, height: 220)
    hotkeysFrame.add hotkeysBox
    @containers.push hotkeysFrame

  loadTips: ->
    TipsPanel = ->
      @currentDate = ->
        date = new Date()
        "#{ date.getMonth() }-#{ date.getDate() }"
      @alreadyShown = =>
        @currentDate() is store.get('date')
      @startup = ko.observable(not store.get('hideTipsOnStartup') and not @alreadyShown())
      @startup.subscribe((checked) ->
        store.set('hideTipsOnStartup', not checked)
      )
      if @startup()
        store.set('date', @currentDate())
      image_url = base_url + '/images/tips/'
      @content = [
          image: image_url + 'autocomplete.png'
          text: 'Press enter or tab to select an autocomplete suggestion, up or down to navigate, and esc to quit. '
        ,
          image: image_url + 'css_preview.jpg'
          text: 'Hovering over highlighted CSS in the source window brings up tooltips. You can get previews for fonts, colors, sizes, and images.'
        ,
          image: image_url + 'import_css.png'
          text: 'Import CSS frameworks such as Bootstrap by selecting them under the dropdown. '
        ,
          image: image_url + 'js_debug.png'
          text: 'Double clicking or highlighting a variable in the JavaScript editor prints the debug output. '
        ,
          image: image_url + 'jquery.png'
          text: 'Look up jQuery selectors and methods with an interface that gets out of the way of your development work, loaded if your window is wide enough. '
        ,
          image: image_url + 'js_convert.png'
          text: 'The CoffeeScript to JavaScript conversion box inserts the converted JavaScript at your cursor position in the CoffeeScript editor. '
        ,
          image: image_url + 'import_page.png'
          text: 'Import CSS, HTML, and JavaScript from an existing site by entering its URL. Inline CSS and JavaScript are imported into editors and external files as resources. '
        ,
          image: image_url + 'local_history.png'
          text: 'With local history, you never have to worry about losing your changes! All your saved revisions are stored. '
        ,
          image: image_url + 'js_lint.png'
          text: 'Static code analysis for CSS and JavaScript is performed by the IDE on the fly. The editor highlights warnings and errors in the code immediately as you type. '
        ,
          image: image_url + 'highlight.png'
          text: 'Highlight all instances of a word by placing the cursor on it. '
        ,
          image: image_url + 'js_log.png'
          text: 'Inspect your code by logging messages to the console when you want to see if a function is executing as expected or a variable is being assigned correctly. '
        ,
          image: image_url + 'cs_error.png'
          text: 'For CoffeeScript, a warning icon is shown whenever a JavaScript error occurs. Hovering over the result window highlights the line in CoffeeScript and shows the error. '
        ,
          image: image_url + 'template_locals.png'
          text: 'To render a template with free variables in Jade, Coffeekup, or Markdown; pass in a context object through <em>locals</em> that has properties correspondings to them. '
        ,
          image: image_url + 'emmet.png'
          text: 'With Emmet you can quickly write a bunch of code, wrap code with new tags, quickly traverse and select important code parts and more!'
        ,
          image: image_url + 'dochub.png'
          text: 'Search CSS documentation instantly. HTML and JavaScript documentation are also available in the menu. Documentation panel is only shown if window is larger than 1200 pixels as the IDE is loaded. '
        ,
          image: image_url + 'revision_comparison.png'
          text: 'Checking compare revisons and selecting a saved revision will open an advanced visual Diff window, showing diff statistics and highlighting differences in color.'
        ,
      ]
      loadCircularTipsIndex = ->
        tipsIndex = store.get('tipsIndex')
        if _.isNumber(tipsIndex) and tipsIndex + 1 < @content.length
          tipsIndex + 1
        else
          1
      selectedIndex = loadCircularTipsIndex()
      store.set('tipsIndex', selectedIndex)
      @selectedIndex = ko.observable(selectedIndex)
      @selectedIndex.subscribe((index) ->
        store.set('tipsIndex', index)
      )
      @selected = ko.computed( =>
        @content[@selectedIndex()]
      )
      @prev = =>
        @selectedIndex(@selectedIndex() - 1)
      @next = =>
        @selectedIndex(@selectedIndex() + 1)
      @
    @tips = TipsPanel()

  load_tips: ->
    tipsFrame = Frame 'tipscontainer', 'Tips'
    tipsBox = TemplateComponent 'tips'
    tipsBox.set_template 'tipsTemplate'
    width = 402
    height = 470
    tipsFrame.set_location(x: ($(window).width() - width) / 2, y: ($(window).height() - height) / 2)
    tipsFrame.set_size {width, height}
    tipsFrame.add tipsBox
    tipsFrame.buttons.toggle = false
    tipsFrame.buttons.maximize = false
    @containers.push tipsFrame
)
root.ViewModel = ViewModel
root.PythonViewModel = PythonViewModel
root.FiddleViewModel = FiddleViewModel