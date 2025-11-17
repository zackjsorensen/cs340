import { UserInfoRequest, TweeterResponse } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";

export abstract class ChangeFollowStateLambda{
    followService = new Followservice();
    abstract operation(token: string, userAlias: string): void;

    public async changeFollowState(request: UserInfoRequest): Promise<TweeterResponse>{
        this.operation(request.token, request.userAlias);
        return {
            success: true,
            message: null
        }
    }
}