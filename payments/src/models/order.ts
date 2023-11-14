import { OrderStatus } from "@soumyarian/ticketing-common";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: OrderStatus.Created,
      enum: [
        OrderStatus.Created,
        OrderStatus.Cancelled,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment,
      ],
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    optimisticConcurrency: true,
    versionKey: "version",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const Order = mongoose.model("Order", orderSchema);
