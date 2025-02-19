import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listener/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listener/payment-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, // clusterId
      process.env.NATS_CLIENT_ID, // clientId
      process.env.NATS_URL // url
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB Orders");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
