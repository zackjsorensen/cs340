import { UserService } from "src/model.service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  authenticated: (user: User, authToken: AuthToken) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter {
  private userService: UserService;
  public view: LoginView;

  public constructor(view: LoginView) {
    this.userService = new UserService();
    this.view = view;
  }

  public async login(
    alias: string,
    password: string,
    originalUrl: string | undefined
  ) {
    try {
      const [user, authToken] = await this.userService.login(alias, password);
      this.view.authenticated(user, authToken);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }
}
