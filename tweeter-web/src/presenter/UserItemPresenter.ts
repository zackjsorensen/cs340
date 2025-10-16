import { UserService } from "src/model.service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface UserItemView extends View {
  addItems: (items: User[]) => void;
}

export abstract class UserItemPresenter extends Presenter<UserItemView> {
  private _hasMoreItems: boolean = true;
  private _lastItem: User | null = null;
  private userService: UserService;

  protected constructor(view: UserItemView) {
    super(view);
    this.userService = new UserService();
  }


  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: User | null) {
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
