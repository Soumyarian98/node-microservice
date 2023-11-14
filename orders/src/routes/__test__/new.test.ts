import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { signin } from "../../lib/signin";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { buildTicket } from "../../lib/build-ticket";

it("Returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("Returns an error if the ticket is already reserved", async () => {
  const ticket = await buildTicket();

  const order = new Order({
    userId: "1234",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("Reserves a ticket", async () => {
  const ticket = await buildTicket();

  let order = await Order.find({});
  expect(order.length).toEqual(0);

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  order = await Order.find({});
  expect(order.length).toEqual(1);
});

it("Emits an order created event", async () => {
  const ticket = await buildTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
