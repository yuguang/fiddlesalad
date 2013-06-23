root = global ? window
Editor = Class.$extend(
  __init__: (id) ->
    @id = id
    @mode = new Object

  load: ->
    console.log @get_options()  if debug
    @pad = CodeMirror.fromTextArea(document.getElementById(@id), _.defaults(@get_options(), defaultEditor))

  focus: ->
    @pad.focus()
    
  get_code: (t) ->
    @pad.getValue()

  set_code: (code, t) ->
    return  if code.length is 0
    @pad.setValue code
)
CodeCompleteEditor = Editor.$extend(
  __init__: (id) ->
    @id = id
    @mode = new Object
    @showLineNumbers = false
    @numVars = 0
    @wordAutoComplete = new CompositeCodeComplete()
    @varDict = new Hint()
    @wordAutoComplete.add @varDict
    @debounceWaitSeconds = 250
    @editCount = 0
    @varClassName = 'cm-variable'

  get_code_complexity: ->
    @editCount

  load: ->
    @$super()
    @pad.on 'change', _.debounce(
      (editor, change) =>
        @changeHandler(editor, change)
        @editCount++
      @debounceWaitSeconds
    )
    @pad.on 'focus', => @focusHandler()
    @pad.on 'cursorActivity', _.bind(@selectionHandler, this)
    
  get_options: ->
    mode: @mode
    theme: if @theme? then @theme else 'default'
    lineNumbers: @showLineNumbers
    onKeyEvent: _.bind(@keyHandler, this)

  popupAutocomplete: (lastChar='') ->
    # bind pre-fills arguments to the hint function
    CodeMirror.showHint @pad, _.bind(@hint, this, @pad, lastChar), completeSingle: false

  keyCharacter: (event) ->
    String.fromCharCode(if event.keyCode then event.keyCode else event.which)

  focusHandler: ->

  changeHandler: ->

  selectionHandler: ->

  keyHandler: (editor, event) ->
    char = @keyCharacter(event)
    if event.type isnt 'keypress'
      return
    else if WORD_TOKEN.test(char)
      @popupAutocomplete(char)

  hint: (editor, lastChar) ->
    currentPosition = editor.getCursor()
    token = editor.getTokenAt(currentPosition)
    start = token.start
    end = token.end
    if not WORD_TOKEN.test(token.string)
      token = start: currentPosition.ch, end: currentPosition.ch, string: '', state: token.state
    if not token.string.length
      suggestions = @wordAutoComplete.getCompletions(lastChar)
    else
      suggestions = @wordAutoComplete.getCompletions(token.string)
    list: suggestions
    from:
      line: currentPosition.line
      ch: start
    to:
      line: currentPosition.line
      ch: end

  updateVars: ->
    varElements = $(@codeMirrorContainer + ' span.' + @varClassName)
    if @numVars < varElements.length
      _($(varElements.splice(0, varElements.length - @numVars))).each (element) =>
        word = $(element).text()
        @varDict.trie.insert word  if word[0] isnt '.' and word.length > 2
      @numVars = varElements.length

  addAutocomplete: (keywords) ->
    @wordAutoComplete.add new Hint(keywords)
)
EngineFactory = Class.$extend(
  __init__: (factory) ->
    @engine_factory = factory

  layout_workspace: ->
    @engine_factory.layout()

  load_editor: ->
    root.viewModel = @engine_factory.get_view_model()
    ko.applyBindings viewModel
    viewModel.prepare_form()
    @engine_factory.editor.load()
    if $.prototype.wijaccordion then $.prototype.accordion = $.prototype.wijaccordion
    $('#accordion').accordion accordionOptions
    viewModel.load_history()

  load_threads: ->
    @engine_factory.load_threads()

  get_code: (type) ->
    @engine_factory.editor.get_code type

  set_code: (code, type) ->
    @engine_factory.editor.set_code code, type

  execute: ->
    @engine_factory.execute()

  reset: ->
    @engine_factory.reset()
    
  get_primary_language: ->
    @engine_factory.editor.get_primary_language()

  get_url_path_language: ->
    @engine_factory.get_url_path_language()

  compare_revisions: (older, newer) ->
    @engine_factory.editor.compare_revisions(older, newer)
    
)
root.Editor = Editor
root.CodeCompleteEditor = CodeCompleteEditor
root.EngineFactory = EngineFactory