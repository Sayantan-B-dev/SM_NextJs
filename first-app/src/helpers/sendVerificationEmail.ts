import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string

):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'sayantanbharati611@gmail.com',
            to:'email',
            subject: 'Verification code',
            react: VerificationEmail({username,otp:verifyCode})
        })
        return {success:true,message:"Verifying email succesfully"}
    }catch(e){
        console.error("Error sending verification email",e)
        return {success:false,message:"failed to send verification email"}
    }
}