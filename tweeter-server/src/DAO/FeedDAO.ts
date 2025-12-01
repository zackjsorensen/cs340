import { StatusDto } from "tweeter-shared";

export interface StatusDAO{
    getFeedPage(userAlias: string, pageSize: number, lastItem: StatusDto): Promise<[StatusDto[], boolean]>;
    getStoriesPage(userAlias: string, pageSize: number, lastItem: StatusDto | undefined): Promise<[StatusDto[], boolean]>;
    putPost(authorAlias: string, statusDto: StatusDto, destAlias: string): Promise<boolean>;
    putStory(userAlias: string, statusDto: StatusDto): Promise<boolean>;
}