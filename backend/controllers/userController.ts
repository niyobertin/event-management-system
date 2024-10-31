import { NextRequest, NextResponse } from "next/server";
import { createUser, Login } from "../services/users.service";
import { IUser } from "@/types";
import { userLoginSchema } from "../utils/userSchema";

export const register = async(req: NextRequest)=>{
    try {
        const registedUser = await createUser();
        return NextResponse.json(
          {
            data: registedUser
          },
          { status: 201 }
        );
      } catch (err) {
        if (err instanceof Error) {
          return NextResponse.json(
            { message: err.message },
            { status: 500 }
          );
        }
      }
}

export const userLogin = async (req:NextRequest) => {
    try {
        const UserLoginData = await req.json() as IUser;
        const { error } = userLoginSchema.validate(UserLoginData);

        if (error) {
            return NextResponse.json(
              { message: "Validation error", details: error.details[0].message },
              { status: 400 }
            );
        };
        const response = await Login(UserLoginData); 
        return NextResponse.json({data:response, message: 'Welcome' }, { status: 201 });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
              { message: err.message },
              { status: 500 }
            );
          } 
    }
}
