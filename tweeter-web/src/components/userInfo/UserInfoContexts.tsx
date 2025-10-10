import { Context, createContext } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserInfo } from "./UserInfo";

export const UserInfoContext = createContext<UserInfo>({} as UserInfo);

interface UserInfoActions {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void,
  clearUserInfo: () => void,
  setDisplayedUser: (user: User) => void,
}

const defaultUserInfoActions: UserInfoActions = {
  updateUserInfo: () => null,  // what to do here? Is this for business logic?
  clearUserInfo: () => null,         // or for display logic?
  setDisplayedUser: () => null,
}


export const UserInfoActionsContext: Context<UserInfoActions> =
  createContext<UserInfoActions>(defaultUserInfoActions);
