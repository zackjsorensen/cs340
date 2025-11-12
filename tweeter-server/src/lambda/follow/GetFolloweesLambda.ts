import {PagedUserItemRequest, PagedUserItemResponse} from "tweeter-shared"
import { Followservice } from "../../model/service/FollowService"

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    // this is the function that will be called by API gateway when we make a request to get more followees
    const followService = new Followservice();
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}