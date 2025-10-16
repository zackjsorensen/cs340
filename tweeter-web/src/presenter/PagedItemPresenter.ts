import { UserService } from "src/model.service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface PagedItemView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T> extends Presenter<PagedItemView<T>> {
  private _hasMoreItems: boolean = true;
  protected _lastItem: T | null = null;
  private userService = new UserService();

  protected get lastItem() {
      return this._lastItem;
    }
  
    protected set lastItem(value: T | null) {
      this._lastItem = value;
    }
  
    protected set hasMoreItems(value: boolean) {
      this._hasMoreItems = value;
    }
  
    public get hasMoreItems(): boolean {
      return this._hasMoreItems;
    }
  
    reset() {
      this.lastItem = null;
      this._hasMoreItems = true;
    }
  
    public async getUser(
      authToken: AuthToken,
      alias: string
    ): Promise<User | null> {
      return this.userService.getUser(authToken, alias);
    }
  
    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
