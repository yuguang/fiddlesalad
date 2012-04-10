root = global ? window
class KeyListener
  listeners: []

  constructor: (context) ->
    $(context or window).bind 'keydown', (e) =>
      @_onKeyEvent e, @_toKey(e)

  on: (spec, callback) ->
    @listeners.push {spec, callback}

  _onKeyEvent: (e, key) ->
  # metaKey, altKey, shiftKey, keyCode
    _.each @listeners, (listener) =>
      if @_keyMatchesSpec listener.spec, key
        listener.callback()
        e.preventDefault()
        e.stopPropagation()

  # Checks if a given spec (like `Command T`) matches a given key hash.
  _keyMatchesSpec: (spec, key) ->
    match = true

    _.each spec.toUpperCase().split(' '), (fragment) ->
      switch fragment
        when 'COMMAND' then   match = false if !key.cmdKey
        when 'META'    then   match = false if !key.metaKey
        when 'SHIFT'   then   match = false if !key.shiftKey
        when 'ALT'     then   match = false if !key.altKey
        else                  match = false if fragment != key.key

    match

  mappings:
    13: 'ENTER'
    16: 'SHIFTKEY'
    17: 'CTRLKEY'
    18: 'ALTKEY'
    37: 'LEFT'
    38: 'UP'
    39: 'RIGHT'
    40: 'DOWN'
    91: 'METAKEY'
    112: 'F1'
    113: 'F2'
    114: 'F3'
    115: 'F4'
    116: 'F5'
    117: 'F6'
    118: 'F7'
    119: 'F8'

  _toKey: (e) ->
    metaKey:   e.metaKey
    altKey:    e.altKey
    shiftKey:  e.shiftKey
    ctrlKey:   e.ctrlKey
    cmdKey:    e.metaKey || e.ctrlKey
    keyCode:   e.keyCode
    key:       @_toKeyName(e.keyCode)

  _toKeyName: (code) ->
    @mappings[code] || String.fromCharCode(code).toUpperCase()

root.KeyListener = KeyListener