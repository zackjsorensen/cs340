import { CountResponse, CountRequest, UserDto } from "tweeter-shared";
import { GetCountLambda } from "./GetCountLambda";

export class GetFolloweeCountLambda extends GetCountLambda{
    async getItemCount(token: string, userAlias: string): Promise<number> {
        return await this.followService.getFolloweeCount(token, userAlias);
    }
}

const handlerInstance = new GetFolloweeCountLambda();

export const handler = async (request: CountRequest): Promise<CountResponse> => {
    return await handlerInstance.getCount(request.token, request.userAlias);
}


