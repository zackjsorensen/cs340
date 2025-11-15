import { CountRequest, TweeterResponse } from "tweeter-shared";
import { ChangeFollowStateLambda } from "./ChangeFollowStateLambda";


export class UnfollowLambda extends ChangeFollowStateLambda{
    async operation(token: string, userAlias: string): Promise<void> {
        await this.followService.unfollow(token, userAlias)
    }
}

const handlerInstance = new UnfollowLambda();

export const handler = async (request: CountRequest): Promise<TweeterResponse> => {
    return await handlerInstance.changeFollowState(request);
}