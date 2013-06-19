root = global ? window
PythonOnlyEditor = CodeCompleteEditor.$extend(
  __init__: (id) ->
    @$super id
    @showLineNumbers = true
    @mode =
      name: 'python'
      version: 2
      singleLineStringErrors: false

    keywords = ['and', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'exec', 'finally', 'for', 'from', 'global', 'import', 'lambda', 'not', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 'yield', 'input()', 'abs()', 'divmod()', 'input()', 'open()', 'staticmethod()', 'all()', 'enumerate()', 'int()', 'ord()', 'str()', 'any()', 'eval()', 'isinstance()', 'pow()', 'sum()', 'basestring()', 'issubclass()', 'super()', 'bin()', 'file()', 'iter()', 'property()', 'tuple()', 'bool()', 'filter()', 'len()', 'range()', 'type()', 'bytearray()', 'float()', 'list()', 'raw_input()', 'unichr()', 'callable()', 'format()', 'locals()', 'reduce()', 'unicode()', 'chr()', 'frozenset()', 'long()', 'reload()', 'vars()', 'classmethod()', 'getattr()', 'map()', 'repr()', 'xrange()', 'cmp()', 'globals()', 'max()', 'reversed()', 'zip()', 'compile()', 'hasattr()', 'round()', 'complex()', 'hash()', 'min()', 'set()', 'apply()', 'delattr()', 'help()', 'next()', 'setattr()', 'buffer()', 'dict()', 'hex()', 'object()', 'slice()', 'coerce()', 'dir()', 'oct()', 'sorted()', 'intern()']
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
    @lastExecute = new Date()
    @executeInterval = 50
    @substituteLoaded = false
    view_model.programLanguage = 'python'

  display_browser_warning: ->
    return  if bowser.chrome and bowser.version >= 10
    return  if bowser.firefox and bowser.version >= 4
    return  if bowser.safari and bowser.version >= 5
    return  if bowser.msie and bowser.version >= 10
    $('#browserDialog').dialog(modal: true, width:'auto', create: ->
      $('#fallback-ignore').click( ->
        $('#browserDialog').dialog('close')
      )
    )

  substitute_worker: ->
    window.Worker = (a) ->
      b = undefined
      c = {}
      if typeof window isnt 'undefined'
        b = window
      else b = global  if global
      if b.document and not b.require
        b.require = (a) ->
          $LAB.script a
      c.onmessage = ->

      c.postMessage = (a) ->
        setTimeout (->
          b.onmessage data: a
        ), 10

      b.postMessage = (a) ->
        c.onmessage
          data: a
          type: 'message'

      require a
      c

  load_threads: (finishedLoadingCallback) ->
    return  if not Worker?
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
              if finishedLoadingCallback
                do finishedLoadingCallback
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
      python_version = '?v=' + 13
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
    @display_browser_warning()

  get_view_model: ->
    PythonViewModel()

  get_url_path_language: ->
    'python'

  execute: ->
    currentTime = new Date()
    if currentTime - @lastExecute > @executeInterval
      viewModel.busy true
      code = engine.get_code()
      executeCode = =>
        @worker.postMessage
          type: 'execute'
          value: engine.get_code()
      if /input/.test(code) and not @substituteLoaded
        @substitute_worker()
        @substituteLoaded = true
        @load_threads(_.once executeCode)
      else
        do executeCode
      @lastExecute = currentTime

  reset: ->
    viewModel.busy true
    @worker.postMessage
      type: 'reset'
      value: ''
)
EmbeddedPythonFactory = PythonFactory.$extend(
  layout: ->
    $('body').layout(
      applyDefaultStyles: true
      north__initClosed: true
      east__initClosed: true
      west__initClosed: true
    )
    $('#run_button').clone().insertBefore('#console').addClass 'right'
)
root.engine = EngineFactory((->
  if embedded
    EmbeddedPythonFactory()
  else
    PythonFactory()
)())