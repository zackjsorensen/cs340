import { AuthToken, User} from "tweeter-shared";
import { UserItemPresenter} from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter {

  protected itemDescription(): string {
    return "load followers";
  }

  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }
}
