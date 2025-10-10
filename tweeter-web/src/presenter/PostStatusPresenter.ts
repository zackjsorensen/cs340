import { StatusService } from "src/model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
}

export class PostStatusPresenter {
  private statusService: StatusService;
  public view: PostStatusView;

  public constructor(view: PostStatusView) {
    this.statusService = new StatusService();
    this.view = view;
  }

  public async postStatus(authToken: AuthToken, user: User, post: string) {
    try {
      const status = new Status(post, user, Date.now());
      await this.statusService.postStatus(authToken, status);
      this.view.displayInfoMessage("Status posted!", 0);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    }
  }
}
