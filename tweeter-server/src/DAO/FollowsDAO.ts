import { UserDto } from "tweeter-shared";

export interface FollowsDAO{
    getFollower(followeeAlias: string, followerAlias: string): Promise<boolean>;
    removeFollower(followeeAlias: string, followerAlias: string): Promise<boolean>;
    addFollower(followeeAlias: string, followerAlias: string): Promise<boolean>;
    getFollowerCount(userAlias: string): Promise<number>;
    getFolloweeCount(userAlias: string): Promise<number>;
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[UserDto[], boolean]>;
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[UserDto[], boolean]>;
}