import { IEvent } from "@/types";
import Event from "../models/events.model"
export const getEvents = async () => {
try {
    const events = await Event.find();
    if(!events){
        return null;
    }else{
        return events;
    }
} catch (err) {
    if(err instanceof Error){
        throw new Error(err.message)
    }
}
};

export const createEvent = async(event:IEvent) => {
    try {
        const {title, description, date, totalSeats, availableSeats} = event;
        const existingEvent = await Event.findOne({ title });
        if (existingEvent) {
            throw new Error("Event already exists with the same title");
        }

        const newEvent = await Event.create({title, description, date, totalSeats, availableSeats});
        return newEvent;
    } catch (err) {
        if(err instanceof Error){
            throw new Error(err.message);
        }
    }
}
export const UpdateEvent = async(event:Partial<IEvent>,id:string) => {
    try {
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            throw new Error("Event not found");
        }
        const updateEvent = await Event.findByIdAndUpdate(id,event,{new:true});
        if(!updateEvent){
            throw new Error("Event not found");
        }
        return updateEvent;
    } catch (err) {
        if(err instanceof Error){
            throw new Error(err.message);
        }
        throw new Error("Failed to update event"); 
    }
}

export const deleteEvent = async(id:string) => {
    try {
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            throw new Error("Event not found");
        }
        const updateEvent = await Event.findByIdAndDelete(id);
        if(!updateEvent){
            throw new Error("Event not found");
        }
        return updateEvent;
    } catch (err) {
        if(err instanceof Error){
            throw new Error(err.message);
        }
        throw new Error("Failed to delete event"); 
    }
}


export const bookSeats = async (eventId: string, numberOfSeats: number) => {
    const event = await Event.findById(eventId);
    if (!event) {
        throw new Error("Event not found.");
    }
    if (event.availableSeats < numberOfSeats) {
        throw new Error("Sorry 😕!, available seats are not enough.");
    }

    event.availableSeats -= numberOfSeats;
    await event.save();

    return event;
};