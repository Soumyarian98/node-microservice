import {
  PayymentCreatedEvent,
  Publisher,
  Subjects,
} from "@soumyarian/ticketing-common";

export class PayemntCreatedPublisher extends Publisher<PayymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
