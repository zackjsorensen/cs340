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
   this.toggleFollow(authToken, userToFollow, "follow", this.service.follow)
  }

  public async unfollow(authToken: AuthToken, userToUnfollow: User) {
    this.toggleFollow(authToken, userToUnfollow, "unfollow", this.service.unfollow);
  }

  public async toggleFollow(
    authToken: AuthToken,
    userToToggle: User,
    action: string,
    doAction: (authToken: AuthToken, userToToggle: User) => void
  ) {
    var userToast = "";
    try {
      await this.doFailureReportingOperation(async () => {
        userToast = this.view.displayInfoMessage(
          `${action}ing ${userToToggle!.name}...`,
          0
        );
        // need to figure this out
        await this.service.follow(authToken, userToToggle);
        await doAction(authToken, userToToggle);
        const followerCount = await this.service.getFollowerCount(
          authToken,
          userToToggle
        );
        const followeeCount = await this.service.getFolloweeCount(
          authToken,
          userToToggle
        );

        let wantToFollow: boolean = false;
        if (action === "follow") {
          wantToFollow = true;
        }

        this.view.setIsFollower(wantToFollow);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, `${action} user`);
    } finally {
      this.view.deleteMessage(userToast);
    }
  }
}
