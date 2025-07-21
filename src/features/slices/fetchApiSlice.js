import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};

const fetchApiSlice = createSlice({
  name: 'fetchApi',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setIsLoading, resetLoading } = fetchApiSlice.actions;
export default fetchApiSlice.reducer;
