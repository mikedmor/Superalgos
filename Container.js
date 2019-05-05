
function newContainer () {
  let thisObject = {
    id: Math.trunc(Math.random() * 10000000),
    type: 'Rectangle',
    frame: undefined,
    displacement: undefined,
    eventHandler: undefined,
    parentContainer: undefined,
    isDraggeable: true,
    isClickeable: false,
    isWheelable: false,
    detectMouseOver: false,
    name: undefined,
    initialize: initialize,
    finalize: finalize,
    connectToParent: connectToParent,
    isForThisPurpose: isForThisPurpose
  }

  let connectedToParentWidth = false
  let connectedToParentHeight = false
  let connectedToParentRadius = false

  let onDimmensionsChangedParentEvent = false
  let onMouseOverParentEvent = false
  let onMouseNotOverParentEvent = false

  let isConnectedToParent = false

  let dimensionsChangedEventSubscriptionId
  let onMouseOverEventSubscriptionId
  let onMouseNotOverEventSubscriptionId

  return thisObject

  function finalize () {
    if (isConnectedToParent === true) {
      thisObject.parentContainer.eventHandler.stopListening(dimensionsChangedEventSubscriptionId)
      thisObject.parentContainer.eventHandler.stopListening(onMouseOverEventSubscriptionId)
      thisObject.parentContainer.eventHandler.stopListening(onMouseNotOverEventSubscriptionId)
    }
  }

  function initialize (pName, pType) {
    thisObject.name = pName
    thisObject.type = pType

    thisObject.frame = newFrame()
    thisObject.frame.initialize(pType)
    thisObject.frame.containerName = pName
    thisObject.frame.container = thisObject

    thisObject.eventHandler = newEventHandler()
    thisObject.eventHandler.name = pName

    thisObject.displacement = newDisplacement()
    thisObject.displacement.container = thisObject
    thisObject.displacement.containerName = pName
  }

  function connectToParent (parentContainer, onWidth, onHeight, onRadius, onDimmensionsChangedEvent, onMouseOverEvent, onMouseNotOverEvent) {
    connectedToParentWidth = onWidth
    connectedToParentHeight = onHeight
    connectedToParentRadius = onRadius

    onDimmensionsChangedParentEvent = onDimmensionsChangedEvent
    onMouseOverParentEvent = onMouseOverEvent
    onMouseNotOverParentEvent = onMouseNotOverEvent

    isConnectedToParent = true

    thisObject.displacement.parentDisplacement = parentContainer.displacement
    thisObject.frame.parentFrame = parentContainer.frame
    thisObject.parentContainer = parentContainer

    if (onDimmensionsChangedParentEvent === true) {
      dimensionsChangedEventSubscriptionId = thisObject.parentContainer.eventHandler.listenToEvent('Dimmensions Changed', onParentDimmensionsChanged)
    }
    if (onMouseOverParentEvent === true) {
      onMouseOverEventSubscriptionId = thisObject.parentContainer.eventHandler.listenToEvent('onMouseOver', onMouseOver)
    }
    if (onMouseNotOverParentEvent === true) {
      onMouseNotOverEventSubscriptionId = thisObject.parentContainer.eventHandler.listenToEvent('onMouseNotOver', onMouseNotOver)
    }

    if (connectedToParentWidth) {
      thisObject.frame.width = thisObject.parentContainer.frame.width
    }
    if (connectedToParentHeight) {
      thisObject.frame.height = thisObject.parentContainer.frame.height
    }
    if (connectedToParentRadius) {
      thisObject.frame.radius = thisObject.parentContainer.frame.radius
    }
  }

  function onParentDimmensionsChanged (event) {
    let dimmensionsChanged = false
    if (connectedToParentWidth) {
      thisObject.frame.width = thisObject.parentContainer.frame.width
      dimmensionsChanged = true
    }
    if (connectedToParentHeight) {
      thisObject.frame.height = thisObject.parentContainer.frame.height
      dimmensionsChanged = true
    }
    if (connectedToParentRadius) {
      thisObject.frame.radius = thisObject.parentContainer.frame.radius
      dimmensionsChanged = true
    }

    if (dimmensionsChanged) {
      thisObject.eventHandler.raiseEvent('Dimmensions Changed', event)
    }
  }

  function onMouseOver (event) {
    thisObject.eventHandler.raiseEvent('onMouseOver', event)
  }

  function onMouseNotOver (event) {
    thisObject.eventHandler.raiseEvent('onMouseNotOver', event)
  }

  function isForThisPurpose (purpose) {
    if (purpose !== undefined) {
      switch (purpose) {
        case GET_CONTAINER_PURPOSE.MOUSE_OVER:
          if (thisObject.detectMouseOver === true) {
            return true
          }
          break
        case GET_CONTAINER_PURPOSE.MOUSE_WHEEL:
          if (thisObject.isWheelable === true) {
            return true
          }
          break
        case GET_CONTAINER_PURPOSE.MOUSE_CLICK:
          if (thisObject.isClickeable === true) {
            return true
          }
          break
        default: { return false }

      }
    }
    return false
  }
}
