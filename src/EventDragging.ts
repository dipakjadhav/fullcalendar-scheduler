import { EventMutation, Hit, EventDef, Calendar } from 'fullcalendar'

declare module 'fullcalendar/src/structs/event-mutation' {
  interface EventMutation {
    resourceMutation?: { matchResourceId: string, setResourceId: string }
  }
}

export function massageEventDragMutation(eventMutation: EventMutation, hit0: Hit, hit1: Hit) {
  let resource0 = hit0.dateSpan.resourceId
  let resource1 = hit1.dateSpan.resourceId

  if (
    resource0 && resource1 &&
    resource0 !== resource1
  ) {
    eventMutation.resourceMutation = {
      matchResourceId: resource0,
      setResourceId: resource1
    }
  }
}

export function applyEventDefMutation(eventDef: EventDef, mutation: EventMutation, calendar: Calendar) {
  let resourceMutation = mutation.resourceMutation

  if (resourceMutation && computeResourceEditable(eventDef, calendar)) {
    let index = eventDef.resourceIds.indexOf(resourceMutation.matchResourceId)

    if (index !== -1) {
      let resourceIds = eventDef.resourceIds.slice() // copy
      resourceIds.splice(index, 1, resourceMutation.setResourceId) // remove and add
      eventDef.resourceIds = resourceIds
    }
  }
}

/*
TODO: use EventUi system instead of this
*/
function computeResourceEditable(eventDef: EventDef, calendar: Calendar): boolean {
  let { resourceEditable } = eventDef

  if (resourceEditable == null) {
    resourceEditable = calendar.opt('eventResourceEditable')

    if (resourceEditable == null) {
      resourceEditable = true // TODO: use defaults system instead
    }
  }

  return resourceEditable
}