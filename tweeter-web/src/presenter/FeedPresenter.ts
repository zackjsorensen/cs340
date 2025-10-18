import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  
  public constructor(statusView: PagedItemView<Status>) {
    super(statusView);
  }

  protected itemDescription(): string {
    return "load feed items";
  }
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }
}
