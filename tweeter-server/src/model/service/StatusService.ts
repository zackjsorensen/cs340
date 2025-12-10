import { Status, FakeData, StatusDto, UserDto, hashAlias } from "tweeter-shared";
import { ServerService } from "./ServerService";
import { StatusDAO } from "../../DAO/FeedDAO";
import { StoryDAO } from "../../DAO/StoryDAO";
import { FollowsDAO } from "../../DAO/FollowsDAO";
import { AuthService } from "./AuthService";
import { PostMessage, QueueDAO } from "../../DAO/QueueDAO";

export class StatusService extends ServerService {
  feedDao: StatusDAO;
  followsDao: FollowsDAO;
  authService: AuthService;
  sqsDao: QueueDAO;

  constructor(feedDao: StatusDAO, followsDao: FollowsDAO, authService: AuthService, sqsDao: QueueDAO){
    super();
    this.feedDao = feedDao;
    this.followsDao = followsDao;
    this.authService = authService;
    this.sqsDao = sqsDao;
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
        let messages_1 = [];
        let messages_2 = [];
        for (const follower of allFollowers) {
          if(hashAlias(follower.alias) == 1){
            messages_1.push({feed_owner_handle: follower.alias, statusDto: newStatusDto});
            if(messages_1.length == 25){
              this.sqsDao.sendMessageBatch(1, messages_1);
              console.log("Sent 3 messages to queue1\n");
              messages_1 = [];
            }
          } else{
            messages_2.push({feed_owner_handle: follower.alias, statusDto: newStatusDto});
            if(messages_2.length==25){
              this.sqsDao.sendMessageBatch(2, messages_2);
              messages_2 = [];
              console.log("Sent 3 messages to queue2\n");
            }
          }

          // const success = await this.feedDao.putPost(userAlias, newStatusDto, follower.alias);
          // if (success == false){
          //   throw new Error(`Failed to send post to follower ${follower}`);
          // }
        }
      return;

        // // batch send messages to sqs - fire and forget?
        // let messages = [];
        // for (let i = 0; i < followerAliases_1.length; i++){

        // }

      }
    }

    
    
    // for every follower in followers, this.feedDao.put();
    // this.storyDto.put(status)

    // Pause so we can see the logging out message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };

  public async putStatusesInFeed(messages: PostMessage[]): Promise<boolean>{
    // batch write
    return await this.feedDao.putPostBatch(messages);
  }



}
