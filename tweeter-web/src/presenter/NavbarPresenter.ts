import { UserService } from "src/model.service/UserService";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";

export interface NavBarView extends MessageView {
    clearUserInfo: () => void;
    navigateToLogin: () => void;
}

export class NavbarPresenter extends Presenter<NavBarView> {
    service: UserService;

    public constructor(view: NavBarView){
        super(view);
        this.service = new UserService();
    }

    public async logout(authToken: AuthToken){
        
        this.doFailureReportingOperation( async () => {
            const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
            await this.service.logout(authToken);
            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigateToLogin();
    }, "log user out")
    }

    
}