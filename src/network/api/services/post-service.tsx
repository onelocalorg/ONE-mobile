import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOG } from "~/config";
import { PostData } from "~/types/post-data";

export async function createPost(data: PostData) {
  LOG.debug("createPost", data);
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(process.env.API_URL + "/v1/posts/create", {
      method: "post",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(data),
    });
    const dataItem = await response.json();
    LOG.debug("createPost", dataItem);
    return dataItem;
  } catch (error) {
    LOG.error("createPost", error);
  }
}
