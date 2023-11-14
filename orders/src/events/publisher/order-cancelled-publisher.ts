import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@soumyarian/ticketing-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
