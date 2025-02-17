import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
} from "react-native";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { useNavigations } from "~/app-hooks/useNavigations";
import { OneAvatar } from "~/components/avatar/OneAvatar";
import { Loader } from "~/components/loader";
import { Box } from "~/components/ui/box";
import { Center } from "~/components/ui/center";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
import { useChapterFilter } from "~/navigation/AppContext";
import {
  GetUsersSort,
  useUserService,
} from "~/network/api/services/useUserService";
import { OneUser } from "~/types/one-user";

export const UsersGrid = () => {
  const { strings } = useStringsAndLabels();
  const { gotoUserProfile } = useNavigations();
  const chapterFilter = useChapterFilter();

  const {
    queries: { infiniteList: listUsers },
  } = useUserService();

  const {
    data: userList,
    fetchNextPage,
    refetch,
    hasNextPage,
    isRefetching,
    isFetching,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery(
    listUsers({
      sort: GetUsersSort.Join,
      chapterId: chapterFilter?.id ?? undefined,
    })
  );

  const loadNext = useCallback(() => {
    hasNextPage && !isFetching && fetchNextPage().catch(console.error);
  }, [fetchNextPage, hasNextPage, isFetching]);

  const onRefresh = useCallback(() => {
    !isRefetching && refetch().catch(console.error);
  }, [isRefetching, refetch]);

  const userRenderer: ListRenderItem<OneUser> = ({ item: user }) => {
    return (
      // <Center key={users[0].id}>
      //   <HStack space="lg" className="m-4">
      <PressableAvatar user={user} />
      //     {users.length > 1 && <PressableAvatar user={users[1]} />}
      //     {users.length > 2 && <PressableAvatar user={users[2]} />}
      //     {users.length > 3 && <PressableAvatar user={users[3]} />}
      //   </HStack>
      // </Center>
    );
  };

  const PressableAvatar = ({ user }: { user: OneUser }) => {
    return (
      <Pressable onPress={gotoUserProfile(user)}>
        <VStack>
          <Center className="p-3">
            <OneAvatar user={user} size="lg" className="cursor-pointer" />
            <Text size="sm" className="color-slate-200">
              {user.firstName}
            </Text>
          </Center>
        </VStack>
      </Pressable>
    );
  };

  return (
    <>
      <Loader visible={isLoading} />
      <Center>
        <FlatList
          data={userList?.pages.flat() ?? []}
          keyExtractor={(item) => item.id}
          renderItem={userRenderer}
          onEndReached={loadNext}
          horizontal={false}
          numColumns={4}
          columnWrapperClassName="justify-center"
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              // tintColor={theme.colors.white}
              // colors={[theme.colors.white]}
              onRefresh={onRefresh}
            />
          }
          // contentContainerStyle={styles.scrollView}
          ListEmptyComponent={
            <Box>
              <Center>
                <Text>{strings.noUsersFound}</Text>
              </Center>
            </Box>
          }
          // ListHeaderComponent={header}
          ListFooterComponent={
            <Box>
              {isFetchingNextPage && <ActivityIndicator />}
              {!hasNextPage && !isLoading && (
                <Center>
                  <Text className="text-slate-300">No more users.</Text>
                </Center>
              )}
            </Box>
          }
        ></FlatList>
      </Center>

      {/* <ScrollView>
        {_.chunk(4)(userList).map((u) => (
          <Center key={u[0].id}>
            <HStack space="lg" className="m-4">
              <PressableAvatar user={u[0]} />
              {u.length > 1 && <PressableAvatar user={u[1]} />}
              {u.length > 2 && <PressableAvatar user={u[2]} />}
              {u.length > 3 && <PressableAvatar user={u[3]} />}
            </HStack>
          </Center>
        ))}
      </ScrollView> */}
    </>
  );
};
