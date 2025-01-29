import { OneUser } from "~/types/one-user";
import { isUserProfile, UserProfile } from "~/types/user-profile";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { Box } from "../ui/box";

type OneAvatarProps = {
  user?: OneUser | UserProfile;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | undefined;
};
export const OneAvatar = ({ user, className, size = "sm" }: OneAvatarProps) => {
  return (
    <Box className={className}>
      <Avatar size={size}>
        <AvatarFallbackText>
          {user?.firstName} {user?.lastName}
        </AvatarFallbackText>
        <AvatarImage
          source={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            user?.pic
              ? { uri: isUserProfile(user) ? user.pic?.url : user.pic }
              : require("~/assets/images/defaultUser.png")
          }
          alt="Profile image"
        />
      </Avatar>
    </Box>
  );
};
