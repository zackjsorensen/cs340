import { Followservice } from "src/model.service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export class UserInfoPresenter {
  service: Followservice;

  public constructor() {
    this.service = new Followservice();
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.service.getIsFollowerStatus(authToken, user, selectedUser);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.service.getFolloweeCount(authToken, user);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.service.getFollowerCount(authToken, user);
  }

  public async follow(authToken: AuthToken, userToFollow: User) {
    await this.service.follow(authToken, userToFollow);
    const followerCount = await this.service.getFollowerCount(
      authToken,
      userToFollow
    );
    const followeeCount = await this.service.getFolloweeCount(
      authToken,
      userToFollow
    );
    return [followerCount, followeeCount];
  }

  public async unfollow(authToken: AuthToken, userToUnfollow: User){
    await this.service.unfollow(authToken, userToUnfollow);
    const followerCount = await this.service.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.service.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
