import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoFollowsDAO } from "./DynamoFollowsDAO";
import {DynamoFeedDAO} from "./DynamoFeedDAO";
import { UserDto } from "tweeter-shared";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { FollowsDto } from "tweeter-shared";

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

    console.log(`Get Page... ${JSON.stringify(await followsDao.getPageOfFollowees("Joe", 5, undefined))}`);

}

async function testFeed(){
    const feedDao = new DynamoFeedDAO();

}


const zay: UserDto = {
    firstName: "Isaiah",
    lastName: "Glasker",
    alias: "@zay",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Zay.jpg"
};



async function testUsers(){
    const usersDao = new DynamoUserDAO();

    // console.log(await usersDao.putBatchOfUsers(cougs));

    console.log(await usersDao.getUser("@Utah_butt_kicker"));
}

async function populateFollowers(){
    const followsDAO = new DynamoFollowsDAO();

    console.log("Testing");

    console.log(await followsDAO.addFollower("@zay", "@Cosmo"));
    console.log(await followsDAO.addFollower("@Bear", "@Cosmo"));
    console.log(await followsDAO.addFollower("@Cosmo", "@CHagen"));
    console.log(await followsDAO.addFollower("@Cosmo", "@JK_get_sacked"));
    console.log(await followsDAO.addFollower("@Cosmo", "@CRyan"));
    console.log(await followsDAO.addFollower("@Cosmo", "@the_Great_Wall"));
    console.log(await followsDAO.addFollower("@Cosmo", "@Super_Satu"));
    console.log(await followsDAO.addFollower("@Cosmo", "@EJ"));
    console.log(await followsDAO.addFollower("@Cosmo", "@Coach_Kilani"));
    console.log(await followsDAO.addFollower("@Cosmo", "@cant_chase_me"));
    console.log(await followsDAO.addFollower("@Cosmo", "@speed_King"));

}

async function createUsers(userAliasBase: string, userToFollow: string){ // create test users and make them all follow Cosmo
    const userDAO = new DynamoUserDAO();
    const followDAO = new DynamoFollowsDAO();

    let userDtos: UserDto[] = [];
    let followsDtos: FollowsDto[] = [];

    for (let i = 10070; i < 10200; i++){
        let nextUser: UserDto = {
            firstName: `${userAliasBase}_${i}`,
            lastName: `${i}`,
            alias: `@${userAliasBase}_fan_${i}`,
            imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/users/%40test"
        };
        userDtos.push(nextUser);

        let nextFollow: FollowsDto = {
            follower_handle: `@${userAliasBase}_fan_${i}`,
            followee_handle: `${userToFollow}`
        };
        followsDtos.push(nextFollow);

        if (userDtos.length == 25 ){
            await userDAO.putBatchOfUsers(userDtos);
            userDtos = [];
            await followDAO.putBatchOfFollowers(followsDtos);
            followsDtos = [];
        }
    }
}

createUsers("byu_bb", "@RW3");