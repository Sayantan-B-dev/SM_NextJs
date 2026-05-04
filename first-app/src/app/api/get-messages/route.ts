import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { success } from "zod";
import { request } from "https";
import mongoose from "mongoose";


export async function Get(request:Request){
    await dbConnect()
    const session =await getServerSession(authOptions)

    if(!session||!session.user){
        return Response.json(
            {
                success:false,
                message:"not authenticated"
            },
            {status:401}
        )
    }
    const sessionUser:User=session?.user as User


    const userId=new mongoose.Types.ObjectId(sessionUser._id)

    try{
        const aggregateUser=await UserModel.aggregate([  
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{
                _id:"$_id",
                name:{$first:"$name"},
                email:{$first:"$email"},
                messages:{$push:"$messages"}
            }}
        ])
        if(!aggregateUser || aggregateUser  .length === 0){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {status:404}
            )
        }
        return Response.json(
            {
                success:true,
                message:aggregateUser[0].messages,
                user:aggregateUser[0]
            },
            {status:200}
        )
    }catch(e){
        console.error("Error fetching user messages:", e)
        return Response.json(
            {
                success:false,
                message:"failed to fetch user messages"
            },
            {status:500}
        )
    }
}