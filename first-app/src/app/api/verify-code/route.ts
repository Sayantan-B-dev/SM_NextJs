import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()

        const decoadedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username: decoadedUsername
        })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'user not found'
                }, { status: 500 }
            )
        }
        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: 'message verified succesfully'
                }, { status: 500 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: 'verification code has expired , please signup again to get a new code'
                }, { status: 400 }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: 'Incorrect verification code'
                }, { status: 400 }
            )
        }

    } catch (e) {
        console.error("error checking user", e)
        return Response.json(
            {
                success: false,
                message: "error verifying user"
            },
            { status: 500 }
        )
    }
}