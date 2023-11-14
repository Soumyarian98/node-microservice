import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@soumyarian/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
