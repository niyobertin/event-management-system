import { NextRequest, NextResponse } from "next/server";
import connection from "@/backend/db/dbConnection";
import { createNewEvent, getAllEvents } from "@/backend/controllers/eventControllers";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
connection();

export const GET = async (req: NextRequest) => {
    return await getAllEvents(req);
};

const createEventHandler = async (req: NextRequest) => {
    return await createNewEvent(req);
};
//@ts-ignore
export const POST = authMiddleware(createEventHandler);
