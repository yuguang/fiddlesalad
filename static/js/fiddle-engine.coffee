root = global ? window
BackgroundWorker =
  previousError: new Object

  errorWidget: new Object

  loadWorker: (file) ->
    @compiler = new Worker([worker_url, 'compilers/', file, '.js', '?v=', 201302114].join(''))
    @compiler.addEventListener(
      'message'
      (event) =>
        messageType = event.data.type
        switch messageType
          when ('result')
            @receiveResult event.data.resultText
          when ('hint')
            @displayHint(event.data.hints)
          when ('error')
            @displayError event.data.errorText, event.data.line
          when ('notification')
            @displayNotification event.data.messageText
          when ('mappedResult')
            @mappingJSON = event.data.mappingJSON
            @receiveResult event.data.resultText
      false
    )

  receiveResult: (code) ->
    @previewCode code
    @clearLineWidget()
    @previousError = new Object

  previewCode: (code) ->

  displayHint: (hints) ->
    CodeMirror.updateLinting(@pad, hints)

  makeLineWidget: (message) ->
    widget = document.createElement("div")
    icon = widget.appendChild(document.createElement("span"))
    icon.innerHTML = "!!"
    icon.className = "lint-error-icon"
    widget.appendChild document.createTextNode(message)
    widget.className = "lint-error"
    widget

  clearLineWidget: ->
    if not _.isEmpty @errorWidget
      @pad.removeLineWidget @errorWidget
      @errorWidget = new Object

  displayError: _.throttle((message, line=@pad.getCursor().line) ->
      return  if _.isEqual {line, message}, @previousError
      @clearLineWidget()
      @errorWidget = @pad.addLineWidget line, @makeLineWidget(message)
      @previousError = {line, message}
    , 1200)

  displayNotification: (message) ->
    noty _.defaults(text: message, notyDefaults)

DynamicEditor = CodeCompleteEditor.$extend(
  __init__: (id) ->
    @$super id
    @observers = new Array
    @compiledCode = new String
    @tabCharaterLength = 4

  __include__: [BackgroundWorker]

  get_options: ->
    _.extend(
      @$super()
      lineWrapping: true
      styleActiveLine: true
      indentUnit: @tabCharaterLength
      indentWithTabs: true
      tabSize: @tabCharaterLength
    )

  previewCode: (code) ->
    @preview code
    @set_compiled_code code
    _.defer => @notify()

  load: ->
    @$super()
    $(@codeMirrorContainer)
      .parent()
      .bind('wijdialogresize', _.debounce(
          =>
            @pad.refresh()
          300
        )
      )

  attach: (observer) ->
    @observers.push(observer)

  detach: (observer) ->
    @observers = _.without(@observers, observer)

  notify: ->
    for observer in @observers
      observer.update(@)

  set_focus_listener: (listener) ->
    @focusListener = listener

  focusHandler: ->
    if @focusListener?
      @focusListener.focus_gained()

  changeHandler: ->
    @compiler.postMessage @get_code()

  get_compiled_code: ->
    @compiledCode

  set_compiled_code: (code) ->
    @compiledCode = code

  get_documentation: (name=@mode) ->
    page = IframeComponent name + 'ReferenceTab'
    page.set_source @documentationUrl
    {title: name, content: page.to_html_string()}
)
StyleEditor = DynamicEditor.$extend(
  __init__: (id) ->
    @$super id
    @bootstrapCode = new String
    @varClassName = 'cm-meta'
    keywords = KEYWORDS.CSS_PROPERTIES
    @addAutocomplete keywords
    @showAutocomplete = false
    @varStart = '$'
    @theme = 'stylish'

  set_framework: (code) ->
    return  if code is @bootstrapCode
    @bootstrapCode = code
    @changeHandler()

  get_framework: ->
    @bootstrapCode

  get_code: ->
    @bootstrapCode + @$super()

  keyHandler: (editor, event) ->
    ###
    This routine keeps track of the cursor position. Autocomplete is only launched on an indented line that does
    not have the ":" symbol.
    ###
    # if a new line is started, set showAutocomplete to true
    if event.keyCode is 13 and event.type is 'keydown' and editor.getCursor().ch > 1 # Enter is not captured on keypress
      @showAutocomplete = true
      _.defer => @updateVars()
    if event.type isnt 'keypress'
      return
    # if colon or space is entered, set showAutocomplete to false
    propertyEndKeyCodes = [58, 32]
    if event.keyCode in propertyEndKeyCodes
      @showAutocomplete = false
    # for any other key on an indented line
    else if @showAutocomplete and not (event.keyCode < 41 and event.keyCode > 31)
      currentPosition = editor.getCursor()
      token = editor.getTokenAt(currentPosition)
      return  if token.className and token.start is 0
      @popupAutocomplete(@keyCharacter(event))
    else
      cur = editor.getCursor()
      token = editor.getTokenAt(cur)
      return  unless token.string is @varStart
      @popupAutocomplete(@keyCharacter(event))

  preview: (css) ->
    codeRunner.format css
)
LessEditor = StyleEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'less'
    @loadWorker('less')
    @documentationUrl = base_url + '/files/documentation/lesscss.html'
    @varStart = '@'

  get_options: ->
    _.extend(
      @$super()
      profile: 'css'
    )
)
StylusEditor = StyleEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'stylus'
    @loadWorker('stylus')
    @documentationUrl = base_url + '/files/documentation/stylus/index.html'
    @tabCharaterLength = 2

  get_options: ->
    _.extend(
      @$super()
      indentWithTabs: false
    )
)
ProgramEditor = DynamicEditor.$extend(
  errorLine: -1

  get_options: ->
    _.extend(
      @$super()
      highlightSelectionMatches: minChars: 4, showToken: /\w/
    )

  loadErrorHandler: ->
    window.onmessage = (event) =>
      if event.data > -1
        line = @sourceLine event.data
        @pad.addLineClass line, 'background', 'highlight-error'
        @errorLine = line
      else
        @pad.removeLineClass @errorLine, 'background', 'highlight-error'

  preview: (javascript) ->
    codeRunner.execute javascript
)

