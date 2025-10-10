import { AuthToken} from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  public constructor(statusView: StatusItemView) {
    super(statusView);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.statusService.loadMoreFeedItems(
        authToken!,
        userAlias,
        this.page_size,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1]: null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load feed items because of exception: ${error}`
      );
    }
  }
}
