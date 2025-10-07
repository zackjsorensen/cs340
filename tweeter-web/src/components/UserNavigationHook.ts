import { AuthToken, FakeData, User } from "tweeter-shared";
import { useMessageActions } from "./toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";


export const useUserNavigation = () => {
  const { displayErrorMessage } = useMessageActions();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const navigate = useNavigate();

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`/story/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return navigateToUser;

};
