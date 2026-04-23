import {z} from "zod"

export const AcceptMessageSchema=z.object({
    content:z.string().min(10,{message:"contentmust be at least of 10 characters"}).max(300,{message:"contentmust be less than of 300 characters"})
})