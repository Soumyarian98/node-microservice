import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { ticketsSignin } from "../../lib/signin";

it("Has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("Can not be accessed if a user is not signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("Retruns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("Returns error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ title: "", price: 10 })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ price: 10 })
    .expect(400);
});

it("Retruns an error if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ title: "Valid Title" })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ title: "Valid Title", price: -10 })
    .expect(400);
});

it("Creates a ticket if valid credetials are provided", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ title: "Valid Title", price: 20.0 })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("Valid Title");
  expect(tickets[0].price).toEqual(20.0);
});

it("Publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ title: "Valid Title", price: 20.0 });
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
