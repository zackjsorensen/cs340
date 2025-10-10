import { UserService } from "src/model.service/UserService";
import { AuthToken } from "tweeter-shared";


export class IndividualUserItemPresenter{
    service: UserService;

    public constructor(){
        this.service = new UserService();
    }

    private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };

    public async getUser(authToken: AuthToken, value: string){
        const alias = this.extractAlias(value);
        return await this.service.getUser(authToken, alias);
    }

}