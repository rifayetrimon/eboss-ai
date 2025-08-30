import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// ⚠️ For testing only, don’t hardcode in production
const API_KEY = 'AIzaSyBGm3mj0DOnQAE8vNIs64JXzLj6oz_bNI8';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Call Gemini API
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Return as a structured chat message (AI reply)
        return NextResponse.json({
            role: 'assistant',
            message: text,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Error calling Gemini API:', error);

        return NextResponse.json(
            {
                role: 'assistant',
                message: '⚠️ Sorry, I could not process your request.',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
