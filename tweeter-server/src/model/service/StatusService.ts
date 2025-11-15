import { Status, FakeData, StatusDto } from "tweeter-shared";
import { Service } from "../../../../tweeter-web/src/model.service/Service";

export class StatusService implements Service {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItemDto: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItemDto, pageSize);
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
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItemDto, pageSize);
  };


  // IS THIS THE RIGHT PLACE FOR THIS??????????????
  public async postStatus(
    token: string,
    newStatusDto: StatusDto
  ): Promise<void>{
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };



}
