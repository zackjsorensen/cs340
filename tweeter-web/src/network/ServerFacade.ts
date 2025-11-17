import { tweeterApi } from "src/model.service/constants";
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
    communicator = new ClientCommunicator(tweeterApi);

    async getFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        let request: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem,
        };
        return this.fetchAndReport(
            request,
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

    async getFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        let request: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem,
        };

        return this.fetchAndReport(
            request,
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

    async getFollowersCount(authToken: AuthToken, user: User): Promise<number> {
        return await this.getCount(authToken, user, "/follow/get-followers-count");
    }

    async getFolloweesCount(authToken: AuthToken, user: User): Promise<number> {
        return await this.getCount(authToken, user, "/follow/get-followees-count");
    }

    async getCount(authToken: AuthToken, user: User, endpoint: string): Promise<number> {
        let request: UserInfoRequest = {
            token: authToken.token,
            userAlias: user.alias,
        };

        return this.fetchAndReport(request, `${endpoint}`, (res: CountResponse) => {
            return res.count;
        });
    }

    async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        let request: IsFollowerRequest = {
            token: authToken.token,
            currentUser: user.dto,
            selectedUser: selectedUser.dto,
        };
        return this.fetchAndReport(
            request,
            "/follow/get-is-follower-status",
            (response: IsFollowerResponse) => {
                return response.isFollower;
            }
        );
    }

    async follow(authToken: AuthToken, userToFollow: User): Promise<void> {
        const request: UserInfoRequest = {
            token: authToken.token,
            userAlias: userToFollow.alias,
        };
        return this.fetchAndReport(
            request,
            "/follow/follow",
            async (response: TweeterResponse) => {
                return;
            }
        );
    }

    unfollow(authToken: AuthToken, userToUnfollow: User): Promise<void> {
        const request: UserInfoRequest = {
            token: authToken.token,
            userAlias: userToUnfollow.alias,
        };
        return this.fetchAndReport(
            request,
            "/follow/unfollow",
            async (response: TweeterResponse) => {
                return;
            }
        );
    }

    async fetchAndReport<REQ extends TweeterRequest, RES extends TweeterResponse>(
        request: REQ,
        endpoint: string,
        parseResponse: Function
    ) {
        const response: RES = await this.communicator.doPost(
            request,
            `${tweeterApi}${endpoint}`
        );
        if (response.success) {
            return parseResponse(response);
        } else {
            throw new Error(`Received failure from ${endpoint}`);
        }
    }

    async loadMoreStatusItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null,
        endpoint: string
    ): Promise<[Status[], boolean]> {
        const request: PagedStatusItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        };

        return await this.fetchAndReport(
            request,
            endpoint,
            (res: PagedStatusItemResponse) => {
                let statuses: Status[] = [];
                if (res.items) {
                    statuses = res.items.map((item: StatusDto) => Status.fromDto(item)!);
                    return [statuses, res.hasMore];
                }
            }
        );
    }

    async loadMoreFeedItems(authToken: AuthToken, userAlias: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
        return await this.loadMoreStatusItems(authToken, userAlias, pageSize, lastItem, "/status/load-more-feed-items");
    }

    async loadMoreStoryItems(authToken: AuthToken, userAlias: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
        return await this.loadMoreStatusItems(authToken, userAlias, pageSize, lastItem, "/status/load-more-story-items");
    }

    async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
        const req: PostStatusRequest = {
            token: authToken.token,
            newStatusDto: newStatus.dto
        };

        return await this.fetchAndReport(req, "/status/post-status", (res: TweeterResponse) => {
            return res.success;
        })
    }

    async getUser(authToken: AuthToken, userAlias: string): Promise<User | null> {
        const req: UserInfoRequest = {
            token: authToken.token,
            userAlias: userAlias
        };
        return this.fetchAndReport(req, "/user/get-user", (res: GetUserResponse) => {
            return res.user? res.user : null; // >>Q<< do we need an explicit error here?
        })
    }

    async login(userAlias: string, password: string): Promise<[User, AuthToken]> {
        const req: LoginRequest = {
            alias: userAlias, 
            password: password, 
            token: ""
        };
        return this.fetchAndReport(req, "/user/login", (res: StartSessionResponse) => {
            return [User.fromDto(res.user), AuthToken.fromDto(res.authToken)];
        });
    }

    async register(firstName: string, lastName: string, userAlias: string, password: string, userImageBytes: Uint8Array, imageFileExtension: string): Promise<[User, AuthToken]> {
        const req: RegisterRequest = {
            firstName: firstName,
            lastName: lastName,
            alias: userAlias,
            password: password,
            userImageBytes: userImageBytes,
            imageFileExtension: imageFileExtension,
            token: ""
        };
        return await this.fetchAndReport(req, "/user/register", (res: StartSessionResponse) => {
            return [User.fromDto(res.user), AuthToken.fromDto(res.authToken)];
        });
    }

    async logout(authToken: AuthToken): Promise<void> {
        const req: TweeterRequest = {
            token: authToken.token
        };
        return await this.fetchAndReport(req, "/user/logout", (res: TweeterResponse) => {
            return res.success;
        })
    }

}
