import {PagedUserItemRequest, PagedUserItemResponse, UserDto} from "tweeter-shared"
import { Followservice } from "../../model/service/FollowService"
import { GetPagedItemsLambda } from "./GetPagedItemsLambda";

export class GetFolloweesLambda extends GetPagedItemsLambda{
    async loadMore(token: string, userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
        return await this.followService.loadMoreFollowees(token, userAlias, pageSize, lastItem);
    }
}

const handlerInstance = new GetFolloweesLambda();

export const handler = async (request: PagedUserItemRequest):Promise<PagedUserItemResponse> => {
    
    console.log("Incoming Request");
    console.log(request);
    return await handlerInstance.loadMoreItems(request);
}
    