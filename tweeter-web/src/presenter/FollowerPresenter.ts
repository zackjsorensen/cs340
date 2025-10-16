import { Followservice } from "src/model.service/FollowService";
import { AuthToken, User} from "tweeter-shared";
import { UserItemPresenter} from "./UserItemPresenter";
import { PagedItemView } from "./PagedItemPresenter";

export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter {

  private service: Followservice;

  public constructor(view: PagedItemView<User>) {
    super(view);
    this.service = new Followservice();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async()=> {
      const [newItems, hasMore] = await this.service.loadMoreFollowers(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1]: null;
      this.view.addItems(newItems);
    }, "load followers");
  }
}
