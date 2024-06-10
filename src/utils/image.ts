import { launchImageLibrary } from "react-native-image-picker";

const postImageUploadAPI = async (fileItem: any, base64Item: any) => {
  const token = await AsyncStorage.getItem("token");
  var pic: any = {
    uploadKey: "createPostImg",
    imageName: fileItem,
    base64String: "data:image/jpeg;base64," + base64Item,
  };

  LOG.debug("> postImageUploadAPI");
  try {
    onLoading?.(true);

    const response = await fetch(
      process.env.API_URL + "/v1/users/upload/file",
      {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(pic),
      }
    );
    const data = (await response.json())?.data;
    LOG.debug("< postImageUploadAPI", data);
    if (data) {
      setImages([...images, data]);
    }
    notifyImagesChanged();
    onLoading?.(true);
  } catch (error) {
    LOG.error("postImageUploadAPI", error);
    onLoading?.(false);
  }
};

const GallerySelect = async () => {
  const { assets } = await launchImageLibrary({
    mediaType: "photo",
    // selectionLimit: 2,
    includeBase64: true,
    maxWidth: 800,
    maxHeight: 800,
  });
  console.log(assets);
  if (assets) {
    const img = assets?.[0];
    console.log("---------------assets Gallery 222---------------");
    console.log(assets);
    var fileNameTwo = img?.fileName ?? "";
    //   LodingData(true);
    var output =
      fileNameTwo.substr(0, fileNameTwo.lastIndexOf(".")) || fileNameTwo;
    var base64Two = img?.base64 ?? "";
    postImageUploadAPI(output, base64Two);
  }
};
