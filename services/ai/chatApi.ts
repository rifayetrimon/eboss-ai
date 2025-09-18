// services/ai/chatApi.ts
import { fetchChatSessions } from './sidebar';

interface ChatRequest {
    message: string;
    session_id?: string;
    level: string;
    max_results?: number;
    include_metadata?: boolean;
}

export const sendChatWithResources = async (payload: ChatRequest) => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    // Restore session_id from localStorage if not provided
    let sessionId = payload.session_id;
    if (!sessionId) {
        const storedSession = localStorage.getItem('session_id');
        if (storedSession) {
            sessionId = storedSession;
        }
    }

    // ✅ Restore chat level if not passed
    let chatLevel = localStorage.getItem('chat_level');

    const url = 'https://devapi02.awfatech.com/api/v1/llm/chat-with-resources';

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': encryptedKey,
        },
        body: JSON.stringify({
            message: payload.message,
            session_id: sessionId ?? '',
            level: chatLevel,
            max_results: payload.max_results ?? 5,
            include_metadata: payload.include_metadata ?? false,
        }),
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    console.log('Chat API Response:', chatLevel);
    return res.json();
};

// 🚀 For starting a new chat session (from Sidebar)
export const startNewChatSession = async () => {
    localStorage.removeItem('session_id'); // clear old session
    return sendChatWithResources({
        message: '',
        session_id: '',
        level: 'public',
        max_results: 5,
        include_metadata: false,
    });
};

// 🚀 Fetch previous chat messages for a given session
export const fetchChatSession = async (sessionId: string) => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    const url = `https://devapi02.awfatech.com/api/v1/llm/chat-sessions/${sessionId}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': encryptedKey,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to fetch chat session');
    }

    const data = await response.json();
    console.log('📜 Full API response (chat-sessions):', data);

    // ✅ Normalize messages: support both `messages` and `conversations`
    let messages: { role: string; text: string }[] = [];

    if (Array.isArray(data?.data?.messages)) {
        messages = data.data.messages.map((msg: any) => ({
            role: msg.role === 'assistant' || msg.role === 'ai' ? 'gemini' : 'user',
            text: msg.content || msg.text || msg.message || '',
        }));
    } else if (Array.isArray(data?.data?.conversations)) {
        messages = data.data.conversations.flatMap((pair: string[]) => [
            { role: 'user', text: pair[0] },
            { role: 'gemini', text: pair[1] },
        ]);
    }

    return { ...data, messages };
};
