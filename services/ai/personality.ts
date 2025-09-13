console.log('📂 personalService.ts file loaded');

export const fetchCurrentExpertise = async () => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    const response = await fetch('https://devapi02.awfatech.com/api/v1/llm/current-expertise', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': encryptedKey,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to fetch personality');
    }

    const result = await response.json();
    return result.data;
};
