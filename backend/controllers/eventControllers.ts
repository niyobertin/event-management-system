import { NextRequest, NextResponse } from "next/server";
import { bookSeats, createEvent, deleteEvent, getEvents, UpdateEvent } from "../services/event.service";
import { IEvent } from "@/types";
import { eventSchema, updateEventSchema } from "../utils/eventSchema";

export const getAllEvents = async (req:NextRequest) => {
  try {
    const allEvents = await getEvents();
    return NextResponse.json(
      {
        data: allEvents
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching events", error: err.message },
        { status: 500 }
      );
    }
  }
};

export const createNewEvent = async (req:NextRequest) => {
    try {
        const eventData = await req.json() as IEvent;
        const { error } = eventSchema.validate(eventData);

        if (error) {
            return NextResponse.json(
              { message: "Validation error", details: error.details[0].message },
              { status: 400 }
            );
        };
        const newEvent = await createEvent(eventData); 
        return NextResponse.json({data:newEvent, message: 'New event created' }, { status: 201 });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
              { message: "Error fetching events", error: err.message },
              { status: 500 }
            );
          } 
    }
}

export const updateEvent = async (req:NextRequest,id:string) => {
    try {
        const eventData = await req.json() as IEvent;
        const { error } = updateEventSchema.validate(eventData);

        if (error) {
            return NextResponse.json(
              { message: "Validation error", details: error.details[0].message },
              { status: 400 }
            );
        };
        const updatedEvent = await UpdateEvent(eventData,id); 
        return NextResponse.json({ data:updatedEvent,message: 'Event updated successful' }, { status: 201 });
    } catch (err) {
        if (err instanceof Error) {
            if(err.message === "Event not found"){
                return NextResponse.json(
                    { message: err.message },{status:404}
                  );
            }
            return NextResponse.json(
                { message: err.message },{status:500}
              );
          } 
    }
}
export const removeEvent = async (req:NextRequest,id:string) => {
    try {
        await deleteEvent(id); 
        return NextResponse.json({message: 'Event deleted successful' }, { status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            if(err.message === "Event not found"){
                return NextResponse.json(
                    { message: err.message },{status:404}
                  );
            }
            return NextResponse.json(
                { message: err.message },{status:500}
              );
          } 
    }
}
export const bookSeatsInEvent = async (req: NextRequest,id:string) => {
  try {
      const { numberOfSeats } = await req.json();
      if (!id || !numberOfSeats) {
          return NextResponse.json({ message: "Event ID and number of seats are required." }, { status: 400 });
      }
      const updatedEvent = await bookSeats(id, numberOfSeats);

      return NextResponse.json({ message: "Seat(s) booked successful", event: updatedEvent }, { status: 200 });
  } catch (err:any) {
      return NextResponse.json({ message: "Error during booking", error: err.message }, { status: 500 });
  }
};