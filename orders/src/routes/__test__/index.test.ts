import request from "supertest";
import { signin } from "../../lib/signin";
import { app } from "../../app";
import { buildTicket } from "../../lib/build-ticket";

it("Fetches the order for a particular user", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = signin();
  const userTwo = signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const reponseOne = await request(app)
    .get("/api/orders")
    .set("Cookie", userOne)
    .expect(200);
  expect(reponseOne.body.length).toEqual(1);
  expect(reponseOne.body[0].ticket.id).toEqual(ticketOne.id);

  const responseTwo = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);
  expect(responseTwo.body.length).toEqual(2);
  expect(responseTwo.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(responseTwo.body[1].ticket.id).toEqual(ticketThree.id);
});
