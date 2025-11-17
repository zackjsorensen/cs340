import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { tweeterApi } from "./constants";
import { PagedUserItemResponse } from "tweeter-shared";
import { PagedUserItemRequest } from "tweeter-shared";
import ItemScroller from "src/components/mainLayout/ItemScroller";

export class Followservice extends Service {

    protected async loadMore(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null,
        apiExt: string
    ): Promise<[User[], boolean]> {
        const fullApiPath: string = `${tweeterApi}${apiExt}`;
        const response = await fetch(fullApiPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${authToken.token}`,   /* is this necessary?? */
            },
            body: JSON.stringify({
                token: authToken.token,
                userAlias: userAlias,
                pageSize: pageSize,
                lastItem: lastItem,
            }),
        });

        const data: PagedUserItemResponse = await response.json();
        let users: User[] = [];
        if (data.items) {
            users = data.items.map((item: UserDto) => User.fromDto(item)!); // hopefully ! doesn't cause a bug...
        }
        return [users, data.hasMore];
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return await this.loadMore(
            authToken,
            userAlias,
            pageSize,
            lastItem,
            "/follow/get-followees"
        );
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return await this.loadMore(authToken, userAlias, pageSize, lastItem, "/follow/get-followers")
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    }

    public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(user.alias);
    }

    public async follow(authToken: AuthToken, userToFollow: User) {
        return await new Promise((f) => setTimeout(f, 2000));
    }

    public async unfollow(authToken: AuthToken, userToUnfollow: User) {
        return await new Promise((f) => setTimeout(f, 2000));
    }
}
