import { AuthToken, Status, FakeData, PagedStatusItemRequest, PostStatusRequest } from "tweeter-shared";
import { ClientService } from "./Service";

export class StatusService extends ClientService {
    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const req: PagedStatusItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        };
        return await this.server.loadMoreFeedItems(req);
    }

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const req: PagedStatusItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        };
        return await this.server.loadMoreStoryItems(req);
    }

    public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
        const req: PostStatusRequest = {
            token: authToken.token,
            newStatusDto: newStatus.dto,
        };
        return await this.server.postStatus(req);
    }
}
