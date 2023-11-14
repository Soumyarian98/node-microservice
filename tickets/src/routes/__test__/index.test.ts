import request from "supertest";
import { app } from "../../app";
import { ticketsSignin } from "../../lib/signin";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", ticketsSignin())
    .send({ title: "Valid Title", price: 20.0 })
    .expect(201);
};

it("Can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toEqual(3);
});
