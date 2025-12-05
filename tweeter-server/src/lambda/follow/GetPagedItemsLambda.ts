import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoFeedDAO } from "../../DAO/DynamoFeedDAO";
import { DynamoFollowsDAO } from "../../DAO/DynamoFollowsDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { AuthService } from "../../model/service/AuthService";

export abstract class GetPagedItemsLambda {
    followService: Followservice = new Followservice(new DynamoFollowsDAO(), new DynamoFeedDAO, new AuthService( new DynamoAuthDAO(), new DynamoUserDAO));

    abstract loadMore(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]>;

    async loadMoreItems(request: PagedUserItemRequest): Promise<PagedUserItemResponse> {
        console.log(`GET_PAGED_ITEM_LAMBDA recieved this value for lastItem: ${JSON.stringify(request.lastItem)}\n`);
        const [items, hasMore] = await this.loadMore(
            request.token,
            request.userAlias,
            request.pageSize,
            request.lastItem
        );

        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore,
        };
    }
}
