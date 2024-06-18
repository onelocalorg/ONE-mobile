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
import React, { useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import eventIcon from "~/assets/map/event.png";
import giftIcon from "~/assets/map/gift.png";
import { LOG } from "~/config";
import { MapStackScreenProps, Screens } from "~/navigation/types";
import { useEventService } from "~/network/api/services/useEventService";
import { usePostService } from "~/network/api/services/usePostService";
import { PostCard } from "~/screens/home/PostCard";
import { LocalEvent } from "~/types/local-event";
import { Post } from "~/types/post";
import { handleApiError } from "~/utils/common";
import { EventItem } from "../../components/events/EventItem";
import { Loader } from "../../components/loader";
import { createStyleSheet } from "../../components/map/style";

void MapboxGL.setAccessToken(process.env.MAP_ACCESS_TOKEN!);

const BOULDER_LON = -105.2705;
const BOULDER_LAT = 40.015;
const DEFAULT_ZOOM = 11.5;

export const MapScreen = ({ navigation }: MapStackScreenProps<Screens.MAP>) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const [isLoading, setLoading] = useState(false);
  const { gotoEventDetails, gotoUserProfile, gotoPostDetails } =
    useNavigations();

  // TODO Use the center of the current locale
  const centerCoordinate = [BOULDER_LON, BOULDER_LAT];

  const {
    queries: { list: listEvents },
  } = useEventService();
  const {
    queries: { list: listPosts },
  } = usePostService();

  const [selectedEvents, setSelectedEvents] = useState<LocalEvent[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);

  // FIXME DateTime.now() should not be embedded in the query
  const eventsQuery = useQuery(
    listEvents({
      isPast: false,
      isCanceled: false,
    })
  );

  const postsQuery = useQuery(
    listPosts({
      isPast: false,
    })
  );

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
    const localEvents = ope.features.map((f) =>
      f.properties ? findEvent(f.properties.id) : null
    );
    setSelectedPosts([]);
    setSelectedEvents(localEvents);
    // selectedEvent?.id === localEvent.id ? undefined : localEvent;
  };

  const handleMapPostPress = (ope: OnPressEvent) => {
    LOG.debug("Post clicked", ope);
    const localPosts = ope.features.map((f) =>
      f.properties ? findPost(f.properties.id) : null
    );
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
            <EventItem key={se.id} event={se} />
          ))}
          {selectedPosts.map((sp) => (
            <View key={sp.id} style={styles.listContainer}>
              <PostCard post={sp} />
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
    // console.log("post", JSON.stringify(fc));
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
    // console.log("Fc", JSON.stringify(fc));
    return fc;
  }
};
