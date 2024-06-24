import MapboxGL, {
  Camera,
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
  UserLocation,
} from "@rnmapbox/maps";
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import { useQueries } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";
import _ from "lodash/fp";
import React, { useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import eventIcon from "~/assets/map/event.png";
import postIcon from "~/assets/map/post.png";
import { MapStackScreenProps, Screens } from "~/navigation/types";
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
const DEFAULT_ZOOM = 8; //11.5;

export const MapScreen = ({ navigation }: MapStackScreenProps<Screens.MAP>) => {
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

  const imageMarkers = {
    event: eventIcon,
    post: postIcon,
  };

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
          <UserLocation />
          <Camera
            centerCoordinate={centerCoordinate}
            zoomLevel={DEFAULT_ZOOM}
            animationDuration={20}
          />
          {events
            ? buildLayer(
                "event",
                eventsToFeatureCollection(events),
                handleMapEventPress
              )
            : null}
          {posts
            ? buildLayer(
                "post",
                postsToFeatureCollection(posts),
                handleMapPostPress
              )
            : null}
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

  function buildLayer(
    type: string,
    data: FeatureCollection<GeoJSON.Point>,
    onPress: (e: OnPressEvent) => void
  ) {
    return (
      <ShapeSource
        id={type}
        shape={data}
        hitbox={{ width: 20, height: 20 }}
        onPress={onPress}
      >
        <SymbolLayer
          id={`${type}Symbol`}
          minZoomLevel={1}
          style={{
            iconImage: type,
          }}
        />
        <Images
          images={imageMarkers}
          onImageMissing={(imageKey: string) =>
            console.log("=> on image missing", imageKey)
          }
        />
      </ShapeSource>
    );
  }

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
