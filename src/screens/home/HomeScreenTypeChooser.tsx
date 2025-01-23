import { Rows4, Users } from "lucide-react-native";
import React from "react";
import { Button, ButtonIcon, ButtonText } from "~/components/ui/button";
import { Center } from "~/components/ui/center";
import { HStack } from "~/components/ui/hstack";
import { Icon } from "~/components/ui/icon";

export const HomeScreenTypeChooser = ({
  onGroupsChosen,
}: {
  onGroupsChosen: (isGroupsChosen: boolean) => void;
}) => {
  const [isGroupsChosen, setGroupsChosen] = React.useState(false);

  const notifySetGroupsChosen = (newSetting: boolean) => {
    if (isGroupsChosen !== newSetting) {
      onGroupsChosen(newSetting);
      setGroupsChosen(newSetting);
    }
  };

  return (
    <Center>
      <HStack>
        <Button
          className={isGroupsChosen ? "bg-slate-400" : "bg-slate-700"}
          onPress={() => notifySetGroupsChosen(false)}
        >
          <ButtonIcon as={Rows4} />
          <ButtonText>Posts</ButtonText>
        </Button>
        <Button
          className={!isGroupsChosen ? "bg-slate-400" : "bg-slate-700"}
          onPress={() => notifySetGroupsChosen(true)}
        >
          <Icon as={Users} size="md" color="white" />
          <ButtonText>Groups</ButtonText>
        </Button>
      </HStack>
    </Center>
  );
};
