import { StatusDto } from "tweeter-shared";

export interface StoryDAO{
    getStory(userAlias: string): Promise<[StatusDto[], boolean]>;
    putStory(userAlias: string, statusDto: StatusDto): Promise<boolean>;
}