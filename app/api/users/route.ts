import { register} from "@/backend/controllers/userController"
import { NextRequest } from "next/server"

export const POST = async(req:NextRequest) => {
return await register(req)
}

