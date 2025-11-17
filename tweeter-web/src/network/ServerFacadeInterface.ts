import {
    IsFollowerRequest,
    PagedStatusItemRequest,
    PagedUserItemRequest,
    Status,
    UserInfoRequest,
} from "tweeter-shared";
import { RegisterRequest } from "tweeter-shared";
import { PostStatusRequest } from "tweeter-shared";
import { TweeterRequest } from "tweeter-shared";
import { LoginRequest } from "tweeter-shared";
import { User } from "tweeter-shared";
import { AuthToken } from "tweeter-shared";

export abstract class ServerFacadeObject {
    abstract getFollowees(req: PagedUserItemRequest): Promise<[User[], boolean]>;

    abstract getFollowers(req: PagedUserItemRequest): Promise<[User[], boolean]>;

    abstract getIsFollowerStatus(req: IsFollowerRequest): Promise<boolean>;

    abstract getFolloweesCount(req: UserInfoRequest): Promise<number>;

    abstract getFollowersCount(req: UserInfoRequest): Promise<number>;

    abstract follow(req: UserInfoRequest): Promise<void>;

    abstract unfollow(req: UserInfoRequest): Promise<void>;

    abstract getUser(req: UserInfoRequest): Promise<User | null>;

    abstract login(req: LoginRequest): Promise<[User, AuthToken]>;

    abstract register(req: RegisterRequest): Promise<[User, AuthToken]>;

    abstract logout(req: TweeterRequest): Promise<void>;

    abstract loadMoreFeedItems(req: PagedStatusItemRequest): Promise<[Status[], boolean]>;

    abstract loadMoreStoryItems(req: PagedStatusItemRequest): Promise<[Status[], boolean]>;

    abstract postStatus(req: PostStatusRequest): Promise<void>;
}
