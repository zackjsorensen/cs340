import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PagedItemView } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
    public constructor(view: PagedItemView<Status>){
        super(view);
    }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async() => {
      const [newItems, hasMore] = await this.statusService.loadMoreStoryItems(
        authToken!,
        userAlias,
        this.page_size,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1]: null;
      this.view.addItems(newItems);
    }, "load story items")
  }
}
