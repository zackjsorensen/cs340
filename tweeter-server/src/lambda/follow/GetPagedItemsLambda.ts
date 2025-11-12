import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";

export abstract class GetPagedItemsLambda {
    followService: Followservice = new Followservice();

    abstract loadMore(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]>;

    async loadMoreItems(request: PagedUserItemRequest): Promise<PagedUserItemResponse> {
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
