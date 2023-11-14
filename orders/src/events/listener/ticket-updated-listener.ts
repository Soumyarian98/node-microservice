import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from "@soumyarian/ticketing-common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price, id, version } = data;

    const ticket = await Ticket.findByEvent({ id, version });
    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ title, price });
    ticket.markModified("title");
    ticket.markModified("price");
    await ticket.save();

    msg.ack();
  }
}
