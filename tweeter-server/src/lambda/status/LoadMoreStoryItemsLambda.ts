import { PagedStatusItemRequest, StatusDto, PagedStatusItemResponse } from "tweeter-shared";
import { LoadMoreItemsLambda } from "./LoadMoreItemsLambda";

export class LoadMoreStoryItemsLambda extends LoadMoreItemsLambda{
    async operation(request: PagedStatusItemRequest): Promise<[StatusDto[] | null, boolean]> {
        const [storyItems, hasMore] =  await this.statusService.loadMoreStoryItems(
            request.token,
            request.userAlias,
            request.pageSize,
            request.lastItem
        );
        console.log(`LoadMoreStoryItemsLAMBDA: got and forwarded this first post: ${JSON.stringify(storyItems[0])}`);
        return [storyItems, hasMore];
    }
}

const handlerInstance = new LoadMoreStoryItemsLambda();

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    return handlerInstance.handleRequest(request);
}