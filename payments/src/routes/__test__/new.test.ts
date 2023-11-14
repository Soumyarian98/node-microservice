import requrst from "supertest";
import { app } from "../../app";
import { signin } from "../../lib/signin";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@soumyarian/ticketing-common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns a 404 if purchasing an order that does not exist", async () => {
  const token = signin();
  await requrst(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({
      token: "123",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 if purchasing an order that does not belong to the user", async () => {
  const token = signin();
  const order = new Order({
    price: 20,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  await requrst(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({
      token: "123",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 if purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const token = signin(userId);
  const order = new Order({
    price: 20,
    status: OrderStatus.Cancelled,
    userId: userId,
  });
  await order.save();

  await requrst(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({
      token: "123",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const token = signin(userId);
  const order = new Order({
    price: 20,
    status: OrderStatus.Created,
    userId: userId,
  });
  await order.save();

  await requrst(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("inr");

  const payment = await Payment.findOne({
    orderId: order.id,
  });
  expect(payment).not.toBeNull();
});
