import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";



export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const followService = new Followservice();
    const isFollower: boolean = await followService.getIsFollowerStatus(request.token, request.currentUser, request.selectedUser);
    return {
        success: true,
        message: null,
        isFollower: isFollower
    }
}