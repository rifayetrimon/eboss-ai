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

    const url = 'https://devapi02.awfatech.com/api/v1/llm/chat-with-resources';

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': encryptedKey,
        },
        body: JSON.stringify({
            message: payload.message,
            session_id: payload.session_id,
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

    // ✅ Store session_id for ongoing chat
    if (data.session_id) {
        localStorage.setItem('chat_session_id', data.session_id);
    }

    return data;
};

// 🚀 For starting a new chat session (from Sidebar)
export const startNewChatSession = async () => {
    return sendChatWithResources({
        message: '',
        session_id: '',
        level: 'public',
        max_results: 5,
        include_metadata: false,
    });
};
