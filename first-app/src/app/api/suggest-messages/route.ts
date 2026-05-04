import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import OpenAI from "openai";  

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        );
    }

    try {
        const { prompt } = await request.json();

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that suggests creative and friendly messages.'
                },
                {
                    role: 'user',
                    content: `Suggest 5 creative and friendly messages based on: ${prompt || 'general conversation'}. Each message should be concise and under 300 characters. List them one per line.`
                }
            ],
            max_tokens: 500,
        });

        const suggestions = response.choices[0]?.message?.content?.split('\n').filter((line: string) => line.trim()).slice(0, 5) || [];

        return Response.json(
            {
                success: true,
                suggestions
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error generating suggestions:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to generate suggestions"
            },
            { status: 500 }
        );
    }
}