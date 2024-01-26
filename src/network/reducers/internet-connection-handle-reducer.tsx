import {createSlice} from '@reduxjs/toolkit';

export interface InternetConnectionState {
  isConnected: boolean;
  isShowInternetComponent: boolean;
}

interface Action {
  payload: boolean;
  type: string;
}

const initialState = {
  isConnected: true,
  isShowInternetComponent: false,
};

const internetConnectionHandleSlice = createSlice({
  name: 'internetConnectionHandle',
  initialState,
  reducers: {
    checkConnectivity: (prevState: InternetConnectionState, action: Action) => {
      const state = {...prevState};
      state.isConnected = action?.payload || true;
      return state;
    },
    handleInternetComponentVisibility: (
      prevState: InternetConnectionState,
      action: Action,
    ) => {
      const state = {...prevState};
      state.isShowInternetComponent = action?.payload || false;
      return state;
    },
  },
});

const internetConnectionHandleReducer = internetConnectionHandleSlice.reducer;

const {checkConnectivity, handleInternetComponentVisibility} =
  internetConnectionHandleSlice.actions;

export {
  checkConnectivity,
  handleInternetComponentVisibility,
  internetConnectionHandleReducer,
};
