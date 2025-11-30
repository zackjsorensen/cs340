import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest{
    firstName: string,
    lastName: string,
    userImageBytes: number[],
    imageFileExtension: string
}