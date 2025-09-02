import myAxios from '@/lib/myAxios';

// 🔐 Step 1: Get the encrypted app token
export const loginUserWithAppcode = async (appCode: string) => {
    const response = await myAxios.post('/api/v2/auth/appcode', { appcode: appCode });

    const token = response.data?.data?.encrypted_key;
    if (token) {
        // Save only once
        localStorage.setItem('x-encrypted-key', token);
    }

    return response.data;
};

// 👤 Step 2: Login using appToken in URL and token in header
export const loginUser = async (
    username: string,
    password: string,
    options?: {
        loginType?: string;
        firebaseId?: string;
        deviceSpec?: Record<string, any>;
    },
) => {
    const encryptedKey = localStorage.getItem('x-encrypted-key');
    if (!encryptedKey) throw new Error('Encrypted key missing');

    const url = `api/v2/auth/eboss/staff/login`;

    const response = await myAxios.post(
        url,
        {
            app_version: '1.0.0',
            username,
            password,
            login_type: options?.loginType || 'normal',
            firebase_id: options?.firebaseId || 'web-client-id',
            platform_code: 1,
            ...(options?.deviceSpec ? { device_spec: options.deviceSpec } : {}),
        },
        {
            headers: {
                'x-encrypted-key': encryptedKey,
            },
        },
    );

    const userId = response.data?.data?.user_id;
    const encrypted_user = response.data?.data?.encrypted_user;
    const token = response.data?.data?.token;
    if (!userId) throw new Error('User ID missing in login response');
    localStorage.setItem('user_id', userId);
    localStorage.setItem('encrypted_user', encrypted_user || '');
    localStorage.setItem('userToken', token || '');

    // const profileData = await getUserProfile();
    // console.log('Fetched profile after login:', profileData);

    return response.data;
};
