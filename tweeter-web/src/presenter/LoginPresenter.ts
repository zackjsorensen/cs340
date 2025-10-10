import { UserService } from "src/model.service/UserService";
import { AuthToken, User } from "tweeter-shared";

export class LoginPresenter {
  private userService: UserService;

  public constructor() {
    this.userService = new UserService();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    try {
      return await this.userService.login(alias, password);
    } catch (error) {
      throw error;
    }
  }
}
