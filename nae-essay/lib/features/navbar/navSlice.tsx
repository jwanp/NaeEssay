import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IsOpen {
    isOpen: boolean;
}

const initialState: IsOpen = {
    isOpen: false,
};

export const NavSlice = createSlice({
    name: 'isOpen',
    initialState,
    reducers: {
        openNav(state, action: PayloadAction<{ isOpen: boolean }>) {
            state.isOpen = action.payload.isOpen;
        },
    },
});

export default NavSlice.reducer;
export const { openNav } = NavSlice.actions;
