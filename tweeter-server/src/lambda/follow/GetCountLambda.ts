import { UserDto, CountResponse } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoFeedDAO } from "../../DAO/DynamoFeedDAO";
import { DynamoFollowsDAO } from "../../DAO/DynamoFollowsDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { AuthService } from "../../model/service/AuthService";

export abstract class GetCountLambda {
        followService = new Followservice(new DynamoFollowsDAO(), new DynamoFeedDAO, new AuthService( new DynamoAuthDAO(), new DynamoUserDAO));

    abstract getItemCount(token: string, userAlias: string): Promise<number>;

    public async getCount(token: string, userAlias: string): Promise<CountResponse> {
        const count = await this.getItemCount(token, userAlias);
        return {
            success: true,
            message: null,
            count: count,
        };
    }
}