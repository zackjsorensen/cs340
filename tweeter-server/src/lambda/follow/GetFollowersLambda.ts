import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService"
import { GetPagedItemsLambda } from "./GetPagedItemsLambda";


export class GetFollowersLambda extends GetPagedItemsLambda{
    async loadMore(token: string, userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
        return await this.followService.loadMoreFollowers(
            token,
            userAlias,
            pageSize,
            lastItem
        );
    }
}

const handlerInstance = new GetFollowersLambda();

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => handlerInstance.loadMoreItems(request);

// export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
//     const followService = new Followservice();
//     const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
//     return {
//         success: true,
//         message: null,
//         items: items,
//         hasMore: hasMore
//     }
// }