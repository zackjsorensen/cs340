import { PagedStatusItemRequest, StatusDto, PagedStatusItemResponse } from "tweeter-shared";
import { LoadMoreItemsLambda } from "./LoadMoreItemsLambda";

export class LoadMoreFeedItemsLambda extends LoadMoreItemsLambda{
    async operation(request: PagedStatusItemRequest): Promise<[StatusDto[] | null, boolean]> {
        return await this.statusService.loadMoreFeedItems(
            request.token,
            request.userAlias,
            request.pageSize,
            request.lastItem
        )
    }
}

const handlerInstance = new LoadMoreFeedItemsLambda();

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    return handlerInstance.handleRequest(request);
}