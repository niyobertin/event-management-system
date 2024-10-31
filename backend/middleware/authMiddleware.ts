import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.JWT_SECRET || "test_me_to_day";

export const authMiddleware = (handler: (req: NextRequest) => Promise<NextResponse<any>>)  => {
  return async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, secret) as { username: string; role: string };
      if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
      }

      (req as any).user = decoded; 
      return await handler(req);
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 401 });
      }
    }
  };
};
