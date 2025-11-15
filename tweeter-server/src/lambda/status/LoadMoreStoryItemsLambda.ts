import { PagedStatusItemRequest, StatusDto, PagedStatusItemResponse } from "tweeter-shared";
import { LoadMoreItemsLambda } from "./LoadMoreItemsLambda";

export class LoadMoreStoryItemsLambda extends LoadMoreItemsLambda{
    async operation(request: PagedStatusItemRequest): Promise<[StatusDto[] | null, boolean]> {
        return await this.statusService.loadMoreStoryItems(
            request.token,
            request.userAlias,
            request.pageSize,
            request.lastItem
        )
    }
}

const handlerInstance = new LoadMoreStoryItemsLambda();

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    return handlerInstance.handleRequest(request);
}