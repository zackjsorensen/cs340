import { UserService } from "src/model.service/UserService";
import { AuthToken, User} from "tweeter-shared";

export class NavigationPresenter {
    service: UserService;

    public constructor(){
        this.service= new UserService();
    }
  /* should extractAlias be in here, 
  or stay in the view since it's trivial?*/

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.service.getUser(authToken, alias);
  }
}
