import request from "supertest";
import { buildTicket } from "../../lib/build-ticket";
import { app } from "../../app";
import { signin } from "../../lib/signin";
import { OrderStatus } from "@soumyarian/ticketing-common";
import { natsWrapper } from "../../nats-wrapper";

it("Marks an order as cancelled", async () => {
  const ticket = await buildTicket();
  const user = signin();

  const orderRes = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${orderRes.body.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrderRes = await request(app)
    .get(`/api/orders/${orderRes.body.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(updatedOrderRes.body.status).toEqual(OrderStatus.Cancelled);
});

it("Emits an order cancelled event", async () => {
  const ticket = await buildTicket();
  const user = signin();

  const orderRes = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${orderRes.body.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
