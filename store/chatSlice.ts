// store/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    chatLevel: string;
    sessionId?: string;
}

// ✅ Load initial state from localStorage if available
const getInitialChatLevel = (): string => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('chatLevel');
        // 👇 fallback to "public" instead of "internal"
        return saved || 'public';
    }
    return 'public';
};

const initialState: ChatState = {
    chatLevel: getInitialChatLevel(),
    sessionId: undefined,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatLevel: (state, action: PayloadAction<string>) => {
            state.chatLevel = action.payload;

            // ✅ Persist to localStorage for consistency
            if (typeof window !== 'undefined') {
                localStorage.setItem('chatLevel', action.payload);
            }

            console.log('🔄 Chat level updated to:', action.payload);
        },
        setSessionId: (state, action: PayloadAction<string | undefined>) => {
            state.sessionId = action.payload;

            // ✅ Persist session ID
            if (typeof window !== 'undefined') {
                if (action.payload) {
                    localStorage.setItem('session_id', action.payload);
                } else {
                    localStorage.removeItem('session_id');
                }
            }
        },
        // ✅ Initialize state from localStorage (with public as default)
        initializeChatState: (state) => {
            if (typeof window !== 'undefined') {
                const savedLevel = localStorage.getItem('chatLevel');
                const savedSessionId = localStorage.getItem('session_id');

                state.chatLevel = savedLevel || 'public';
                state.sessionId = savedSessionId || undefined;
            }
        },
    },
});

export const { setChatLevel, setSessionId, initializeChatState } = chatSlice.actions;
export default chatSlice.reducer;
