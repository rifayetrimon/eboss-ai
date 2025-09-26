import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    encryptedKey: null as string | null,
    reminderAppCode: null as string | null,
    reminderUsername: null as string | null,
};

const chatSessionSlice = createSlice({
    name: 'chatSession',
    initialState,
    reducers: {
        setEncryptedKey(state, action) {
            state.encryptedKey = action.payload;
        },

        setReminder(state, action) {
            state.reminderAppCode = action.payload.appCode;
            state.reminderUsername = action.payload.username;
        },

        deleteEncryptedKey(state) {
            state.encryptedKey = null;
        },
    },
});

export const { setEncryptedKey, deleteEncryptedKey, setReminder } = chatSessionSlice.actions;
export default chatSessionSlice.reducer;
