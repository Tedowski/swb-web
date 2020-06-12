const chainEventHandler = (...handlers) => (event) => handlers.reduce((previousEvent, handler) => {
  if (handler === undefined) return previousEvent

  const nextEvent = handler(previousEvent)
  if (nextEvent === undefined) return previousEvent

  return nextEvent
}, event)

export default chainEventHandler
