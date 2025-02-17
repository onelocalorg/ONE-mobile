import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import { Pressable, ScrollView } from "react-native";
import { useNavigations } from "~/app-hooks/useNavigations";
import { OneAvatar } from "~/components/avatar/OneAvatar";
import { Loader } from "~/components/loader";
import { Center } from "~/components/ui/center";
import { HStack } from "~/components/ui/hstack";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
import { useChapterFilter } from "~/navigation/AppContext";
import {
  GetUsersSort,
  useUserService,
} from "~/network/api/services/useUserService";
import { OneUser } from "~/types/one-user";

export const UsersGrid = () => {
  const { gotoUserProfile } = useNavigations();
  const chapterFilter = useChapterFilter();

  const {
    queries: { list: listUsers },
  } = useUserService();

  const { isLoading, data: userList } = useQuery(
    listUsers({
      sort: GetUsersSort.FirstName,
      limit: 500,
      chapterId: chapterFilter?.id ?? undefined,
    })
  );

  const PressableAvatar = ({ user }: { user: OneUser }) => {
    return (
      <Pressable onPress={gotoUserProfile(user)}>
        <VStack>
          <Center>
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
      <ScrollView>
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
      </ScrollView>
    </>
  );
};
