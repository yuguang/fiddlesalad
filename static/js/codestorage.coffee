root = global ? window
Language = Class.$extend(
  __init__: (languages) ->
    @settings = new Object
    #  for each language
    for language in languages
    #  if the language is in category
      if LANGUAGE_CATEGORY?[language]
      #  set language for the category
        @set_language language, LANGUAGE_CATEGORY[language]
    @settings[LANGUAGE_TYPE.RESOURCE] = LANGUAGE.RESOURCE
    @settings[LANGUAGE_TYPE.COMPILED_PROGRAM] = LANGUAGE.JAVASCRIPT
    @settings[LANGUAGE_TYPE.FRAMEWORK] = LANGUAGE.FRAMEWORK

  set_language: (name, type) ->
    # the programming language is set twice, but other programming languages have precedence over javascript
    return  if type is LANGUAGE_TYPE.PROGRAM and type of @settings and @settings[type] isnt LANGUAGE.JAVASCRIPT
    @settings[type] = name

  get_language: (type) ->
    @settings[type]

  get_editor: (type) ->
    window.editor[@capitalizeFirstLetter(@settings[type]) + 'Editor']

  capitalizeFirstLetter: (string) ->
    string.charAt(0).toUpperCase() + string.slice(1)
)
CodeStorage = Class.$extend(
  __init__: (config) ->
    @code = new Object
    @config = config

  set_code: (code, type) ->
    @code[@config.get_language(type)] = code

  get_code: (type) ->
    @code[@config.get_language(type)]

  set_file: (code) ->
    @code = $.parseJSON(code)

  get_file: ->
    JSON.stringify @code
)
root.Language = Language
root.CodeStorage = CodeStorage