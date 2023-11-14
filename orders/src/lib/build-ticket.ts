import mongoose from "mongoose";
import { Ticket } from "../models/ticket";

export const buildTicket = async () => {
  const ticket = new Ticket({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};
