import request from "supertest";
import { buildTicket } from "../../lib/build-ticket";
import { signin } from "../../lib/signin";
import { app } from "../../app";

it("Fetches the order", async () => {
  const ticket = await buildTicket();
  const user = signin();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${response.body.id}`)
    .set("Cookie", user)
    .expect(200);
});

// it("Returns an error if the order is not found", async () => {
//   const user = signin();

//   await request(app).get(`/api/orders/1234`).set("Cookie", user).expect(404);
// });

it("Returns an error if the order does not belong to the user", async () => {
  const ticket = await buildTicket();
  const user = signin();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${response.body.id}`)
    .set("Cookie", signin())
    .expect(401);
});
