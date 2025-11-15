import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";


export abstract class LoadMoreItemsLambda{
    statusService = new StatusService();

    abstract operation(request: PagedStatusItemRequest): Promise<[StatusDto[] | null, boolean]>;

    public async handleRequest(request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> {
        const [dtos, hasMore] = await this.operation(request);
        return {
            success: true,
            message: null,
            items: dtos,
            hasMore: hasMore
        }
    }
}