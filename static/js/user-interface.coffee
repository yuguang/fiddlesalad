root = global ? window
VisualComponent = Class.$extend(
  __init__: (id) ->
    @id = id
)
TabInterface = VisualComponent.$extend(
  __init__: (id) ->
    @id = id
    @type = 'tabs'
    @tabs = new Array
    @tab_count = 0

  add: (title='', content='') ->
    @tabs.push { title, content, id: @getId() }
    @tab_count++

  getId: ->
    @id + @tab_count
)
SourceComponent = VisualComponent.$extend(
  to_html_string: ->
    html = new Array
    html.push '<', @tag
    attributes = _.difference(_.keys(this), ['type', '$class', 'tag'])
    for attribute in attributes
      html.push ' ', attribute, '="', @[attribute], '"'
    html.push '></', @tag, '>'
    html.join('')
)
PreviewComponent = SourceComponent.$extend(
  __init__: (id) ->
    @id = id
    @type = 'preview'
    @tag = 'pre'
    @class = 'cm-s-default'
)
IframeComponent = SourceComponent.$extend(
  __init__: (id) ->
    @id = id
    @type = 'iframe'
    @src = ''
    @tag = 'iframe'

  set_source: (link) ->
    @src = link
)
HtmlComponent = SourceComponent.$extend(
  __init__: (id) ->
    @id = id
    @type = 'html'

  to_html_string: ->
    html = $('#' + @id).show().clone().wrap('<div>').parent().html()
    $('#' + @id).remove()
    html
)
TemplateComponent = VisualComponent.$extend(
  __init__: (id) ->
    @id = id
    @type = 'template'
    @template = ''

  set_template: (name) ->
    @template = name
)
EditorComponent = VisualComponent.$extend(
  __init__: (id, editor) ->
    @id = id
    @type = 'editor'
    @autofocus = false

  focus_on_initialization: ->
    @autofocus = true
)
Frame = VisualComponent.$extend(
  __init__: (id, title) ->
    @id = id
    @title = title
    @type = 'frame'
    @dimension =
      width: 0
      height: 0
    @location =
      x: 0
      y: 0
    @components = new Array
    @buttons =
      minimize: true
      close: true
      pin: false
      refresh: false
    if title is 'Result'
      @buttons.pin = true
      @buttons.refresh = true

  get_size: ->
    @dimension

  set_size: (dimension) ->
    @dimension = dimension

  get_location: ->
    @location

  set_location: (point) ->
    @location = point

  getAlignmentX: ->
    @dimension.width + @location.x

  getAlignmentY: ->
    @dimension.height + @location.y

  set_location_relative_to: (frame) ->
    viewport_bottom = getDocumentHeight()
    if frame.getAlignmentY() >= viewport_bottom
      @location.x = frame.getAlignmentX()
      @location.y = 0
    else
      @location.x = frame.get_location().x
      @location.y = frame.getAlignmentY()

  add: (component) ->
    @components.push component
    if component.type isnt 'editor'
      @buttons.minimize = false
)
FocusListener = Class.$extend(
  focus_gained: ->
)
PreviewListener = FocusListener.$extend(
  __init__: (tabsId, tabIndex) ->
    @tabsId = tabsId
    @tabIndex = tabIndex

  focus_gained: ->
    @openTab()

  openTab: ->
    $('#' + @tabsId + ' .ui-tabs').tabs('select', @tabIndex)
)
root.VisualComponent = VisualComponent
root.TabInterface = TabInterface
root.SourceComponent = SourceComponent
root.PreviewComponent = PreviewComponent
root.IframeComponent = IframeComponent
root.HtmlComponent = HtmlComponent
root.TemplateComponent = TemplateComponent
root.Frame = Frame
root.FocusListener = FocusListener
root.PreviewListener = PreviewListener
root.EditorComponent = EditorComponent