root = global ? window
PythonOnlyEditor = CodeCompleteEditor.$extend(
  __init__: (id) ->
    @$super id
    @showLineNumbers = true
    @mode =
      name: 'python'
      version: 2
      singleLineStringErrors: false

    keywords = [ 'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 'yield' ]
    @addAutocomplete keywords
    @codeMirrorContainer = '.ui-layout-center'
    @extraKeys['Ctrl-Enter'] = -> engine.execute()
    @extraKeys['Ctrl-R'] = -> engine.reset()
    @extraKeys['Ctrl-O'] = -> $('#importDialog').dialog 'open'

  keyHandler: (editor, event) ->
    if event.keyCode is 13
      _.defer prefetchImport
    @$super editor, event
          
  get_primary_language: ->
    'python'
)
PythonFactory = Class.$extend(
  __init__: ->
    code = document.getElementById('editor').value
    prefetchImport(code) if code
    @editor = PythonOnlyEditor('editor')
    @display_browser_warning()
    @lastExecute = new Date()
    @executeInterval = 50
    view_model.programLanguage = 'python'

  display_browser_warning: ->
    return  if bowser.chrome and bowser.version >= 10
    return  if bowser.firefox and bowser.version >= 4
    return  if bowser.safari and bowser.version >= 5
    return  if bowser.msie and bowser.version >= 10
    alert 'You are using an unsupported browser.\nTry Chrome 10+, Firefox 4+, Safari 5+.'

  load_threads: ->
    @worker = new Worker(@get_executable())
    @worker.onmessage = (event) ->
      messageType = event.data.type
      switch messageType
        when ('status')
          switch event.data.statusText
            when ('starting')
              viewModel.output [ '' ]
            when ('busy')
              viewModel.busy true
            when ('done')
              viewModel.busy false
            else
        when ('result')
          output = event.data.resultText
          switch output
            when ('\n')
              output = '<br />'
            when (' ')
              output = '&nbsp;'
            else
          viewModel.output.push output
        else

    @worker.onerror = (event) ->
      console.log event.message, event

  get_executable: ->
    pythonExecutable = undefined
    unless debug
      python_version = '?v=' + 12
      pythonExecutable = worker_url + 'python.compressed.js' + python_version
    else
      pythonExecutable = worker_url + 'build/python.mod.debug.js'
    pythonExecutable

  layout: ->
    $.ajaxSetup cache: true
    $('#logo h1').css 'display', 'none'  if $(window).width() < 780
    $('#shareMenu').toggle 'blind'
    $('body').layout(
      applyDefaultStyles: true
      north__size: 122
    ).allowOverflow 'north'

  get_view_model: ->
    PythonViewModel()

  get_url_path_language: ->
    'python'

  execute: ->
    currentTime = new Date()
    if currentTime - @lastExecute <= @executeInterval
      viewModel.busy true
      @worker.postMessage
        type: 'execute'
        value: engine.get_code()
    @lastExecute = currentTime

  reset: ->
    viewModel.busy true
    @worker.postMessage
      type: 'reset'
      value: ''
)
EmbeddedPythonFactory = PythonFactory.$extend(
  adjust_layout: ->
    $('#run_button').clone().insertBefore('#console').addClass 'right'

  get_layout: ->
    applyDefaultStyles: true
    north__initClosed: true
    east__initClosed: true
    west__initClosed: true
)
root.engine = EngineFactory((->
  if embedded
    EmbeddedPythonFactory()
  else
    PythonFactory()
)())