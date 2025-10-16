import { Followservice } from "src/model.service/FollowService";
import { AuthToken} from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;


// needs to notify the component

export class FolloweePresenter extends UserItemPresenter {

  private service: Followservice;


  public constructor(view: UserItemView) {
    super(view);
    this.service = new Followservice();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation( async () => {
      const [newItems, hasMore] = await this.service.loadMoreFollowees(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1]: null;
      this.view.addItems(newItems);
    }, "load followees");
  }
} // will call the follow service
