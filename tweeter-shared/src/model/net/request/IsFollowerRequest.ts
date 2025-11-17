import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";


export interface IsFollowerRequest extends TweeterRequest{
    currentUser: UserDto,
    selectedUser: UserDto
}