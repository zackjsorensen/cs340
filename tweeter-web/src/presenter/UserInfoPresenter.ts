import { Followservice } from "src/model.service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { MessageView } from "./Presenter";

export interface UserInfoView extends MessageView{
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
}

export class UserInfoPresenter {
  service: Followservice;
  view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.service = new Followservice();
    this.view = view;
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ) {
    try {
      if (user === selectedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, user!, selectedUser!)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ){
    try {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, user));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ){
    try {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, user));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async follow(authToken: AuthToken, userToFollow: User) {

    var followingUserToast = "";
    try {
      followingUserToast = this.view.displayInfoMessage(
        `Following ${userToFollow!.name}...`,
        0
      );

      const followerCount = await this.service.getFollowerCount(authToken, userToFollow);
      const followeeCount = await this.service.getFolloweeCount(authToken, userToFollow);

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
    }


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
