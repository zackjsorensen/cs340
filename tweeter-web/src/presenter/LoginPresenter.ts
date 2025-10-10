import { UserService } from "src/model.service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private userService: UserService;
  public view: LoginView;

  public constructor(view: LoginView) {
    this.userService = new UserService();
    this.view = view;
  }

  // public async login(alias: string, password: string) {
  //   try {
  //     return await this.userService.login(alias, password);
  //   } catch (error) {
  //     this.view.displayErrorMessage(
  //       `Failed to log user in because of exception: ${error}`
  //     );
  //   }
  // }


    public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    try{
      return await this.userService.login(alias, password);
    } catch (error){
      throw error;
    }
  }
}
