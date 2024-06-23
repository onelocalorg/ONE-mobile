import { ReactNode } from "react";
import { useAuthService } from "~/network/api/services/useAuthService";
import { usePostService } from "~/network/api/services/usePostService";
import { useUserService } from "~/network/api/services/useUserService";

// interface IApiContext {
//   authService: {
//     logIn: (props: LoginProps) => Promise<CurrentUser>;
//     signUp: (props: NewUser) => Promise<CurrentUser>;
//     googleLogin: (props: GoogleLoginProps) => Promise<CurrentUser>;
//     appleLogin: (props: AppleLoginProps) => Promise<CurrentUser>;
//   };
//   userService: {
//     getUserProfile: (userId: string) => UserProfile;
//     updateUserProfile: (userId: string, data: UserProfileData) => any;
//     deleteUser: (userId: string) => any;
//     getRecentlyJoined: () => OneUser[];
//   };
//   postService: {
//     createPost: (data: PostData) => Promise<Post>;
//     updatePost: (id: string, data: PostUpdateData) => Promise<any>;
//     listPosts: (props?: ListPostsParams | undefined) => Promise<Post[]>;
//     getPost: (id: string) => Post;
//   };
// }

// Using contexts for dependency injection is the right thing to do.
// Using to shared state should be minimized, however using it for just
// the token makes sense because it rarely changes
// const ApiContext = createContext<IApiContext | null>(null);

interface ApiClientProviderProps {
  children: ReactNode;
}
export function ApiClientProvider({ children }: ApiClientProviderProps) {
  const authService = useAuthService();
  const userService = useUserService();
  const postService = usePostService();

  return {
    authService,
    userService,
    postService,
  };

  // return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}
