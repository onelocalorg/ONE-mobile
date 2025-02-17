import { OneUser } from "~/types/one-user";
import { isUserProfile, UserProfile } from "~/types/user-profile";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { Box } from "../ui/box";

type OneAvatarProps = {
  user: OneUser | UserProfile;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | undefined;
};
export const OneAvatar = ({ user, className, size = "sm" }: OneAvatarProps) => {
  return (
    <Box className={className}>
      <Avatar size={size}>
        <AvatarFallbackText className="text-white">
          {`${user.firstName} ${user.lastName}`}
        </AvatarFallbackText>
        <AvatarImage
          source={
            user.pic
              ? { uri: isUserProfile(user) ? user.pic?.url : user.pic }
              : undefined
          }
          alt="Profile image"
        />
      </Avatar>
    </Box>
  );
};
