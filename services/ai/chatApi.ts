interface ChatRequest {
    message: string;
    session_id?: string;
    category_filter?: string;
    max_results?: number;
    include_metadata?: boolean;
}

export const sendChatMessage = async (payload: ChatRequest) => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    const url = 'https://devapi02.awfatech.com/llm/api/v1/llm/chat-with-resources';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': encryptedKey,
        },
        body: JSON.stringify({
            ...payload,
            category_filter: payload.category_filter || 'company-background', // default
            max_results: payload.max_results ?? 5,
            include_metadata: payload.include_metadata ?? false,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to fetch chat response');
    }

    return response.json();
};
