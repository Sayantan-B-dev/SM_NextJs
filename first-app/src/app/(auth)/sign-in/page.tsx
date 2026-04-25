'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button
                onClick={() => signIn()}
                className="
                    bg-cyan-500
                    hover:bg-cyan-400
                    text-black
                    font-bold
                    w-fit
                    px-6
                    py-2
                    rounded-none
                    border
                    border-cyan-300
                    shadow-[0_0_12px_rgba(34,211,238,0.7)]
                    hover:shadow-[0_0_20px_rgba(34,211,238,1)]
                    transition-all
                    duration-300
                    cursor-pointer
                    uppercase
                    tracking-wider
                "
            >
                Sign in
            </button>
        </>
    )
}