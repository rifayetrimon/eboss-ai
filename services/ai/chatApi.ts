// services/ai/chatApi.ts
import store from '@/store';
const baseUrl = 'https://devapi02.awfatech.com/api/v1/llm';

interface ChatRequest {
    message: string;
    session_id?: string;
    level?: string; // Made optional - will use Redux state if not provided
    max_results?: number;
    include_metadata?: boolean;
}

// 🚀 Main function to send chat messages with resources
export const sendChatWithResources = async (payload: ChatRequest) => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    // ✅ Get fresh state at the time of API call
    const state = store.getState();
    const chatLevel = payload.level ?? state.chat.chatLevel;
    const sessionId = payload.session_id ?? state.chat.sessionId ?? '';

    console.log('🔍 Current Redux chatLevel at API call time:', state.chat.chatLevel);
    console.log('🔍 Using chatLevel for API:', chatLevel);

    const url = `${baseUrl}/chat-with-resources`;

    const requestBody = {
        message: payload.message,
        session_id: sessionId,
        level: chatLevel,
        max_results: payload.max_results ?? 5,
        include_metadata: payload.include_metadata ?? false,
    };

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': encryptedKey,
        },
        body: JSON.stringify(requestBody),
    };

    console.log('📤 Full request body:', requestBody);

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

    return res.json();
};

// 🚀 For starting a new chat session (from Sidebar)
export const startNewChatSession = async () => {
    localStorage.removeItem('session_id');

    // ✅ Get fresh state at the time of API call
    const state = store.getState();
    const currentChatLevel = state.chat.chatLevel;

    console.log('🔍 Starting new chat with level:', currentChatLevel);

    return sendChatWithResources({
        message: '',
        session_id: '',
        level: currentChatLevel,
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

// 🚀 Helper function to get current chat level
export const getCurrentChatLevel = () => {
    const state = store.getState();
    return state.chat.chatLevel;
};

// 🚀 Helper function to send message with current settings
export const sendMessageWithCurrentSettings = async (message: string) => {
    // ✅ Get the most up-to-date state right before the call
    const currentState = store.getState();
    const currentLevel = currentState.chat.chatLevel;

    console.log('🔍 Sending message with current level:', currentLevel);

    return sendChatWithResources({
        message,
        level: currentLevel, // ✅ Explicitly pass the current level
    });
};

// 🚀 NEW: Send message with explicit level (for immediate use after dropdown change)
export const sendMessageWithLevel = async (message: string, level: string) => {
    console.log('🔍 Sending message with explicit level:', level);

    return sendChatWithResources({
        message,
        level, // ✅ Use the explicitly provided level
    });
};
