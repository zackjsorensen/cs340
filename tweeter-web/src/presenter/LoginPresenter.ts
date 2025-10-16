import { UserService } from "src/model.service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  authenticated: (user: User, authToken: AuthToken) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
  }

  public async login(
    alias: string,
    password: string,
    originalUrl: string | undefined
  ) {
    this.doFailureReportingOperation(async () => {
      const [user, authToken] = await this.userService.login(alias, password);
      this.view.authenticated(user, authToken);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    }, "log user in");
  }
}
