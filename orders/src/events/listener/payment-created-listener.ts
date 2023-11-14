import {
  Listener,
  OrderStatus,
  PayymentCreatedEvent,
  Subjects,
} from "@soumyarian/ticketing-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PayymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PayymentCreatedEvent["data"], msg: Message) {
    const { id, stripeId, orderId } = data;

    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
