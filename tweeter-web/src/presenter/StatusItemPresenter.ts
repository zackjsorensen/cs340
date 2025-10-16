import { StatusService } from "src/model.service/StatusService";
import { UserService } from "src/model.service/UserService";
import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface StatusItemView extends View {
  addItems: (items: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  protected page_size = PAGE_SIZE;
  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;
  protected statusService: StatusService;
  protected userService: UserService;

  protected constructor(view: StatusItemView) {
    super(view);
    this.statusService = new StatusService();
    this.userService =  new UserService();
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
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
