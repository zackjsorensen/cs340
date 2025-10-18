import { AuthToken, User } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { Followservice } from "src/model.service/FollowService";

export abstract class UserItemPresenter extends PagedItemPresenter<User, Followservice> {
    protected serviceFactory(): Followservice {
        return new Followservice();
    }
  
}
