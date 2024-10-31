import { bookSeatsInEvent } from "@/backend/controllers/eventControllers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const segments = req.nextUrl.pathname.split('/');
    const id = segments[segments.length - 2];
    return await bookSeatsInEvent(req,id!);
};