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
import React, { useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { useEventService } from "~/network/api/services/useEventService";
import { usePostService } from "~/network/api/services/usePostService";
import { LocalEvent, isEvent } from "~/types/local-event";
import { Post } from "~/types/post";
import { Loader } from "../../components/loader";
import { createStyleSheet } from "../../components/map/style";
import { MapCard } from "./MapCard";

void MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

const BOULDER_LON = -105.2705;
const BOULDER_LAT = 40.015;
const DEFAULT_ZOOM = 11.5;

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
  const { gotoEventDetails, gotoPostDetails } = useNavigations();

  // TODO Use the center of the current community
  const centerCoordinate = [BOULDER_LON, BOULDER_LAT];

  const {
    queries: { list: listEvents },
  } = useEventService();
  const {
    queries: { list: listPosts },
  } = usePostService();

  const { isLoading, features } = useQueries({
    queries: [
      listEvents({
        isPast: false,
        isCanceled: false,
      }),
      listPosts({
        isPast: false,
        age: Duration.fromObject({ days: 14 }),
      }),
    ],
    combine: (results) => {
      return {
        features: toFeatureCollection(
          results[0].data ?? [],
          results[1].data?.filter((p) => p.coordinates) ?? []
        ),
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });

  console.log("features", JSON.stringify(features, undefined, " "));

  const handleMapPress = (ope: OnPressEvent) => {
    console.log("event", JSON.stringify(ope.features, undefined, "  "));
    setSelected(ope.features.map((f) => f.properties as LocalEvent));
  };

  const gotoDetails = (item: LocalEvent | Post) =>
    isEvent(item) ? gotoEventDetails(item.id) : gotoPostDetails(item.id);

  const clearSelected = () => {
    setSelected([]);
  };

  return (
    <TouchableWithoutFeedback onPress={clearSelected}>
      <View style={{ flex: 1 }}>
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
            zoomLevel={DEFAULT_ZOOM}
            animationDuration={20}
          />
          <Images
            images={{
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              event: require("~/assets/map/event.png"),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              posting: require("~/assets/map/post.png"),
            }}
          />
          <ShapeSource
            id="features"
            shape={features}
            hitbox={{ width: 15, height: 15 }}
            onPress={handleMapPress}
          >
            <SymbolLayer
              id={"symbols"}
              minZoomLevel={0}
              style={mapStyles.icon}
            />
          </ShapeSource>

          <>
            {selected.map((se) => (
              <MapCard key={se.id} item={se} onPress={gotoDetails(se)} />
            ))}
          </>
        </MapView>
      </View>
    </TouchableWithoutFeedback>
  );

  function toFeatureCollection(events: LocalEvent[], posts: Post[]) {
    const fc = {
      type: "FeatureCollection",
      features: [...posts, ...events].map((item) => ({
        type: "Feature",
        properties: {
          ..._.omit(["coordinates"], item),
          icon: isEvent(item) ? "event" : "posting",
        },
        geometry: {
          type: "Point",
          coordinates: item.coordinates,
        },
      })),
    } as FeatureCollection<GeoJSON.Point>;
    return fc;
  }
};
