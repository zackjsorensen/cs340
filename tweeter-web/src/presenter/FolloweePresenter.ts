import { Followservice } from "src/model.service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PagedItemView } from "./PagedItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {

  protected itemDescription(): string {
    return "load followees";
  }

  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees( authToken, userAlias, PAGE_SIZE, this.lastItem);
  }
}
