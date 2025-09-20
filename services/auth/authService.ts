import myAxios from '@/lib/myAxios';

// ✅ Safe localStorage getter
const safeGetItem = (key: string): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
};

// ✅ Safe localStorage setter
const safeSetItem = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
};

// ✅ Safe localStorage remover
const safeRemoveItem = (key: string) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};

// 🔐 Step 1: Get the encrypted app token
export const loginUserWithAppcode = async (appCode: string) => {
    try {
        console.log('Sending app code request...');

        const response = await myAxios.post('/api/v2/auth/appcode', {
            appcode: appCode,
        });

        console.log('App code response:', response.data);

        const token = response.data?.data?.encrypted_key;
        if (token) {
            safeSetItem('x-encrypted-key', token);
            console.log('Encrypted key saved to localStorage');
        } else {
            throw new Error('No encrypted key received from server');
        }

        return response.data;
    } catch (error: any) {
        console.error('loginUserWithAppcode error:', error);

        // Clean up any partial data on error
        safeRemoveItem('x-encrypted-key');

        throw error;
    }
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
    try {
        const encryptedKey = safeGetItem('x-encrypted-key');
        if (!encryptedKey) {
            throw new Error('Encrypted key missing. Please validate app code first.');
        }

        const url = `/api/v2/auth/eboss/staff/login`;

        console.log('Sending login request...');

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

        console.log('Login response:', response.data);

        const userId = response.data?.data?.user_id;
        const encrypted_user = response.data?.data?.encrypted_user;
        const token = response.data?.data?.token;

        if (!userId) {
            throw new Error('User ID missing in login response');
        }

        // Save user data
        safeSetItem('user_id', userId);
        safeSetItem('encrypted_user', encrypted_user || '');
        safeSetItem('userToken', token || '');

        console.log('User login data saved successfully');

        return response.data;
    } catch (error: any) {
        console.error('loginUser error:', error);
        throw error;
    }
};

// 🚪 Logout function
export const logoutUser = () => {
    console.log('Logging out user...');

    // Clear all auth-related data
    safeRemoveItem('x-encrypted-key');
    safeRemoveItem('user_id');
    safeRemoveItem('encrypted_user');
    safeRemoveItem('userToken');

    // Redirect to app code page
    if (typeof window !== 'undefined') {
        window.location.href = '/auth/app-code';
    }
};

// import myAxios from '@/lib/myAxios';

// // ✅ Safe localStorage getter
// const safeGetItem = (key: string): string | null => {
//     if (typeof window !== 'undefined') {
//         return localStorage.getItem(key);
//     }
//     return null;
// };

// // ✅ Safe localStorage setter
// const safeSetItem = (key: string, value: string) => {
//     if (typeof window !== 'undefined') {
//         localStorage.setItem(key, value);
//     }
// };

// // 🔐 Step 1: Get the encrypted app token
// export const loginUserWithAppcode = async (appCode: string) => {
//     const response = await myAxios.post('/api/v2/auth/appcode', { appcode: appCode });

//     const token = response.data?.data?.encrypted_key;
//     if (token) {
//         safeSetItem('x-encrypted-key', token);
//     }

//     return response.data;
// };

// // 👤 Step 2: Login using appToken in URL and token in header
// export const loginUser = async (
//     username: string,
//     password: string,
//     options?: {
//         loginType?: string;
//         firebaseId?: string;
//         deviceSpec?: Record<string, any>;
//     },
// ) => {
//     const encryptedKey = safeGetItem('x-encrypted-key');
//     if (!encryptedKey) throw new Error('Encrypted key missing');

//     const url = `/api/v2/auth/eboss/staff/login`;

//     const response = await myAxios.post(
//         url,
//         {
//             app_version: '1.0.0',
//             username,
//             password,
//             login_type: options?.loginType || 'normal',
//             firebase_id: options?.firebaseId || 'web-client-id',
//             platform_code: 1,
//             ...(options?.deviceSpec ? { device_spec: options.deviceSpec } : {}),
//         },
//         {
//             headers: {
//                 'x-encrypted-key': encryptedKey,
//             },
//         },
//     );

//     const userId = response.data?.data?.user_id;
//     const encrypted_user = response.data?.data?.encrypted_user;
//     const token = response.data?.data?.token;

//     if (!userId) throw new Error('User ID missing in login response');

//     safeSetItem('user_id', userId);
//     safeSetItem('encrypted_user', encrypted_user || '');
//     safeSetItem('userToken', token || '');

//     return response.data;
// };

// // import myAxios from '@/lib/myAxios';

// // // 🔐 Step 1: Get the encrypted app token
// // export const loginUserWithAppcode = async (appCode: string) => {
// //     const response = await myAxios.post('/api/v2/auth/appcode', { appcode: appCode });

// //     const token = response.data?.data?.encrypted_key;
// //     if (token) {
// //         // Save only once
// //         localStorage.setItem('x-encrypted-key', token);
// //     }

// //     return response.data;
// // };

// // // 👤 Step 2: Login using appToken in URL and token in header
// // export const loginUser = async (
// //     username: string,
// //     password: string,
// //     options?: {
// //         loginType?: string;
// //         firebaseId?: string;
// //         deviceSpec?: Record<string, any>;
// //     },
// // ) => {
// //     const encryptedKey = localStorage.getItem('x-encrypted-key');
// //     if (!encryptedKey) throw new Error('Encrypted key missing');

// //     const url = `api/v2/auth/eboss/staff/login`;

// //     const response = await myAxios.post(
// //         url,
// //         {
// //             app_version: '1.0.0',
// //             username,
// //             password,
// //             login_type: options?.loginType || 'normal',
// //             firebase_id: options?.firebaseId || 'web-client-id',
// //             platform_code: 1,
// //             ...(options?.deviceSpec ? { device_spec: options.deviceSpec } : {}),
// //         },
// //         {
// //             headers: {
// //                 'x-encrypted-key': encryptedKey,
// //             },
// //         },
// //     );

// //     const userId = response.data?.data?.user_id;
// //     const encrypted_user = response.data?.data?.encrypted_user;
// //     const token = response.data?.data?.token;
// //     if (!userId) throw new Error('User ID missing in login response');
// //     localStorage.setItem('user_id', userId);
// //     localStorage.setItem('encrypted_user', encrypted_user || '');
// //     localStorage.setItem('userToken', token || '');

// //     // const profileData = await getUserProfile();
// //     // console.log('Fetched profile after login:', profileData);

// //     return response.data;
// // };
