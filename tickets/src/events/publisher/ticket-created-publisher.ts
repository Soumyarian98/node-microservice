import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@soumyarian/ticketing-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
