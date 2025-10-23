import { StatusService } from "src/model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView {
    setPost(value: string): void;
    setIsLoading(value: boolean): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    _statusService: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this._statusService = new StatusService();
    }

    public get statusService() {
        return this._statusService;
    }

    public async postStatus(authToken: AuthToken, user: User, post: string) {
        var postingStatusToastId = "";
        try {
            await this.doFailureReportingOperation(async () => {
                this.view.setIsLoading(true);
                postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

                const status = new Status(post, user, Date.now());
                await this.statusService.postStatus(authToken, status);
                this.view.displayInfoMessage("Status posted!", 0);
                this.view.setPost("");
                this.view.setIsLoading(false);
            }, "post the status");
        } finally {
            this.view.deleteMessage(postingStatusToastId);
        }
    }
}