lintEditor =
  changeHandler: ->

  lintOptions: ->
    gutters: ["CodeMirror-lint-markers"],
    lintWith: (code) =>
      if viewModel.lint_enabled(@mode)
        @compiler.postMessage code
      else
        @previewCode code

JavascriptEditor = ProgramEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'javascript'
    @loadWorker('jshint')
    @loadErrorHandler()

  sourceLine: (line) -> line

  __include__: [lintEditor]

  updateVars: ->

  get_documentation: ->

  get_options: ->
    _.extend(
      @$super()
      @lintOptions()
    )

  load: ->
    @$super()
    @hint = CodeMirror.javascriptHint

  getCursorWord: ->
    re = /[\w$]/
    cur = @pad.getCursor()
    line = @pad.getLine(cur.line)
    start = cur.ch
    end = start
    --start  while start and re.test(line.charAt(start - 1))
    ++end  while end < line.length and re.test(line.charAt(end))
    line.slice(start, end)

  selectionHandler: _.throttle(
    ->
      if @pad.somethingSelected()
        selectedText = @pad.getSelection()
        return  unless selectedText.length > 2 && @getCursorWord() is selectedText
        # get the character position of the last selected letter
        position = @pad.getCursor()
        # insert pretty print block after selection in the line
        selectedTextLine = @pad.getLine(position.line)
        # replace line in code
        lines = @get_code().split('\n')
        lines[position.line] = "#{ selectedTextLine }\ndocument.body.appendChild(prettyPrint(#{ selectedText }));"
        @previewCode lines.join('\n')
        lines[position.line] = selectedTextLine
    500
  )
)
CssEditor = StyleEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'css'
    @theme = 'default'
    @loadWorker('csslint')
    @blockEndKeyCode = 125

  __include__: [lintEditor]

  get_options: ->
    _.extend(
      @$super()
      profile: 'css'
      @lintOptions()
    )

  get_documentation: ->
)
CoffeescriptEditor = ProgramEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'coffeescript'
    @loadWorker('coffeescript')
    @documentationUrl = base_url + '/files/documentation/coffeescript.html?v=2013070221'
    @tabCharaterLength = 2
    @loadErrorHandler()

  sourceLine: (line) ->
    source_map = new SourceMapConsumer JSON.parse(@mappingJSON)
    lookup =
      line: line + 1
      column: 0
    source_map.originalPositionFor(lookup).line

  load: ->
    @$super()
    @hint = CodeMirror.coffeescriptHint
    converter = JavascriptConverter('javascriptConverter')
    converter.set_editor @
)
RoyEditor = ProgramEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'roy'
    @loadWorker('roy')
    @documentationUrl = 'http://guide.roylang.org/en/latest/index.html'
    @tabCharaterLength = 2

  load: ->
    @$super()
    @hint = CodeMirror.javascriptHint
)
TypescriptEditor = ProgramEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'text/typescript'
    @loadWorker('typescript')
    @documentationUrl = 'http://www.johnpapa.net/typescriptpost3/'

  __include__: [lintEditor]

  get_options: ->
    _.extend(
      @$super()
      @lintOptions()
    )

  get_documentation: ->
    @$super('typescript')

  load: ->
    @$super()
    @hint = CodeMirror.javascriptHint
)
DocumentEditor = DynamicEditor.$extend(
  preview: (html) ->
    codeRunner.execute engine.get_code(LANGUAGE_TYPE.COMPILED_PROGRAM), html
)
TemplateEditor = DocumentEditor.$extend(
  getViewerLocals: ->
    iframeWindow = document.getElementById('viewer').contentWindow
    if 'locals' of iframeWindow
      iframeWindow.locals
    else
      {}

  changeHandler: ->
    @compiler.postMessage code: @get_code(), locals: @getViewerLocals()
)
CoffeekupEditor = TemplateEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'coffeescript'
    @loadWorker('coffeecup')
    @documentationUrl = '/coffeekup/documentation/'

  get_documentation: ->
    @$super('coffeekup')
)
MarkdownEditor = TemplateEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'markdown'
    @loadWorker('markdown')
    @documentationUrl = base_url + '/files/documentation/markdown.html'
    @closeBrackets = false

  get_options: ->
    _.extend(
      @$super()
      lineWrapping: false
    )

  keyHandler: ->
)
JadeEditor = TemplateEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'jade'
    @loadWorker('jade')
    @documentationUrl = base_url + '/files/documentation/jade.html'
    @tabCharaterLength = 2

  load: ->
    @$super()
    converter = HtmlJadeConverter('htmlConverter')
    converter.set_editor @
)
HtmlEditor = DocumentEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'text/html'
    @loadWorker('htmlparser')

  load: ->
    @$super()
    @hint = CodeMirror.htmlHint
    $('#beautifyHtml').on(
      'click'
      (event) =>
        CodeMirror.commands["selectAll"] @pad
        @autoFormatSelection()
    )

  get_options: ->
    _.extend(
      @$super()
      autoCloseTags: true
    )

  getSelectedRange: ->
    from: @pad.getCursor(true)
    to: @pad.getCursor(false)

  autoFormatSelection: ->
    range = @getSelectedRange()
    @pad.autoFormatRange range.from, range.to

  get_documentation: ->
)
serverCompiler =
  compileSuccess: true

  loadThrottledExecution: ->
    @executeThrottledLong = _.throttle @execute, 3500
    @executeThrottledShort = _.throttle @execute, 1500
    @executeThrottled = =>
      # if the previous compile returned with error
      if not @compileSuccess
      # call execute in longer intervals
        @executeThrottledLong()
      # else
      else
      # call execute in shorter intervals
        @executeThrottledShort()

  markError: (error) ->
    @displayError decodeEntities(error)

  execute: ->
    ###
    This routine sends request to the server to compile code unless specified by the argument immediate. On success,
    it updates the editor with the compiled code. If the compiler issues an error, it highlights the error if the
    line and column numbers are given and notifies the user about the error.
    ###
    $.post(
      ['/',  @mode, '/compile/'].join('')
      code: @get_code()
      (response) =>
        if response.success
          @clearLineWidget()
          @compileSuccess = true
          if @compiler?
            @compiler.postMessage response.code
          else
            @previewCode response.code
        else
          @compileSuccess = false
          @markError response.error, response?.line
      'json'
    )

  changeHandler: (editor, change) ->
    ###
    This routine calls execute to compile code either when a major code block is completed or after a period of time.
    http://codemirror.net/doc/manual.html#option_onChange
    ###
    return  if _.isEmpty(editor) or _.isEmpty(change)
    # if a code block is completed
    if change.next? and change.next.from.ch is 0
      @execute()
      return
    else
      @executeThrottled()

