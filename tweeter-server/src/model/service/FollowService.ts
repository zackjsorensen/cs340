import { User, FakeData, UserDto } from "tweeter-shared";
import { ServerService } from "./ServerService";

export class Followservice extends ServerService{
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server

    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
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
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number>{
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(userAlias);
  };

    public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number>{
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(userAlias);
  };


  public async follow(token: string, userToFollow: string){
    return await new Promise((f) => setTimeout(f, 2000));
  }

  public async unfollow(token: string, userToUnfollow: string){
    return await new Promise((f) => setTimeout(f, 2000));
  }

}
