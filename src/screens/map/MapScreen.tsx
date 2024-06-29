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
import { LocalEvent } from "~/types/local-event";
import { MappablePost, Post } from "~/types/post";
import { Loader } from "../../components/loader";
import { createStyleSheet } from "../../components/map/style";
import { MapCard } from "./MapCard";

void MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

const BOULDER_LON = -105.2705;
const BOULDER_LAT = 40.015;
const DEFAULT_ZOOM = 11.5;

const mapStyles = {
  postIcon: {
    iconImage: "posting",
    iconAllowOverlap: true,
  },
  eventIcon: {
    iconImage: "event",
    iconAllowOverlap: true,
  },
};

export const MapScreen = () => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [selectedEvents, setSelectedEvents] = useState<LocalEvent[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<MappablePost[]>([]);
  const { gotoEventDetails, gotoPostDetails } = useNavigations();

  // TODO Use the center of the current community
  const centerCoordinate = [BOULDER_LON, BOULDER_LAT];

  const {
    queries: { list: listEvents },
  } = useEventService();
  const {
    queries: { list: listPosts },
  } = usePostService();

  const { isLoading, events, posts } = useQueries({
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
        // FIXME transform data here rather than caching it
        events: results[0].data,
        posts: results[1].data?.filter((p) => p.coordinates),
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });

  const handleMapEventPress = (ope: OnPressEvent) => {
    setSelectedPosts([]);
    setSelectedEvents(ope.features.map((f) => f.properties as LocalEvent));
  };

  const handleMapPostPress = (ope: OnPressEvent) => {
    setSelectedEvents([]);
    setSelectedPosts(ope.features.map((f) => f.properties as MappablePost));
  };

  const clearSelected = () => {
    setSelectedEvents([]);
    setSelectedPosts([]);
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
          {posts && (
            <ShapeSource
              id="posts"
              shape={postsToFeatureCollection(posts)}
              hitbox={{ width: 20, height: 20 }}
              onPress={handleMapPostPress}
            >
              <SymbolLayer
                id={"PostSymbols"}
                minZoomLevel={0}
                style={mapStyles.postIcon}
              />
            </ShapeSource>
          )}
          {events && (
            <ShapeSource
              id="events"
              shape={eventsToFeatureCollection(events)}
              hitbox={{ width: 20, height: 20 }}
              onPress={handleMapEventPress}
            >
              <SymbolLayer
                id={"EventSymbols"}
                minZoomLevel={0}
                style={mapStyles.eventIcon}
              />
            </ShapeSource>
          )}
          <>
            {selectedEvents.map((se) => (
              <MapCard
                key={se.id}
                item={se}
                onPress={gotoEventDetails(se.id)}
              />
            ))}
            {selectedPosts.map((sp) => (
              <MapCard
                key={sp.id}
                item={{
                  ...sp,
                  image: sp.images?.[0] ?? undefined,
                  about: sp.details,
                }}
                onPress={gotoPostDetails(sp.id)}
              />
            ))}
          </>
        </MapView>
      </View>
    </TouchableWithoutFeedback>
  );

  function postsToFeatureCollection(posts: Post[]) {
    const fc = {
      type: "FeatureCollection",
      features: posts.map((post) => ({
        type: "Feature",
        properties: { ..._.omit(["coordinates"], post) },
        geometry: {
          type: "Point",
          coordinates: post.coordinates,
        },
      })),
    } as FeatureCollection<GeoJSON.Point>;
    return fc;
  }

  function eventsToFeatureCollection(events: LocalEvent[]) {
    const fc = {
      type: "FeatureCollection",
      features: events.map((event) => ({
        type: "Feature",
        properties: { ..._.omit(["coordinates"], event) },
        geometry: {
          type: "Point",
          coordinates: event.coordinates,
        },
      })),
    } as FeatureCollection<GeoJSON.Point>;
    return fc;
  }
};
