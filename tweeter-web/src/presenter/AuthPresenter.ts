import { Presenter, View } from "./Presenter";
import { UserService } from "src/model.service/UserService";
import { User, AuthToken } from "tweeter-shared";

export interface AuthView extends View {
  authenticated: (user: User, authToken: AuthToken) => void;
  navigate: (url: string) => void;
}

export interface MyRequest{
}

export abstract class AuthPresenter<R extends MyRequest> extends Presenter<AuthView> {
  service: UserService = new UserService();
  public async doAuthentication(data: R) {
    this.doFailureReportingOperation(async () => {
      const [user, authToken] = await this.sumbit(data);
      this.view.authenticated(user, authToken);
      this.doNavigation(`/feed/${user.alias}`, data);
    }, this.operation_description());
  }

  protected abstract operation_description(): string;

  protected abstract doNavigation(url: string, data?: R): void;

  protected abstract sumbit(data: R): Promise<[User, AuthToken]>;
}
