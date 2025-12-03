import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoFollowsDAO } from "./DynamoFollowsDAO";

async function main(){
    const followsDao = new DynamoFollowsDAO();

    try {
        console.log(`Adding follower... ${await followsDao.addFollower("@Billy", "@Joel")}`);
    } catch(error){
        console.log(error);
    }

    console.log(`Getting follower... ${await followsDao.getFollowerCount("@Billy")}`);

    console.log(` ${await followsDao.getFolloweeCount("@Joel")}`);

    console.log(`Get Follower: ${await followsDao.getFollower("@Billy", "@Joel")}`);

}

main();