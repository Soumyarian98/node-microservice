import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@soumyarian/ticketing-common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", "Ticket Created");
    const { title, price, id, version } = data;
    const ticket = new Ticket({
      _id: id,
      title,
      price,
      version,
    });
    await ticket.save();
    msg.ack();
  }
}
