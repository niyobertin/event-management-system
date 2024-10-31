//@ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { removeEvent, updateEvent } from '@/backend/controllers/eventControllers';
import { authMiddleware } from '@/backend/middleware/authMiddleware';

const updateEventHandler = async (req: NextRequest) => {
    const id: string | null = req.nextUrl.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }
    return await updateEvent(req, id);
};

const deleteEventHandler = async (req: NextRequest) => {
    const id: string | null = req.nextUrl.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }
    return await removeEvent(req, id);
};

export const PATCH = authMiddleware(updateEventHandler);
export const DELETE = authMiddleware(deleteEventHandler);
