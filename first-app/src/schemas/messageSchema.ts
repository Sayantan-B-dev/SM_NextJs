import {z} from "zod"

export const messsageSchema=z.object({
    content:z.string().min(10,{message:"Content must be at least 10 characters long"}).max(300,{message:"Content must be less than 300 characters long"})
})
