

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


/*
START

Connect DB

Receive username, email, password

IF verified username already exists
    return "username taken"

Check if email exists

Generate verification code

IF email exists
    IF email is already verified
        return "email already exists"
    ELSE
        update password
        update verification code
        update expiry time
        save user
ELSE
    create new user
    save user

Send verification email

IF email sending fails
    return error

return success

END
*/

export async function POST(request: Request) {
    await dbConnect();

    try {
        // Extract request data
        const { username, email, password } = await request.json();

        // Step 1: Check username uniqueness
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            );
        }

        // Step 2: Check existing email
        const existingUserByEmail = await UserModel.findOne({ email });

        // Generate OTP
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            // Existing unverified user flow
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(
                Date.now() + 3600000
            );

            await existingUserByEmail.save();
        } else {
            // New user creation flow
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 3600000),
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        // Send OTP email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Check your email.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error registering user:", error);

        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 }
        );
    }
}