import { Schema, model, models } from "mongoose";

const eventSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true }
}, {
    timestamps: true
});

const Event = models.Event || model("Event", eventSchema);

export default Event;
