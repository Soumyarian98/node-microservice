import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { ticketsSignin } from "../../lib/signin";

it("Returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("Returns the ticket if the ticket is found", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ title: "Valid Title", price: 20.0 })
    .expect(201);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual("Valid Title");
  expect(ticketResponse.body.price).toEqual(20.0);
});
