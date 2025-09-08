interface ChatRequest {
    message?: string;
    session_id?: string;
    category?: string; // ✅ required
    max_results?: number;
    include_metadata?: boolean;
    file?: File; // optional file
}

export const sendChatOrUpload = async (payload: ChatRequest) => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    let url = '';
    let options: RequestInit = {};

    if (payload.file) {
        url = 'https://devapi02.awfatech.com/api/v1/llm/load-resources/files';

        const formData = new FormData();
        formData.append('files', payload.file); // ✅ must be "files"
        formData.append('category', payload.category || 'company_background');

        // optional fields if needed
        formData.append('description', 'Uploaded via web client');
        formData.append('chunk_size', '1000');
        formData.append('chunk_overlap', '200');
        formData.append('force_reprocess', 'false');

        options = {
            method: 'POST',
            headers: {
                'x-encrypted-key': encryptedKey,
                // ❌ don't set Content-Type manually
            },
            body: formData,
        };
    } else {
        // 💬 Chat only
        url = 'https://devapi02.awfatech.com/api/v1/llm/chat-with-resources';

        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-encrypted-key': encryptedKey,
            },
            body: JSON.stringify({
                message: payload.message,
                session_id: payload.session_id,
                category: payload.category || 'company_background',
                max_results: payload.max_results ?? 5,
                include_metadata: payload.include_metadata ?? false,
            }),
        };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Request failed');
    }

    return response.json();
};
