import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { ticketsSignin } from "../../lib/signin";
import { Ticket } from "../../models/ticket";

const createTicket = (cookie: string[] = []) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie.length === 0 ? ticketsSignin() : cookie)
    .send({ title: "Valid Title", price: 20.0 })
    .expect(201);
};

it("It returns a 404 if the provided id does not exist.", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", ticketsSignin())
    .send({ title: "Asdf", price: 20 })
    .expect(404);
});

it("It returns a 401 if the user is not authenticated.", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "Asdf", price: 20 })
    .expect(401);
});

it("It returns a 401 if the user does not own the ticket.", async () => {
  const response = await createTicket();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", ticketsSignin())
    .send({ title: "ghjk", price: 20 })
    .expect(401);
});

it("It returns a 400 if the user provides an invalid title or price.", async () => {
  const cookie = ticketsSignin();
  const response = await createTicket(cookie);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "ghjk", price: -20 })
    .expect(400);
});

it("It updates the ticket provided valid inputs.", async () => {
  const cookie = ticketsSignin();
  const response = await createTicket(cookie);
  const updatedRes = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(200);

  expect(updatedRes.body.title).toEqual("new title");
  expect(updatedRes.body.price).toEqual(100);
});

it("Publishes an event", async () => {
  const cookie = ticketsSignin();
  const response = await createTicket(cookie);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("Rejects updates if the ticket is reserved", async () => {
  const cookie = ticketsSignin();
  const response = await createTicket(cookie);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(400);
});
