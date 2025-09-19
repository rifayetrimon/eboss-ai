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
        return saved || 'internal';
    }
    return 'internal';
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
        // ✅ New action to initialize from localStorage
        initializeChatState: (state) => {
            if (typeof window !== 'undefined') {
                const savedLevel = localStorage.getItem('chatLevel');
                const savedSessionId = localStorage.getItem('session_id');

                if (savedLevel) {
                    state.chatLevel = savedLevel;
                }
                if (savedSessionId) {
                    state.sessionId = savedSessionId;
                }
            }
        },
    },
});

export const { setChatLevel, setSessionId, initializeChatState } = chatSlice.actions;
export default chatSlice.reducer;
