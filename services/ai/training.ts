// lib/training.ts

// Fetch training history
export async function getTrainingHistory(encryptedKey: string | null) {
    const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/training-history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(encryptedKey ? { 'x-encrypted-key': encryptedKey } : {}),
        },
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch training history');
    return res.json();
}

// Upload training file
// Upload training file
export async function uploadTrainingFile(file: File, encryptedKey: string, category: string, level: string) {
    const formData = new FormData();
    formData.append('category', category);
    formData.append('level', level.toLowerCase()); // ✅ ensure lowercase
    formData.append('files', file); // API expects `files` array
    formData.append('chunk_size', '1000');
    formData.append('chunk_overlap', '200');
    formData.append('force_reprocess', 'false');

    // 🔍 Log headers
    console.log('Request Headers:');
    console.log({ 'x-encrypted-key': encryptedKey });

    // 🔍 Log FormData entries safely
    console.log('Request Body:');
    (formData as any).forEach((value: any, key: string) => {
        if (value instanceof File) {
            console.log(`${key}: FILE -> ${value.name} (${value.size} bytes)`);
        } else {
            console.log(`${key}: ${value}`);
        }
    });

    const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/load-resources/files', {
        method: 'POST',
        headers: {
            'x-encrypted-key': encryptedKey,
        },
        body: formData,
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${errText}`);
    }

    return res.json();
}
