import { Rows4, User, Users } from "lucide-react-native";
import React from "react";
import { Button, ButtonIcon, ButtonText } from "~/components/ui/button";
import { Center } from "~/components/ui/center";
import { HStack } from "~/components/ui/hstack";
import { Icon } from "~/components/ui/icon";

export type ActiveScreen = "posts" | "groups" | "users";

export const HomeScreenTypeChooser = ({
  activeScreen,
  onScreenChosen,
}: {
  activeScreen: ActiveScreen;
  onScreenChosen: (screen: ActiveScreen) => void;
}) => {
  const setScreenChosen = (screen: ActiveScreen) => {
    onScreenChosen(screen);
  };

  return (
    <Center>
      <HStack>
        <Button
          className={activeScreen === "posts" ? "bg-slate-400" : "bg-slate-700"}
          onPress={() => setScreenChosen("posts")}
        >
          <ButtonIcon as={Rows4} />
          <ButtonText>Posts</ButtonText>
        </Button>
        <Button
          className={
            activeScreen === "groups" ? "bg-slate-400" : "bg-slate-700"
          }
          onPress={() => setScreenChosen("groups")}
        >
          <Icon as={Users} size="md" color="white" />
          <ButtonText>Groups</ButtonText>
        </Button>
        <Button
          className={activeScreen === "users" ? "bg-slate-400" : "bg-slate-700"}
          onPress={() => setScreenChosen("users")}
        >
          <Icon as={User} size="md" color="white" />
          <ButtonText>Users</ButtonText>
        </Button>
      </HStack>
    </Center>
  );
};
