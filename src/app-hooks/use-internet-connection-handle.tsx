import {
  checkConnectivity,
  InternetConnectionState,
} from "~/network/reducers/internet-connection-handle-reducer";
import { StoreType } from "~/network/reducers/store";
import { useDispatch, useSelector } from "react-redux";

export const useInternetConnectionHandle = () => {
  const { isConnected } = useSelector<StoreType, InternetConnectionState>(
    (state) => state.internetConnectionHandleReducer
  );
  const dispatch = useDispatch();

  const updateConnectivityState = (payload: boolean) => {
    dispatch(checkConnectivity(payload));
  };

  return { isConnected, checkConnectivity: updateConnectivityState };
};
