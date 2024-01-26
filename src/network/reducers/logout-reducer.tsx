import {createSlice} from '@reduxjs/toolkit';

const logoutSlice = createSlice({
  name: 'logout',
  initialState: {},
  reducers: {
    clearReducer() {},
  },
});

export const logoutReducer = logoutSlice.reducer;

export const {clearReducer} = logoutSlice.actions;
