import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoFeedDAO } from "../../DAO/DynamoFeedDAO";
import { DynamoFollowsDAO } from "../../DAO/DynamoFollowsDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { AuthService } from "../../model/service/AuthService";



export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const followService = new Followservice(new DynamoFollowsDAO(), new DynamoFeedDAO, new AuthService( new DynamoAuthDAO(), new DynamoUserDAO));
    const isFollower: boolean = await followService.getIsFollowerStatus(request.token, request.currentUser, request.selectedUser);
    return {
        success: true,
        message: null,
        isFollower: isFollower
    }
}