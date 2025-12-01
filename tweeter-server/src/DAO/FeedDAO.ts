import { StatusDto } from "tweeter-shared";

export interface FeedDAO{
    getFeed(userAlias: string): Promise<[StatusDto[], boolean]>;
    putPost(authorAlias: string, statusDto: StatusDto, followerAlias: string): Promise<boolean>;
}