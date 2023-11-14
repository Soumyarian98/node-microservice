import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@soumyarian/ticketing-common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { ticket } = data;

    const ticketDoc = await Ticket.findById(ticket.id);
    if (!ticketDoc) throw new Error("Ticket not found");

    ticketDoc.set({ orderId: undefined });
    await ticketDoc.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketDoc.id,
      version: ticketDoc.version,
      price: ticketDoc.price,
      title: ticketDoc.title,
      userId: ticketDoc.userId,
      orderId: ticketDoc.orderId,
    });

    msg.ack();
  }
}
