import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@soumyarian/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
