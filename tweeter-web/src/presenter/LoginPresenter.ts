import { UserService } from "src/model.service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { AuthPresenter, MyRequest } from "./AuthPresenter";

export interface LoginRequest extends MyRequest {
  alias: string;
  password: string;
  originalUrl: string | undefined;
}

export class LoginPresenter extends AuthPresenter<LoginRequest> {

  public async sumbit(data: LoginRequest): Promise<[User, AuthToken]> {
      const [user, authtoken] =  await this.service.login(
        data.alias,
        data.password
      );
      console.log(`LOGIN_PRESENTER received this authToken on login/register attempt: ${JSON.stringify(authtoken)}`);
      return [user, authtoken];
  }

  protected doNavigation(url: string, data: LoginRequest): void {
      if ((data) && (data.originalUrl)){
        this.view.navigate(data.originalUrl);
      } else {
        this.view.navigate(url);
      }
  }

  protected operation_description(): string {
      return "log user in";
  }
}
