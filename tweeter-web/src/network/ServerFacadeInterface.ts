import { Status } from "tweeter-shared";
import { User } from "tweeter-shared";
import { AuthToken } from "tweeter-shared";


export abstract class ServerFacadeObject{
    abstract getFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]>

    abstract getFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]>

    abstract getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean>

    abstract getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<number>

    abstract getFollowersCount(
        authToken: AuthToken,
        user: User
    ): Promise<number>

    abstract follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<void>

    abstract unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<void>

    abstract getUser(
        authToken: AuthToken,
        userAlias: string
    ): Promise< User | null>

    abstract login(
        userAlias: string,
        password: string
    ): Promise<[User, AuthToken]>

    abstract register(
        firstName: string,
        lastName: string,
        userAlias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]>

    abstract logout(
        authToken: AuthToken
    ): Promise<void>

    abstract loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]>

    abstract loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]>

  abstract postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void>;
}