SassCompiler = StyleEditor.$extend(
  __init__: (id) ->
    @$super id
    @loadThrottledExecution()
    @tabCharaterLength = 2

  __include__: [serverCompiler]

  previewCode: (code) ->
    @$super viewModel.reindentCss(code)

  load: ->
    @$super()
    converter = CssConverter('cssConverter')
    converter.set_editor @
)
HamlEditor = DocumentEditor.$extend(
  __init__: (id) ->
    @$super id
    @loadThrottledExecution()
    @mode = 'haml'
    keywords = _.map KEYWORDS.HTML_TAGS, (keyword) -> '%' + keyword
    @addAutocomplete keywords
    @wordPattern = /^[\w%]+$/
    @documentationUrl = base_url + '/files/documentation/haml.html?v=2013070221'

  __include__: [serverCompiler]

  markError: (error, line) ->
    linePattern = /line\s(\d+)/
    lineNumber = parseInt(linePattern.exec(line)[1]) - 1
    @displayError decodeEntities(error), lineNumber

  load: ->
    @$super()
    converter = HtmlConverter('htmlConverter')
    converter.set_editor @
)
SassEditor = SassCompiler.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'sass'
    @documentationUrl = base_url + '/files/documentation/sass.html'
)
ScssEditor = SassCompiler.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'scss'
    @documentationUrl = base_url + '/files/documentation/sass.html'

  get_options: ->
    _.extend(
      @$super()
      profile: 'css'
    )
)
PythonEditor = ProgramEditor.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'python'
    @loadWorker('javascript')
    @loadThrottledExecution()
    @marker = null
    @documentationUrl = '/python/documentation/'

  __include__: [serverCompiler]

  load: ->
    @$super()
    viewModel.add_resource base_url + '/js/pylib.js'
    @hint = CodeMirror.pythonHint
    @addAutocomplete CodeMirror.pythonHint.pylibKeywords

  preview: (javascript) ->
    codeRunner.execute javascript

  displayError: (message) ->
    @$super(message.replace('Parse error ', ''))

  markError: (error) ->
    @displayNotification error
    linePattern = /line\s(\d+)/
    columnPattern = /column\s(\d+)/
    lineNumber = parseInt(linePattern.exec(error)[1]) - 1
    columnNumber = parseInt(columnPattern.exec(error)[1]) - 1
    lineString = @pad.getLine(lineNumber)
    scannerPosition = undefined
    scannerPosition = columnNumber
    while lineString.charAt(scannerPosition) is ' '
      scannerPosition++
    while scannerPosition < lineString.length and lineString.charAt(scannerPosition) isnt ' '
      scannerPosition++
    @marker?.clear()
    @marker = @pad.markText(
        line: lineNumber
        ch: columnNumber
      ,
        line: lineNumber
        ch: scannerPosition
      ,
        className: 'syntax-error'
    )

  clearLineWidget: ->
    @marker?.clear()
)
HtmlChecker = Class.$extend(
  __init__: ->

  observe: (editor) ->
    editor.attach @

  update: (editor) ->
    html = editor.get_compiled_code()
    if /<!DOCTYPE|<html|<body/g.test html
      noty text: 'Please do not enter doctype, body etc. into the HTML panel. These tags are placed automatically.', type: 'warning'
)
Viewer = Class.$extend(
  __init__: (id) ->
    @id = id

  set_code: (code) ->
    CodeMirror.runMode(code, @mode, document.getElementById(@id))

  observe: (editor) ->
    editor.attach @

  update: (editor) ->
    @set_code editor.get_compiled_code()
)
HtmlViewer = Viewer.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'htmlmixed'
)
CssViewer = Viewer.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'css'

  setIframeCss: (css) ->
    cssElement = document.getElementById(@id).contentWindow.css
    cssElement.textContent = css
    document.getElementById(@id).contentWindow.Highlight.init(cssElement)

  set_code: (css) ->
    if viewModel.newFiddle()
      @setIframeCss css
    else
      timer = setInterval(
        =>
          if document.getElementById(@id)?.contentWindow?.loaded
            @setIframeCss css
            clearInterval timer
        250
      )
)
JavascriptViewer = Viewer.$extend(
  __init__: (id) ->
    @$super id
    @mode = 'javascript'

  update: (editor) ->
    @$super editor
    $('#' + @id + ' .cm-property').each(->
      $element = $(this)
      if $element.text() in KEYWORDS.JQUERY_OBJECT and $element.prev().text() is '$'
        $element.html "<a href='http://api.jquery.com/jQuery.#{ $element.text() }/' target='_blank'>#{ $element.text() }</a>"
      else if $element.text() in KEYWORDS.JQUERY_PROTOTYPE and $element.prev().prev().text() is '$'
        $element.html "<a href='http://api.jquery.com/#{ $element.text() }/' target='_blank'>#{ $element.text() }</a>"
      else if $element.text() of keywordDict(KEYWORDS.DOM)
        $element.html "<a href='http://dochub.io/#dom/#{ keywordDict(KEYWORDS.DOM)[$element.text()] }' target='_blank'>#{ $element.text() }</a>"
    )
)
BeautifiedJavascriptViewer = JavascriptViewer.$extend(
  set_code: (javascript) ->
    @$super js_beautify(javascript)
)
codeConverter =
  loadConverter: (id) ->
    @textarea = $('#' + id)
    @previousValue = new String
    @textarea.bind(
      'keyup blur'
      =>
        @changeHandler()
    )

  changeHandler: _.throttle(
    ->
      if @textarea.val() isnt @previousValue
        @previousValue = @textarea.val()
        $.post(
          ['http://fiddlesalad.com/',  @editor.mode, '/convert/'].join('')
          code: @textarea.val()
          (response) =>
            @previewCode(response[@editor.mode])
          'json'
        )
    500
  )

  set_editor: (@editor) ->

  previewCode: (convertedCode) ->
  # when the user pastes JavaScript code, it is inserted at the cursor position in the CoffeeScript editor
  # get the character position of the cursor
    position = @editor.pad.getCursor()
    # insert block after the cursor in the line
    cursorPositionLine = @editor.pad.getLine(position.line)
    # replace line in code
    lines = @editor.get_code().split('\n')
    # insert at the cursor position
    lines[position.line] = cursorPositionLine.slice(0, position.ch) + convertedCode + cursorPositionLine.slice(position.ch)
    @editor.set_code lines.join('\n')

