import MapboxGL, {
  Camera,
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
  UserLocation,
} from "@rnmapbox/maps";
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import eventIcon from "~/assets/map/event.png";
import giftIcon from "~/assets/map/gift.png";
import { LOG } from "~/config";
import { useEventService } from "~/network/api/services/event-service";
import { usePostService } from "~/network/api/services/post-service";
import { PostContentView } from "~/screens/home/PostContentView";
import { LocalEvent } from "~/types/local-event";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";
import { handleApiError } from "~/utils/common";
import { EventItem } from "../events/EventItem";
import { Loader } from "../loader";
import { createStyleSheet } from "./style";

void MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

const BOULDER_LON = -105.2705;
const BOULDER_LAT = 40.015;
const DEFAULT_ZOOM = 11.5;

interface MapProps {
  onEventPress?: (event: LocalEvent) => void;
  onPostPress?: (post: Post) => void;
  onAvatarPress?: (user: OneUser) => void;
}
export const Map = ({ onEventPress, onPostPress, onAvatarPress }: MapProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isLoading, setLoading] = useState(false);

  // TODO Use the center of the current locale
  const centerCoordinate = [BOULDER_LON, BOULDER_LAT];

  const { listEvents } = useEventService();
  const { listPosts } = usePostService();

  const [selectedEvents, setSelectedEvents] = useState<LocalEvent[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);

  // FIXME DateTime.now() should not be embedded in the query
  const eventsQuery = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: () =>
      listEvents({
        startDate: DateTime.now(),
        isCanceled: false,
      }),
  });

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      listPosts({
        startDate: DateTime.now(),
      }),
  });
  if ((eventsQuery.isPending && postsQuery.isPending) !== isLoading) {
    setLoading(eventsQuery.isPending && postsQuery.isPending);
  }
  if (eventsQuery.isError) handleApiError("Events", eventsQuery.error);
  if (postsQuery.isError) handleApiError("Posts", postsQuery.error);

  const events = eventsQuery.data;
  const posts = _.reject((p: Post) => !p.coordinates, postsQuery.data);

  const imageMarkers = {
    event: eventIcon,
    post: giftIcon,
  };

  const findEvent = (id: string) => events?.find((e) => e.id === id);
  const findPost = (id: string) => posts?.find((p) => p.id === id);

  const handleMapEventPress = (ope: OnPressEvent) => {
    LOG.debug("Event clicked", ope);
    const localEvents = ope.features.map((f) => findEvent(f.properties.id));
    setSelectedPosts([]);
    setSelectedEvents(localEvents);
    // selectedEvent?.id === localEvent.id ? undefined : localEvent;
  };

  const handleMapPostPress = (ope: OnPressEvent) => {
    LOG.debug("Post clicked", ope);
    const localPosts = ope.features.map((f) => findPost(f.properties.id));
    setSelectedEvents([]);
    setSelectedPosts(localPosts);
    // selectedEvent?.id === localEvent.id ? undefined : localEvent;
  };

  const clearSelected = () => {
    setSelectedEvents([]);
    setSelectedPosts([]);
  };

  return (
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
        // onRegionDidChange={handleRegionChange}
        // onDidFinishLoadingMap={() => setMapLoaded(true)}
        // ref={mapRef}
        // attributionEnabled={false}
        // onCameraChanged={handleCameraChanged}
      >
        <UserLocation />
        <Camera
          // ref={camera}
          centerCoordinate={centerCoordinate}
          zoomLevel={DEFAULT_ZOOM}
          animationDuration={20}
          // zoomLevel={zoomLevel}
          // maxZoomLevel={14}
          // minZoomLevel={5}
          // followUserLocation={false}
          // centerCoordinate={[
          //   parseFloat(tempdata?.longitude),
          //   parseFloat(tempdata?.latitude),
          // ]}
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
            <EventItem
              key={se.id}
              event={se}
              onPress={() => onEventPress?.(se)}
            />
          ))}
          {selectedPosts.map((sp) => (
            <View key={sp.id} style={styles.listContainer}>
              <PostContentView
                post={sp}
                onPress={() => onPostPress?.(sp)}
                onAvatarPress={onAvatarPress}
              />
            </View>
          ))}
        </>
      </MapView>
    </View>
  );

  function buildLayer(
    type: string,
    data: FeatureCollection<Point>,
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
    };
    console.log("post", JSON.stringify(fc));
    return fc;
  }

  //   _.flow([
  //     _.map((post: PostResource) =>
  //       post.coordinates
  //         ? {
  //             type: "Feature",
  //             properties: { ..._.omit(["location"], post) },
  //             geometry: {
  //               type: "Point",
  //               coordinates: post.coordinates,
  //             },
  //           }
  //         : null
  //     ),
  //     _.reject(_.isNull),
  //   ])(posts),
  // } as GeoJSON.FeatureCollection;

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
    };
    console.log("Fc", JSON.stringify(fc));
    return fc;
  }
};
