// services/ai/chatApi.ts

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
            level: payload.level,
            max_results: payload.max_results ?? 5,
            include_metadata: payload.include_metadata ?? false,
        }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Request failed');
    }

    const data = await response.json();
    console.log('🔍 Full API response (chat-with-resources):', data);

    // ✅ Save session_id only if returned from backend
    if (data.data?.session_id && data.data.session_id.trim() !== '') {
        localStorage.setItem('session_id', data.data.session_id);
    }

    return data;
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
