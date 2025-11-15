import { CountRequest, TweeterResponse } from "tweeter-shared";
import { ChangeFollowStateLambda } from "./ChangeFollowStateLambda";

export class FollowStateLambda extends ChangeFollowStateLambda{
    async operation(token: string, userAlias: string): Promise<void> {
        await this.followService.follow(token, userAlias)
    }
}

const handlerInstance = new FollowStateLambda();

export const handler = async (request: CountRequest): Promise<TweeterResponse> => {
    return await handlerInstance.changeFollowState(request);
}

// new idea: Just pass in a function as a parameter
// that should be cleaner