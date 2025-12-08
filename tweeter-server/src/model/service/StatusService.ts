import { Status, FakeData, StatusDto, UserDto } from "tweeter-shared";
import { ServerService } from "./ServerService";
import { StatusDAO } from "../../DAO/FeedDAO";
import { StoryDAO } from "../../DAO/StoryDAO";
import { FollowsDAO } from "../../DAO/FollowsDAO";
import { AuthService } from "./AuthService";

export class StatusService extends ServerService {
  feedDao: StatusDAO;
  followsDao: FollowsDAO;
  authService: AuthService;

  constructor(feedDao: StatusDAO, followsDao: FollowsDAO, authService: AuthService){
    super();
    this.feedDao = feedDao;
    this.followsDao = followsDao;
    this.authService = authService;
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItemDto: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.feedDao.getFeedPage(userAlias, pageSize, lastItemDto);
    // return this.getFakeData(lastItemDto, pageSize);
  }

  private getFakeData(lastItemDto: StatusDto, pageSize: number): [StatusDto[], boolean]{
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItemDto), pageSize);
    const dtos: StatusDto[] = items.map(item => item.dto);
    return [dtos, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItemDto: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.feedDao.getStoriesPage(userAlias, pageSize, lastItemDto);
    // return this.getFakeData(lastItemDto, pageSize);
  };


  public async postStatus(
    token: string,
    newStatusDto: StatusDto
  ): Promise<void>{

    const userAlias: string = await this.authService.getUserByToken(token);
    const storySuccess = await this.feedDao.putStory(userAlias, newStatusDto);
    if (storySuccess == false){
      throw new Error(`Failed to add to story. User: ${userAlias}, Post: ${newStatusDto}`);
    }

    const numFollowers:number = await this.followsDao.getFollowerCount(userAlias);
    if (numFollowers > 0){
      let [allFollowers, hasMore] = await this.followsDao.getPageOfFollowers(userAlias, numFollowers, undefined);
      if (allFollowers){
        for (const follower of allFollowers) {
          const success = await this.feedDao.putPost(userAlias, newStatusDto, follower.alias);
          if (success == false){
            throw new Error(`Failed to send post to follower ${follower}`);
          }
        }
      }
    }
    
    // for every follower in followers, this.feedDao.put();
    // this.storyDto.put(status)

    // Pause so we can see the logging out message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };



}
