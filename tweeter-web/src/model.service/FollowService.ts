import {
    AuthToken,
    User,
    FakeData,
    UserDto,
    IsFollowerRequest,
    UserInfoRequest,
} from "tweeter-shared";
import { ClientService } from "./Service";
import { tweeterApi } from "./constants";
import { PagedUserItemResponse } from "tweeter-shared";
import { PagedUserItemRequest } from "tweeter-shared";
import ItemScroller from "src/components/mainLayout/ItemScroller";

export class Followservice extends ClientService {
    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        const req: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem,
        };
        return this.server.getFollowees(req);
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        const req: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem,
        };
        return this.server.getFollowers(req);
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        let req: IsFollowerRequest = {
            token: authToken.token,
            currentUser: user.dto,
            selectedUser: selectedUser.dto,
        };
        return this.server.getIsFollowerStatus(req);
    }

    public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
        const req: UserInfoRequest = {
            token: authToken.token,
            userAlias: user.alias,
        };
        return await this.server.getFolloweesCount(req);
    }

    public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
        const req: UserInfoRequest = {
            token: authToken.token,
            userAlias: user.alias,
        };
        return await this.server.getFollowersCount(req);
    }

    public async follow(authToken: AuthToken, userToFollow: User) {
        const req: UserInfoRequest = {
            token: authToken.token,
            userAlias: userToFollow.alias,
        };
        return await this.server.follow(req);
    }

    public async unfollow(authToken: AuthToken, userToUnfollow: User) {
        const req: UserInfoRequest = {
            token: authToken.token,
            userAlias: userToUnfollow.alias,
        };
        return await this.server.unfollow(req);
    }
}
