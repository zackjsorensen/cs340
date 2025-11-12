import {PagedUserItemRequest, PagedUserItemResponse, UserDto} from "tweeter-shared"
import { Followservice } from "../../model/service/FollowService"
import { GetPagedItemsLambda } from "./GetPagedItemsLambda";

export class GetFolloweesLambda extends GetPagedItemsLambda{
    async loadMore(token: string, userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
        return await this.followService.loadMoreFollowees(token, userAlias, pageSize, lastItem);
    }
}

const handlerInstance = new GetFolloweesLambda();

export const handler = async (request: PagedUserItemRequest):Promise<PagedUserItemResponse> => handlerInstance.loadMoreItems(request);

// export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
//     // this is the function that will be called by API gateway when we make a request to get more followees
//     const followService = new Followservice();
//     const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

//     return {
//         success: true,
//         message: null,
//         items: items,
//         hasMore: hasMore
    // }