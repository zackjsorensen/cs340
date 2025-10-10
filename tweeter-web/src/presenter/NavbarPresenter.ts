import { UserService } from "src/model.service/UserService";
import { AuthToken } from "tweeter-shared";


export class NavbarPresenter{
    service: UserService;

    public constructor(){
        this.service = new UserService();
    }

    public async logout(authToken: AuthToken){
        return await this.service.logout(authToken);
    }
}