import { UserDto, CountResponse } from "tweeter-shared";
import { Followservice } from "../../model/service/FollowService";

export abstract class GetCountLambda {
    followService = new Followservice();

    abstract getItemCount(token: string, userAlias: string): Promise<number>;

    public async getCount(token: string, userAlias: string): Promise<CountResponse> {
        const count = await this.getItemCount(token, userAlias);
        return {
            success: true,
            message: null,
            count: count,
        };
    }
}