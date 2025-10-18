import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class Followservice implements Service{
  // convert arrow functions to methods now that they are in a class
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number>{
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

    public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number>{
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };


  public async follow(authToken: AuthToken, userToFollow: User){
    return await new Promise((f) => setTimeout(f, 2000));
  }

  public async unfollow(authToken: AuthToken, userToUnfollow: User){
    return await new Promise((f) => setTimeout(f, 2000));
  }
}
