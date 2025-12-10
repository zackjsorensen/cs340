import { UserInfoRequest, TweeterResponse } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";
import { DynamoFollowsDAO } from "../../DAO/DynamoFollowsDAO";
import { DynamoFeedDAO } from "../../DAO/DynamoFeedDAO";
import { AuthService } from "../../model/service/AuthService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";

export abstract class ChangeFollowStateLambda{
    followService = new Followservice(new DynamoFollowsDAO(), new DynamoFeedDAO, new AuthService( new DynamoAuthDAO(), new DynamoUserDAO));
    abstract operation(token: string, userAlias: string): Promise<void>;

    public async changeFollowState(request: UserInfoRequest): Promise<TweeterResponse>{
        await this.operation(request.token, request.userAlias);
        return {
            success: true,
            message: null
        }
    }
}