import MapboxGL, {
  Camera,
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
} from "@rnmapbox/maps";
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import { useQueries } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";
import _ from "lodash/fp";
import { Duration } from "luxon";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { useChapterFilter } from "~/navigation/AppContext";
import { useEventService } from "~/network/api/services/useEventService";
import { useGroupService } from "~/network/api/services/useGroupService";
import { usePostService } from "~/network/api/services/usePostService";
import { Group } from "~/types/group";
import { isEvent, LocalEvent } from "~/types/local-event";
import { isPost, Post } from "~/types/post";
import { Loader } from "../../components/loader";
import { createStyleSheet } from "../../components/map/style";
import { MapCard } from "./MapCard";

void MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

const mapStyles = {
  icon: {
    iconImage: ["get", "icon"],
    iconAllowOverlap: true,
  },
};

export const MapScreen = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [selected, setSelected] = useState<LocalEvent[] | Post[]>([]);
  const { gotoEventDetails, gotoPostDetails, gotoGroupDetails } =
    useNavigations();
  const [layoutWidth, setLayoutWidth] = useState<number>();
  const ref = useRef<ICarouselInstance>(null);
  const chapterFilter = useChapterFilter();

  // TODO Use the center of the current community
  const centerCoordinate = chapterFilter?.coordinates;

  const {
    queries: { list: listEvents },
  } = useEventService();
  const {
    queries: { list: listPosts },
  } = usePostService();
  const {
    queries: { list: listGroups },
  } = useGroupService();

  const { isLoading, features } = useQueries({
    queries: [
      listEvents({
        isPast: false,
        isCanceled: false,
        chapterId: chapterFilter?.id,
      }),
      listPosts({
        isPast: false,
        age: Duration.fromObject({ days: 14 }),
        chapterId: chapterFilter?.id,
      }),
      listGroups({
        chapterId: chapterFilter?.id,
      }),
    ],
    combine: (results) => {
      return {
        features: toFeatureCollection(
          results[0].data ?? [],
          results[1].data?.filter((p) => p.coordinates) ?? [],
          results[2].data?.filter((p) => p.coordinates) ?? []
        ),
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });

  const handleMapPress = (ope: OnPressEvent) => {
    clearSelected();
    setSelected(ope.features.map((f) => f.properties as LocalEvent));
  };

  const gotoDetails = (item: LocalEvent | Post | Group) =>
    isEvent(item)
      ? gotoEventDetails(item.id)
      : isPost(item)
      ? gotoPostDetails(item.id)
      : gotoGroupDetails(item.id);

  const clearSelected = () => {
    setSelected([]);
    ref.current?.scrollTo({ index: 0 });
    console.log("current", ref.current?.getCurrentIndex());
  };

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setLayoutWidth(width);
      }}
    >
      <Loader visible={isLoading} />
      <MapView
        style={styles.map}
        zoomEnabled={true}
        compassEnabled={true}
        onPress={clearSelected}
        gestureSettings={{
          pinchPanEnabled: false,
        }}
      >
        <Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={chapterFilter?.zoom}
          animationDuration={20}
        />
        <Images
          images={{
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            event: require("~/assets/map/event.png"),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            posting: require("~/assets/map/post.png"),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            group: require("~/assets/map/group.png"),
          }}
        />
        <ShapeSource
          id="features"
          shape={features}
          hitbox={{ width: 15, height: 15 }}
          onPress={handleMapPress}
        >
          <SymbolLayer id={"symbols"} minZoomLevel={0} style={mapStyles.icon} />
        </ShapeSource>
      </MapView>
      {layoutWidth && selected?.length > 0 && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            bottom: 30,
            width: "100%",
          }}
        >
          <Carousel<LocalEvent | Post | Group>
            ref={ref}
            width={layoutWidth}
            mode="parallax"
            modeConfig={{
              parallaxScrollingOffset: 105,
              parallaxScrollingScale: 0.85,
              parallaxAdjacentItemScale: 0.6,
            }}
            height={120}
            loop={false}
            data={selected}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginLeft: "2.5%",
                }}
              >
                <MapCard
                  key={item.id}
                  item={item}
                  onPress={gotoDetails(item)}
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );

  function toFeatureCollection(
    events: LocalEvent[],
    posts: Post[],
    groups: Group[]
  ) {
    const fc = {
      type: "FeatureCollection",
      features: [...posts, ...events, ...groups].map((item) => ({
        type: "Feature",
        properties: {
          ..._.omit(["coordinates"], item),
          icon: isEvent(item) ? "event" : isPost(item) ? "posting" : "group",
        },
        geometry: {
          type: "Point",
          coordinates: isEvent(item)
            ? item.coordinates
            : // Only so that they're not completely overlapped.
              item.coordinates!.map((c) => c + 0.00005),
        },
      })),
    } as FeatureCollection<GeoJSON.Point>;
    return fc;
  }
};
