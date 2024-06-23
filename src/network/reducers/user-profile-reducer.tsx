import { createSlice } from "@reduxjs/toolkit";

export interface UserProfileState {
  user: object;
}

interface Action {
  payload: object | String;
  type: string;
}

const initialState = {
  user: {},
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    onSetUser: (prevState: UserProfileState, action: Action) => {
      const state = { ...prevState };
      state.user = action?.payload;
      return state;
    },
    onSetCoverImage: (prevState: UserProfileState, action: Action) => {
      const state = { ...prevState };
      state.user = { ...state.user, coverImage: action?.payload };
      return state;
    },
  },
});

const userProfileReducer = userProfileSlice.reducer;

const { onSetUser, onSetCoverImage } = userProfileSlice.actions;

export { onSetCoverImage, onSetUser, userProfileReducer };
