import { User, FakeData, UserDto } from "tweeter-shared";
import { ServerService } from "./ServerService";
import { FollowsDAO } from "../../DAO/FollowsDAO";
import { FeedDAO } from "../../DAO/FeedDAO";
import { AuthService } from "./AuthService";

export class Followservice extends ServerService{
  followsDao: FollowsDAO;
  feedDao: FeedDAO;
  authService: AuthService;

  constructor(followsDao: FollowsDAO, feedDao: FeedDAO, authService: AuthService){
    super();
    this.followsDao = followsDao;
    this.feedDao = feedDao;
    this.authService = authService;
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    let lastHandle: string | undefined;
    if (lastItem == null){
      lastHandle = undefined;
    } else {
      lastHandle = lastItem.alias;
    }

    return await this.followsDao.getPageOfFollowees(userAlias, pageSize, lastHandle);
    // return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {

    let lastHandle: string | undefined;
    if (lastItem == null){
      lastHandle = undefined;
    } else {
      lastHandle = lastItem.alias;
    }
    return await this.followsDao.getPageOfFollowers(userAlias, pageSize, lastHandle);
    // return this.getFakeData(lastItem, pageSize, userAlias);
  }

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    currentUser: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    return await this.followsDao.getFollower(currentUser.alias, selectedUser.alias);
    // return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number>{
    return await this.followsDao.getFolloweeCount(userAlias);
    // return FakeData.instance.getFolloweeCount(userAlias);
  };

    public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number>{
    return await this.followsDao.getFollowerCount(userAlias);
    // return FakeData.instance.getFollowerCount(userAlias);
  };


  public follow = async (token: string, userToFollow: string) => {
    const loggedInUserAlias: string = await this.authService.getUserByToken(token);
    return await this.followsDao.addFollower(loggedInUserAlias, userToFollow);
    return await new Promise((f) => setTimeout(f, 2000));
  }

  public unfollow = async (token: string, userToUnfollow: string) => {
    const loggedInUserAlias: string = await this.authService.getUserByToken(token);
    return await this.followsDao.removeFollower(loggedInUserAlias, userToUnfollow);
    return await new Promise((f) => setTimeout(f, 2000));
  }

}
