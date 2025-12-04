import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoFeedDAO } from "../../DAO/DynamoFeedDAO";
import { DynamoFollowsDAO } from "../../DAO/DynamoFollowsDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { AuthService } from "../../model/service/AuthService";


export abstract class LoadMoreItemsLambda{
    statusService = new StatusService(new DynamoFeedDAO(), new DynamoFollowsDAO(), new AuthService(new DynamoAuthDAO, new DynamoUserDAO));
        

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