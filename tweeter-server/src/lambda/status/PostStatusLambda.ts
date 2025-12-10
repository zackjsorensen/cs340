import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoFeedDAO } from "../../DAO/DynamoFeedDAO";
import { DynamoFollowsDAO } from "../../DAO/DynamoFollowsDAO";
import { AuthService } from "../../model/service/AuthService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { SqsDAO } from "../../DAO/SqsDAO";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService(new DynamoFeedDAO(), new DynamoFollowsDAO(), new AuthService(new DynamoAuthDAO, new DynamoUserDAO), new SqsDAO());
    await statusService.postStatus(request.token, request.newStatusDto);
    return {
        success: true,
        message: null
    }
}