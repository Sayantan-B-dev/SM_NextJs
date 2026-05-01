import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

// querry schema
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)


        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'invalid query parameters',
            }, { status: 400 })
        }

        const { username } = result.data

        const existingUserVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingUserVerifiedUser) {

            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 202 })

    } catch (e) {
        console.error("error checking name", e)
        return Response.json(
            {
                success: false,
                message: "error checking username"
            },
            { status: 500 }
        )
    }
}