JavascriptConverter = Class.$extend(
  __init__: (id) ->
    @loadWorker('js2coffee')
    @loadConverter(id)

  __include__: [BackgroundWorker, codeConverter]

  changeHandler: _.throttle(
    ->
      if @textarea.val() isnt @previousValue
        @compiler.postMessage @textarea.val()
        @previousValue = @textarea.val()
    500
  )
)
HtmlConverter = Class.$extend(
  __init__: (id) ->
    @loadConverter(id)

  __include__: [codeConverter]
)
HtmlJadeConverter = HtmlConverter.$extend(
  previewCode: (jade) ->
    jade = jade
      .replace('html\n', '')
      .replace(/.*body\n/, '')
      .replace(/^\s\s/, '')
      .replace(/\n\s\s/, '\n')
    @$super($.trim(jade))
)
CssConverter = Class.$extend(
  __init__: (id) ->
    @loadConverter(id)

  __include__: [codeConverter]
)
FiddleEditor = Class.$extend(
  __init__: (@settings) ->
    @id =
      document : 'document'
      style : 'style'
      program : 'program'
      css : 'cssViewer'
      javascript : 'javascriptViewer'
      html : 'htmlViewer'

    view_model.styleLanguage = @settings.get_language LANGUAGE_TYPE.STYLE
    view_model.documentLanguage = @settings.get_language LANGUAGE_TYPE.DOCUMENT
    view_model.programLanguage = @settings.get_language LANGUAGE_TYPE.PROGRAM

    @documentEditor = @settings.get_editor(LANGUAGE_TYPE.DOCUMENT) @id.document
    @styleEditor = @settings.get_editor(LANGUAGE_TYPE.STYLE) @id.style
    @programEditor = @settings.get_editor(LANGUAGE_TYPE.PROGRAM) @id.program

    @cssViewer = CssViewer @id.css
    @cssViewer.observe @styleEditor
    if @settings.get_editor(LANGUAGE_TYPE.PROGRAM) is LANGUAGE.PYTHON
      @javascriptViewer = BeautifiedJavascriptViewer @id.javascript
    else
      @javascriptViewer = JavascriptViewer @id.javascript
    @javascriptViewer.observe @programEditor
    @htmlChecker = HtmlChecker()
    @htmlChecker.observe @documentEditor
    if @showHtmlSource()
      @htmlViewer = HtmlViewer @id.html
      @htmlViewer.observe @documentEditor

    @codeStorage = CodeStorage(@settings)
    @diffViewer = DiffViewer 'compare', @settings

  load: ->
    @keyboradShortcutLetters = new Array
    @keyListener = new KeyListener
    @registerKeyboardShortcut @id.document, @documentEditor, @getKeyboardShortcut(@settings.get_language(LANGUAGE_TYPE.DOCUMENT))
    @registerKeyboardShortcut @id.style, @styleEditor, @getKeyboardShortcut(@settings.get_language(LANGUAGE_TYPE.STYLE))
    @registerKeyboardShortcut @id.program, @programEditor, @getKeyboardShortcut(@settings.get_language(LANGUAGE_TYPE.PROGRAM))

    $('#projectConfiguration, #featuredFiddles').css('max-height', $(window).height() - 175 - 28)
    viewModel.containers @layoutFrames()
    $('#viewer').appendTo('#result').show()
    root.codeRunner = CodeRunner()
    viewModel.add_resource(if debug then base_url + '/js/jquery-2.0.0.js' else 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js')

    @styleEditor.load()
    @documentEditor.load()
    @programEditor.load()

  get_code: (type) ->
    switch type
      when LANGUAGE_TYPE.STYLE
        @styleEditor.get_code()
      when LANGUAGE_TYPE.DOCUMENT
        @documentEditor.get_code()
      when LANGUAGE_TYPE.PROGRAM
        @programEditor.get_code()
      when LANGUAGE_TYPE.COMPILED_PROGRAM
        @programEditor.get_compiled_code()
      when LANGUAGE_TYPE.COMPILED_DOCUMENT
        @documentEditor.get_compiled_code()
      when LANGUAGE_TYPE.COMPILED_STYLE
        @styleEditor.get_compiled_code()
      else
        @codeStorage.set_code @programEditor.get_code(), LANGUAGE_TYPE.PROGRAM
        @codeStorage.set_code @programEditor.get_compiled_code(), LANGUAGE_TYPE.COMPILED_PROGRAM
        @codeStorage.set_code @documentEditor.get_code(), LANGUAGE_TYPE.DOCUMENT
        @codeStorage.set_code @styleEditor.get_code().replace(@styleEditor.get_framework(), ''), LANGUAGE_TYPE.STYLE
        @codeStorage.set_code ko.toJSON(viewModel.resources()), LANGUAGE_TYPE.RESOURCE
        @codeStorage.set_code ko.toJSON(viewModel.frameworks()), LANGUAGE_TYPE.FRAMEWORK
        @codeStorage.get_file()

  set_code: (code, type) ->
    return  unless code.length
    switch type
      when LANGUAGE_TYPE.STYLE
        @styleEditor.set_code code
      when LANGUAGE_TYPE.DOCUMENT
        @documentEditor.set_code code
      when LANGUAGE_TYPE.PROGRAM
        @programEditor.set_code code
      when LANGUAGE_TYPE.COMPILED_PROGRAM
        @javascriptViewer.set_code code
        @programEditor.set_compiled_code code
      when LANGUAGE_TYPE.COMPILED_DOCUMENT
        @documentEditor.set_code code
      when LANGUAGE_TYPE.COMPILED_STYLE
        @styleEditor.set_code code
      when LANGUAGE_TYPE.FRAMEWORK
        @styleEditor.set_framework code
      else
        @codeStorage.set_file code
        viewModel.resources []
        codeRunner.scripts = []
        resources = @codeStorage.get_code(LANGUAGE_TYPE.RESOURCE)
        unless resources is '[]'
          _.each ko.utils.parseJson(resources), (resource) ->
            viewModel.add_resource resource.source
        frameworks = @codeStorage.get_code(LANGUAGE_TYPE.FRAMEWORK)
        unless frameworks is '[]'
          _.each ko.utils.parseJson(frameworks), (frameworkName) ->
            viewModel.add_framework frameworkName

        @documentEditor.set_code @codeStorage.get_code(LANGUAGE_TYPE.DOCUMENT)
        @styleEditor.set_code @codeStorage.get_code(LANGUAGE_TYPE.STYLE)
        @programEditor.set_code @codeStorage.get_code(LANGUAGE_TYPE.PROGRAM)

  execute: ->
    codeRunner.debug()

  get_primary_language: ->
    codeComplexity = {}
    codeComplexity[@documentEditor.get_code_complexity()] = @settings.get_language LANGUAGE_TYPE.DOCUMENT
    codeComplexity[@styleEditor.get_code_complexity()] = @settings.get_language LANGUAGE_TYPE.STYLE
    codeComplexity[@programEditor.get_code_complexity()] = @settings.get_language LANGUAGE_TYPE.PROGRAM
    codeComplexity[Math.max(_.keys(codeComplexity)...)]

  layoutFrames: ->
    if $(window).width() < 1200
      layout = ColumnLayout 2
    else
      layout = ColumnLayout 3

      frame = Frame 'documentation', 'Documentation'
      layout.add_column frame
      tabs = TabInterface 'documentation-tabs', frame
      dochubPage = IframeComponent name + 'ReferenceTab'
      dochubPage.set_source 'http://dochub.io/'
      dochubTab = {title: 'dochub', content: dochubPage.to_html_string()}
      switch LANGUAGE_CATEGORY[engine.get_url_path_language()]
        when LANGUAGE_TYPE.PROGRAM
          editorDocumentation = [@programEditor.get_documentation(), @styleEditor.get_documentation(), @documentEditor.get_documentation()]
        when LANGUAGE_TYPE.DOCUMENT
          editorDocumentation = [@documentEditor.get_documentation(), @styleEditor.get_documentation(), @programEditor.get_documentation()]
        else
          editorDocumentation = [@styleEditor.get_documentation(), @programEditor.get_documentation(), @documentEditor.get_documentation()]
      editorDocumentation.push(dochubTab)  if not debug
      for documentation in _.filter(editorDocumentation, (tabSetting) -> _.isObject(tabSetting))
        tabs.add documentation.title, documentation.content
      page = IframeComponent 'jqueryReferenceTab'
      page.set_source base_url + '/files/documentation/jquery/index.html?v=2013062511'
      tabs.add 'jquery', page.to_html_string()
      if @settings.get_language(LANGUAGE_TYPE.STYLE) in COMPATIBLE_LANGUAGES.CSS or @settings.get_language(LANGUAGE_TYPE.DOCUMENT) in COMPATIBLE_LANGUAGES.HTML
        page = IframeComponent 'emmetReferenceTab'
        page.set_source 'http://docs.emmet.io/cheat-sheet/'
        tabs.add 'emmet', page.to_html_string()
      frame.add tabs

    editor_frames = new Array
    if LANGUAGE_CATEGORY?[engine.get_url_path_language()] is LANGUAGE_TYPE.PROGRAM
      panelOrdering = [[@id.document, @getLanguageHeading @settings.get_language(LANGUAGE_TYPE.DOCUMENT)], [@id.program, @getLanguageHeading @settings.get_language(LANGUAGE_TYPE.PROGRAM)], [@id.style, @getLanguageHeading @settings.get_language(LANGUAGE_TYPE.STYLE)]]
    else
      panelOrdering = [[@id.document, @getLanguageHeading @settings.get_language(LANGUAGE_TYPE.DOCUMENT)], [@id.style, @getLanguageHeading @settings.get_language(LANGUAGE_TYPE.STYLE)], [@id.program, @getLanguageHeading @settings.get_language(LANGUAGE_TYPE.PROGRAM)]]
    for frame_setting, editorIndex in panelOrdering
      frame = Frame frame_setting[0] + 'container', frame_setting[1]
      editor = EditorComponent frame_setting[0]
      if editorIndex is 0
        editor.focus_on_initialization()
      frame.add editor
      editor_frames.push frame
    layout.add_column editor_frames

    frames = new Array
    resultFrame = Frame 'result', 'Result'
    frames.push resultFrame

    # source preview tabs
    previewFrame = Frame 'source', 'Source'
    tabs = TabInterface 'source-tab', previewFrame
    preview = IframeComponent @id.css
    preview.set_source if debug then base_url + '/files/csspreviewer.debug.html' else 'http://fiddlesalad.com/home/files/csspreviewer.html?v=2013070320'
    index = tabs.add 'css', preview.to_html_string()
    @styleEditor.set_focus_listener PreviewListener('source', index)

    preview = PreviewComponent @id.javascript
    index = tabs.add 'javascript', preview.to_html_string()
    @programEditor.set_focus_listener PreviewListener('source', index)

    if @showHtmlSource()
      preview = PreviewComponent @id.html
      index = tabs.add 'html', preview.to_html_string()
      @documentEditor.set_focus_listener PreviewListener('source', index)

    previewFrame.add tabs
    frames.push previewFrame

    layout.add_column frames

    result_x = resultFrame.get_location().x
    preview_y = previewFrame.get_location().y
    shareFrame = Frame 'sharecontainer', 'Share'
    shareFrame.set_location(x: result_x, y: preview_y - 100)
    shareFrame.set_size(width: 200, height: 80)
    shareBox = TemplateComponent 'share'
    shareBox.set_template 'shareTemplate'
    shareFrame.add shareBox

    columnLayoutFrames = layout.get_frames()
    if not debug
      columnLayoutFrames.push shareFrame
    columnLayoutFrames

  compare_revisions: (older, newer) ->
    @diffViewer.set_revisions older, newer
    @diffViewer.compare_language_type LANGUAGE_TYPE.DOCUMENT

  showHtmlSource: ->
    not (@settings.get_language(LANGUAGE_TYPE.DOCUMENT) in COMPATIBLE_LANGUAGES.HTML)

  getRelatedLanguages: (primaryLanguage) ->
    relatedLanguages = new Array
    for language, languageType of LANGUAGE_CATEGORY
      if languageType is LANGUAGE_CATEGORY[primaryLanguage]
        relatedLanguages.push language
    _.reject relatedLanguages, (language) => language is primaryLanguage

  getLanguageHeading: (language) ->
    menuItemTemplate = _.template('<li><a><%= text %></a></li>')
    alternativeMenuItems = _.map(@getRelatedLanguages(language), (relatedLanguage) ->
        menuItemTemplate text: relatedLanguage
      )
    languageMenu = """
      <ul class="menu">
        <li class="primary"><a>#{ language }</a>
            <ul>
               #{ alternativeMenuItems.join('') }
            </ul>
        </li>
      </ul>"""
    heading = ['<div class="clearfix"><div class="left">', languageMenu, '</div>' ]
    unless bowser.opera
      heading.push '<div class="right"><span class="key-lite">', @getKeyboardShortcut(language), '</span></div>'
    heading.push '</div>'
    heading.join('')

  getKeyboardShortcut: _.memoize((language) ->
    languageFirstLetter = language.charAt(0).toUpperCase()
    if @keyboradShortcutLetters.indexOf(languageFirstLetter) is -1
      @keyboradShortcutLetters.push languageFirstLetter
      'Alt ' + language.charAt(0).toUpperCase()
    else
      'Alt Shift ' + language.charAt(0).toUpperCase()
  )

  registerKeyboardShortcut: (dialogId, editor, shortcut) ->
    @keyListener.on(
      shortcut
      ->
        $('#' + dialogId + 'container').parent().wijdialog 'moveToTop'
        editor.focus()
    )
)
DiffViewer = Class.$extend(
  __init__: (@id, @settings) ->
    @olderTimestamp = new String
    @newerTimestamp = new String

  set_revisions: (olderTimestamp, newerTimestamp) ->
    return  if @olderTimestamp is olderTimestamp and @newerTimestamp is newerTimestamp
    @olderTimestamp = olderTimestamp
    @newerTimestamp = newerTimestamp
    @olderRevision = CodeStorage @settings
    @newerRevision = CodeStorage @settings
    @olderRevision.set_file store.get(olderTimestamp)
    @newerRevision.set_file store.get(newerTimestamp)

  openCompareWindow: ->
    layout = ColumnLayout 1
    title = HtmlComponent 'compareLanguageSelection'
    revisionFrame = Frame(@id, 'Compare Revisions' + title.to_html_string())
    revisionFrame.buttons.maximize = false
    layout.add_column revisionFrame
    viewModel.containers.push _.first(layout.get_frames())
    $('#compareLanguageSelection input').change =>
      @compare_language_type $('#compareLanguageSelection input:checked').val()
    revisionFrame.get_size()

  compare_language_type: (type) ->
    if not $('#' + @id).length
      dimensions = @openCompareWindow()
      $('#' + @id).mergely
        width: dimensions.width
        height: dimensions.height - 36
        cmsettings:
          readOnly: false
          lineNumbers: true

        lhs: (setValue) =>
          setValue @olderRevision.get_code(type)

        rhs: (setValue) =>
          setValue @newerRevision.get_code(type)
    else
      $('#' + @id).parent().wijdialog('open')
      $('#' + @id).mergely 'lhs', @olderRevision.get_code(type)
      $('#' + @id).mergely 'rhs', @newerRevision.get_code(type)

)
ColumnLayout = Class.$extend(
  __init__: (columns) ->
    panel_size = 195
    @column_width = (getDocumentWidth() - panel_size) / columns
    @document_height = getDocumentHeight()
    @frames = new Array

  add_column: (frames) ->
    if !_.isArray frames
      frames = new Array(frames)
    for frame in frames
      frame.set_size(
        width: @column_width - frame.get_padding(),
        height: @document_height/frames.length - frame.get_padding()
      )
      if @frames.length > 0
        frame.set_location_relative_to _.last(@frames)
      @frames.push frame

  get_frames: ->
    @frames
)
CodeRunner = Class.$extend(
  __init__: ->
    frame = document.getElementById('viewer')
    @window = (if frame.contentWindow then frame.contentWindow else (if frame.contentDocument.document then frame.contentDocument.document else frame.contentDocument))
    @initialized = false
    @scripts = []
    @delayedStyles = []
    @previousHtml = ''

  execute: (javascript=engine.get_code(LANGUAGE_TYPE.COMPILED_PROGRAM), html=engine.get_code(LANGUAGE_TYPE.COMPILED_DOCUMENT)) ->
    return  unless @initialized
    if html != @previousHtml
      @body.innerHTML = html
      @previousHtml = html
    if javascript.length
      @window.execute @scripts, javascript

  format: (css=engine.get_code(LANGUAGE_TYPE.COMPILED_STYLE)) ->
    return  unless @initialized
    while style = @delayedStyles.pop()
      @add_css style
    @style.innerHTML = StyleFix.fix(css)

  initialize: ->
    if not @initialized
      @initialized = true
      @body = @window.document.body
      @style = @window.document.querySelector('#user_css')
      @execute()
      @format()

  filetype: (path) ->
    filePattern = /(css|js)$/
    if path.match(filePattern)
      path.match(filePattern)[0]
    else if path.has 'css'
      'css'
    else
      'js'

  add_javascript: (source) ->
    @scripts.push source

  add_css: (source) ->
    if not @initialized
      @delayedStyles.push source
    else
      style = @window.document.createElement('link')
      style.rel = 'stylesheet'
      style.type = 'text/css'
      style.href = source
      @window.document.getElementsByTagName('head')[0].appendChild style

  add_file: (source) ->
    switch @filetype(source)
      when 'css'
        @add_css source
        true
      when 'js'
        @add_javascript source
        true
      else
        false

  remove_css: (source) ->
    css_links = @window.document.getElementsByTagName('link')
    @window.document.getElementsByTagName('head')[0].removeChild _.find(css_links, (link) ->
        link and link.getAttribute('href')? and link.getAttribute('href').indexOf(source) isnt -1
    )

  reset: ->
    code = engine.get_code()
    @__init__()
    engine.set_code code
    @window.location.reload()

  debug: ->
    ###
    Debug opens a new window with the code loaded in the page. External CSS and JS files are loaded through head tags.
    It assumes all external resources are stored in the view model.
    ###
    template =
      css: _.template '<link rel="stylesheet" type="text/css" href="<%= source %>" />'
      js: _.template '<script type="text/javascript" src="<%= source %>"></script>'
      html: _.template """
            <!DOCTYPE html>
            <html>
              <head>
                <title>Fiddle Salad Debug View</title>
                <script src="http://leaverou.github.com/prefixfree/prefixfree.min.js"></script>
                <style>
                  <%= css %>
                </style>
              </head>
              <body>
                <%= body %>
                <%= headtags %>
                <script type="text/javascript">
                  <%= javascript %>
                </script>
              </body>
            </html>
            """
    # initialize array of head tags
    headTags = new Array
    # for each external resource in view model
    _.each viewModel.resources(), (resource) =>
      # get the file type of the resource, call mapped template with resource, and append generated HTML to head tags
      headTags.push template[@filetype resource.source()](source: resource.source())
    headtags = headTags.join('')
    # get JavaScript and CSS code from the engine
    javascript = engine.get_code LANGUAGE_TYPE.COMPILED_PROGRAM
    body = engine.get_code LANGUAGE_TYPE.COMPILED_DOCUMENT
    css = engine.get_code LANGUAGE_TYPE.COMPILED_STYLE
    # call the template for the window with the head tags and code
    html = template.html {javascript, css, body, headtags}
    # open window with generated HTML
    window.open 'data:text/html;charset=utf-8,' + encodeURIComponent(html)
    # display message about new window and links to browser console documentation
    if bowser.firefox
      documentationUrl = 'http://getfirebug.com/'
      consoleName = 'Firebug'
    else if bowser.opera
      documentationUrl = 'http://www.opera.com/dragonfly/'
      consoleName = 'Opera Dragonfly'
    else
      documentationUrl = 'http://code.google.com/chrome/devtools/docs/console.html'
      consoleName = 'Chrome Console'
    @window.document.body.innerHTML = """
      <h3>Console Debug</h3>
      <p>
        A new page has been created for you to debug JavaScript. Launch <a target="_blank" href="#{ documentationUrl }">#{ consoleName }</a>
        to start your debugging session.
      </p>
      """
)
FiddleFactory = Class.$extend(
  __init__: ->
    document.getElementById('progress')?.value = 30
    @display_browser_warning()
    @code = document.getElementById('snippet').value
    if @code.length
      settings = @loadLanguages(@code)
    else
      settings = @detectLanguages()
    @editor = FiddleEditor(settings)

  display_browser_warning: ->
    return  if bowser.chrome and bowser.version >= 3
    return  if bowser.firefox and bowser.version >= 3.5
    return  if bowser.safari and bowser.version >= 4
    return  if bowser.opera and bowser.version >= 10.6
    alert 'You are using an unsupported browser.\nTry Chrome, Firefox, Safari, or Opera.'

  get_url_path_language: ->
    languagePart = window.location.pathname.split('/')[1]
    if languagePart.length and languagePart.indexOf('-') is -1
      languagePart
    else
      'python'

  detectLanguages: ->
    ###
    This routine detects the programming languages to be loaded. It reads from the URL and retrieves comma-separated
    languages from storage. The URL segment can override one of the languages from storage. If no language setting is
    stored, it uses defaults. It returns a language setting object.
    ###
    #  read from the URL segment and storage
    primaryLanguage = @get_url_path_language()
    secondaryLanguages = if store.get('languages')? then store.get('languages').split(',') else [LANGUAGE.HTML, LANGUAGE.LESS, LANGUAGE.JAVASCRIPT]
    #  if language in URL overrides a language from storage in its category, then replace it
    for language, languageIndex in secondaryLanguages
      if LANGUAGE_CATEGORY[language] is LANGUAGE_CATEGORY[primaryLanguage]
        secondaryLanguages[languageIndex] = primaryLanguage
    Language secondaryLanguages

  loadLanguages: (storageJSON) ->
    Language _.keys(JSON.parse(storageJSON))

  layout: ->
    $('#snippet, #progress').remove()
    $('#documentation, #source').parent().scrollTop(0)
    $('#logo').click(-> window.open('/'))
    $('.menu').wijmenu(
      select: (event, data) ->
        selectedItem = data.item
        return  if 'primary' in selectedItem.attr('class').split(/\s+/)
        languages = new Array
        $('ul.menu li.primary > a').each(-> languages.push $(this).text())
        languages = _.without languages, selectedItem.parents('.primary').find('a:first').text()
        selectedLanguage = selectedItem.text()
        languages.push selectedLanguage
        store.set('languages', languages.join(','))
        window.open("/#{ selectedLanguage }/")
      showDelay: 0
    )
    $('.menu').show()
    unless bowser.webkit
      $('.ui-dialog-title').css(position: 'static', height: '1em')

  get_view_model: ->
    document.getElementById('progress')?.value = 90
    FiddleViewModel()

  load_threads: ->
    @editor.set_code @code

  execute: ->
    @editor.execute()

  reset: ->
    codeRunner.reset()
)
root.editor = {HtmlEditor, LessEditor, PythonEditor, JavascriptEditor, CssEditor, CoffeescriptEditor, SassEditor, ScssEditor, HamlEditor, StylusEditor, JadeEditor, HtmlViewer, CoffeekupEditor, MarkdownEditor, RoyEditor, TypescriptEditor}
root.engine = EngineFactory(FiddleFactory())