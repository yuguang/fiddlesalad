root = global ? window
Editor = Class.$extend(
  __init__: (id) ->
    @id = id
    @mode = new Object

  load: ->
    @pad = CodeMirror.fromTextArea(document.getElementById(@id), _.defaults(@get_options(), defaultEditor))
    $(@codeMirrorContainer).click => @focus()

  keyHandler: (i, e) ->
    if e.keyCode is 13 and e.ctrlKey
      e.stop()
      engine.execute()

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
    @methodAutoComplete = new CompositeMethodComplete()
    @varDict = new Hint()
    @wordAutoComplete.add @varDict
    @debounceWaitSeconds = 250
    @editCount = 0
    @varClassName = 'cm-variable'
    @extraKeys =
      "Ctrl-Space": =>
        @popupAutocomplete('', true)
      "Tab": =>
        @selectAutocomplete()
      "Enter": =>
        @selectAutocomplete()
      "Esc": =>
        @removeAutocomplete()

  selectAutocomplete: ->
    position = @pad.getCursor()
    token = @pad.getTokenAt(position)
    if WORD_TOKEN.test(token.string) # cursor is at the end of a word
      @popupAutocomplete('', true, true)
    else
      # insert control character
      throw CodeMirror.Pass

  removeAutocomplete: ->
    autoCompleteElements = document.getElementsByClassName("CodeMirror-completions")
    if autoCompleteElements.length
      autoComplete = autoCompleteElements[0]
      autoComplete.parentNode.removeChild(autoComplete)

  get_code_complexity: ->
    @editCount
    
  get_options: ->
    mode: @mode
    theme: if @theme? then @theme else 'default'
    lineNumbers: @showLineNumbers
    onKeyEvent: _.bind(@keyHandler, this)
    onChange: _.debounce(
      (editor, change) =>
        @changeHandler(editor, change)
        @editCount++
      @debounceWaitSeconds
    )
    onFocus: => @focusHandler()
    onCursorActivity: _.bind(@selectionHandler, this)
    extraKeys: @extraKeys

  popupAutocomplete: (lastChar='', immediate=false, tabSelect=false) ->
    # bind pre-fills arguments to the hint function
    CodeMirror.simpleHint @pad, _.bind(@hint, this, @pad, lastChar), immediate, tabSelect

  keyCharacter: (event) ->
    String.fromCharCode(if event.keyCode then event.keyCode else event.which)

  focusHandler: ->

  changeHandler: ->
    
  selectionHandler: ->

  focus: ->
    @$super()
    @removeAutocomplete()

  keyHandler: (editor, event) ->
    if event.keyCode is 13 and event.type is 'keydown' # Enter is not captured on keypress
      if event.ctrlKey
        event.stop()
        engine.execute()
      else
        _.defer => @updateVars()
    if event.type isnt 'keypress'
      return
    else if not (event.keyCode < 41 and event.keyCode > 31) # not a navigation key
      @popupAutocomplete(@keyCharacter(event))

  hint: (editor, lastChar) ->
    currentPosition = editor.getCursor()
    token = editor.getTokenAt(currentPosition)
    start = token.start
    end = token.end
    suggestions = undefined
    return  unless WORD_TOKEN.test(token.string) or WORD_TOKEN.test(lastChar)
    if token.string[0] is '.'
      suggestions = @methodAutoComplete.getCompletions(editor)
      start++
      end++
    else
      suggestions = @wordAutoComplete.getCompletions(editor, lastChar)
      if lastChar.length
        end++
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

  addAutocomplete: (keywords, namespace) ->
    if _.isUndefined(namespace)
      @wordAutoComplete.add new Hint(keywords)
    else
      @methodAutoComplete.add new Hint(keywords), namespace
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