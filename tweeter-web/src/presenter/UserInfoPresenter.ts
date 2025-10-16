import { Followservice } from "src/model.service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  service: Followservice;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new Followservice();
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (user === selectedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            user!,
            selectedUser!
          )
        );
      }
    }, "determine follower status");
  }

  public async getFolloweeCount(authToken: AuthToken, user: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, user)
      );
    }, "get followees count");
  }

  public async getFollowerCount(authToken: AuthToken, user: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, user)
      );
    }, "get followers count");
  }

  public async follow(authToken: AuthToken, userToFollow: User) {
    var followingUserToast = "";
    try {
      await this.doFailureReportingOperation(async () => {
        followingUserToast = this.view.displayInfoMessage(
          `Following ${userToFollow!.name}...`,
          0
        );
        await this.service.follow(authToken, userToFollow);
        const followerCount = await this.service.getFollowerCount(
          authToken,
          userToFollow
        );
        const followeeCount = await this.service.getFolloweeCount(
          authToken,
          userToFollow
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "follow user");
    } finally {
      this.view.deleteMessage(followingUserToast);
    }
  }

  public async unfollow(authToken: AuthToken, userToUnfollow: User) {
    var unfollowingUserToast = "";
    try {
      await this.doFailureReportingOperation(async () => {
        unfollowingUserToast = this.view.displayInfoMessage(
          `Unfollowing ${userToUnfollow!.name}...`,
          0
        );

        await this.service.unfollow(authToken, userToUnfollow);
        const followerCount = await this.service.getFollowerCount(
          authToken,
          userToUnfollow
        );
        const followeeCount = await this.service.getFolloweeCount(
          authToken,
          userToUnfollow
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "unfollow user");
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
    }
  }
}
