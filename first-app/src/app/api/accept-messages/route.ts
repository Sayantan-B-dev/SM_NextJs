import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            { status: 401 }
        )
    }
    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status"
                },
                { status: 400 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "user status updated successfully"
            },
            { status: 200 }
        )
    } catch (e) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "faled to update user status to accept message"
            },
            { status: 500 }
        )
    }


}


export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            { status: 401 }
        )
    }
    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            { status: 200 }
        )
    } catch (e) {
        console.error("Error fetching user status:", e)
        return Response.json(
            {
                success: false,
                message: "failed to fetch user status"
            },
            { status: 500 }
        )
    }
}
