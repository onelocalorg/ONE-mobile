import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { ImageUrl } from "~/types/image-info";
import { ImageComponent } from "./image-component";

interface MultiImageViewerProps {
  images: ImageUrl[];
}
export const MultiImageViewer = ({ images }: MultiImageViewerProps) => {
  const [layoutWidth, setLayoutWidth] = useState<number>();

  return (
    <View
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setLayoutWidth(width);
      }}
    >
      {images.length > 1
        ? layoutWidth && (
            <Carousel
              loop
              width={layoutWidth}
              height={layoutWidth}
              autoPlay={true}
              data={images}
              scrollAnimationDuration={1000}
              renderItem={({ item: image }) => (
                <ImageComponent
                  key={image.key}
                  resizeMode="cover"
                  source={{ uri: image.url }}
                  style={styles.userPost}
                />
              )}
            />
          )
        : images.map((image) => (
            <ImageComponent
              key={image.key}
              resizeMode="cover"
              source={{ uri: image.url }}
              style={styles.userPost}
            />
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  userPost: {
    height: 300,
    // width: 'auto',
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});
