import { StatusDto } from "tweeter-shared";

export interface PostMessage{
    feed_owner_handle: string,
    statusDto: StatusDto
}

export interface QueueDAO{
    sendMessage(key: number, feed_owner_handle: string, statusDto: StatusDto): Promise<boolean>;
    sendMessageBatch(key: number, messages: PostMessage[]): Promise<boolean>;
    // receiveMessageBatch(key: string): 
}

// what are we sending
/*
feed_owner_handle
statusDto
*/