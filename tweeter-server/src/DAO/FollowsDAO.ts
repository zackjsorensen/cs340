export interface FollowsDAO{
    getFollower(followeeAlias: string, followerAlias: string): any; // TODO: Change from any
    removeFollower(followeeAlias: string, followerAlias: string): any;
    addFollower(followeeAlias: string, followerAlias: string): any;
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<any>;
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<any>;
}