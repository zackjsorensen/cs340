import { StatusDto } from "tweeter-shared";

export interface FeedDAO{
    getFeed(userAlias: string): StatusDto[];
    putPost(authorAlias: string, statusDto: StatusDto, followerAlias: string): Promise<boolean>;
}