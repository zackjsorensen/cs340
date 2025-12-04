import { tweeterApi } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { ServerFacadeObject } from "./ServerFacadeInterface";
import {
    AuthToken,
    PagedStatusItemRequest,
    Status,
    User,
    UserDto,
    UserInfoRequest,
} from "tweeter-shared";
import { PagedUserItemRequest } from "tweeter-shared";
import { PagedUserItemResponse } from "tweeter-shared";
import { CountResponse } from "tweeter-shared";
import { IsFollowerRequest } from "tweeter-shared";
import { IsFollowerResponse } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared";
import { TweeterRequest } from "tweeter-shared";
import { PagedStatusItemResponse } from "tweeter-shared";
import { StatusDto } from "tweeter-shared";
import { PostStatusRequest } from "tweeter-shared";
import { GetUserResponse } from "tweeter-shared";
import { LoginRequest } from "tweeter-shared";
import { StartSessionResponse } from "tweeter-shared";
import { RegisterRequest } from "tweeter-shared";

export class ServerFacade extends ServerFacadeObject {
    communicator: ClientCommunicator;
    public constructor(comm?: ClientCommunicator) {
        super();
        this.communicator = comm ? comm : new ClientCommunicator(tweeterApi);
    }

    async getFollowees(req: PagedUserItemRequest): Promise<[User[], boolean]> {
        return this.fetchAndReport(
            req,
            "/follow/get-followees",
            (res: PagedUserItemResponse) => {
                let users: User[] = [];
                if (res.items) {
                    users = res.items.map((item: UserDto) => User.fromDto(item)!);
                    return [users, res.hasMore];
                }
            }
        );
    }

    async getFollowers(req: PagedUserItemRequest): Promise<[User[], boolean]> {
        return this.fetchAndReport(
            req,
            "/follow/get-followers",
            (res: PagedUserItemResponse) => {
                let users: User[] = [];
                if (res.items) {
                    users = res.items.map((item: UserDto) => User.fromDto(item)!);
                    return [users, res.hasMore];
                }
            }
        );
    }

    async getFollowersCount(req: UserInfoRequest): Promise<number> {
        return await this.getCount(req, "/follow/get-followers-count");
    }

    async getFolloweesCount(req: UserInfoRequest): Promise<number> {
        return await this.getCount(req, "/follow/get-followees-count");
    }

    async getCount(req: UserInfoRequest, endpoint: string): Promise<number> {
        return this.fetchAndReport(req, `${endpoint}`, (res: CountResponse) => {
            return res.count;
        });
    }

    async getIsFollowerStatus(req: IsFollowerRequest): Promise<boolean> {
        return this.fetchAndReport(
            req,
            "/follow/get-is-follower-status",
            (response: IsFollowerResponse) => {
                return response.isFollower;
            }
        );
    }

    async follow(req: UserInfoRequest): Promise<void> {
        return this.fetchAndReport(
            req,
            "/follow/follow",
            async (response: TweeterResponse) => {
                return;
            }
        );
    }

    unfollow(req: UserInfoRequest): Promise<void> {
        return this.fetchAndReport(
            req,
            "/follow/unfollow",
            async (response: TweeterResponse) => {
                return;
            }
        );
    }

    async fetchAndReport<REQ extends TweeterRequest, RES extends TweeterResponse>(
        request: REQ,
        endpoint: string,
        parseResponse: (res: RES) => any
    ) {

            const response: RES = await this.communicator.doPost<REQ, RES>(request, endpoint);
            if (response.success) {
                return parseResponse(response);
            } else {
                throw new Error(`Received failure from ${endpoint}${JSON.stringify(response)}}`);
            }
        // } catch (error) {
        //     throw new Error(`Failed at ${endpoint} due to error: ${error}`);
        // }
    }

    async loadMoreStatusItems(
        req: PagedStatusItemRequest,
        endpoint: string
    ): Promise<[Status[], boolean]> {
        return await this.fetchAndReport(req, endpoint, (res: PagedStatusItemResponse) => {
            let statuses: Status[] = [];
            if (res.items) {
                statuses = res.items.map((item: StatusDto) => Status.fromDto(item)!);
                return [statuses, res.hasMore];
            }
        });
    }

    async loadMoreFeedItems(req: PagedStatusItemRequest): Promise<[Status[], boolean]> {
        return await this.loadMoreStatusItems(req, "/status/load-more-feed-items");
    }

    async loadMoreStoryItems(req: PagedStatusItemRequest): Promise<[Status[], boolean]> {
        return await this.loadMoreStatusItems(req, "/status/load-more-story-items");
    }

    async postStatus(req: PostStatusRequest): Promise<void> {
        return await this.fetchAndReport(
            req,
            "/status/post-status",
            (res: TweeterResponse) => {
                return res.success;
            }
        );
    }

    async getUser(req: UserInfoRequest): Promise<User | null> {
        return this.fetchAndReport(req, "/user/get-user", (res: GetUserResponse) => {
            return res.user ? User.fromDto(res.user) : null; // >>Q<< do we need an explicit error here?
        });
    }

    async login(req: LoginRequest): Promise<[User, AuthToken]> {
        return this.fetchAndReport(req, "/user/login", (res: StartSessionResponse) => {
            return [User.fromDto(res.user), AuthToken.fromDto(res.authToken)];
        });
    }

    async register(req: RegisterRequest): Promise<[User, AuthToken]> {
        return await this.fetchAndReport(
            req,
            "/user/register",
            (res: StartSessionResponse) => {
                return [User.fromDto(res.user), AuthToken.fromDto(res.authToken)];
            }
        );
    }

    async logout(req: TweeterRequest): Promise<void> {
        return await this.fetchAndReport(req, "/user/logout", (res: TweeterResponse) => {
            return res.success;
        });
    }
}
