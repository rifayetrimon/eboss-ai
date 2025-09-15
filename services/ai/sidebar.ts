// services/sidebar.ts

export interface ChatSession {
    _id: string;
    session_id: string;
    title?: string;
    conversations?: string[][];
    created_at?: string;
    last_accessed?: string;
    greeting_shown?: boolean;
}

interface ChatSessionsResponse {
    success: boolean;
    message: string;
    data: ChatSession[];
}

// 🚀 Fetch all chat sessions (for Sidebar history list)
export const fetchChatSessions = async (): Promise<ChatSession[]> => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    const url = 'https://devapi02.awfatech.com/api/v1/llm/chat-sessions';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': encryptedKey,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to fetch chat sessions');
    }

    const data: ChatSessionsResponse = await response.json();
    console.log('📜 Full API response (chat-sessions list):', data);

    return data?.data ?? [];
};
