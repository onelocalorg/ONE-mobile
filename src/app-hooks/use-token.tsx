import { API } from "~/network/api";
import { persistKeys } from "~/network/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

export const onSetToken = async (value: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${value}`;
  API.initService();

  await AsyncStorage.setItem(persistKeys.token, value);
};

export const useToken = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const tok = (await AsyncStorage.getItem(persistKeys.token)) ?? "";
      setToken(tok);
      setLoading(false);
    };

    checkToken();
  }, []);

  return { token, loading, onSetToken };
};
