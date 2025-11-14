import { CountRequest, CountResponse, UserDto } from "tweeter-shared";
import { GetCountLambda } from "./GetCountLambda";

export class GetFollowersCountLambda extends GetCountLambda {
    async getItemCount(token: string, userAlias: string): Promise<number> {
        return await this.followService.getFollowerCount(token, userAlias);
    }
}

const handlerInstance = new GetFollowersCountLambda();

export const handler = async (request: CountRequest):Promise<CountResponse> => {
    return await handlerInstance.getCount(request.token, request.userAlias);
}