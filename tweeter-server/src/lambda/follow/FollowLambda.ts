import { UserInfoRequest, TweeterResponse } from "tweeter-shared";
import { ChangeFollowStateLambda } from "./ChangeFollowStateLambda";

export class FollowStateLambda extends ChangeFollowStateLambda{
    async operation(token: string, userAlias: string): Promise<void> {
        console.log("In operation that calls follow from Lambda...\n");
        const res = await this.followService.follow(token, userAlias)
        console.log(`After calling follow from Lambda....with result ${res}\n`);
    }
}

const handlerInstance = new FollowStateLambda();

export const handler = async (request: UserInfoRequest): Promise<TweeterResponse> => {
    console.log(`FollowLambda received this: ${JSON.stringify(request)}\n`);
    return await handlerInstance.changeFollowState(request);
}

// new idea: Just pass in a function as a parameter
// that should be cleaner