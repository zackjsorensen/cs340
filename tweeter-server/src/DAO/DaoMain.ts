import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoFollowsDAO } from "./DynamoFollowsDAO";
import {DynamoFeedDAO} from "./DynamoFeedDAO";
import { UserDto } from "tweeter-shared";
import { DynamoUserDAO } from "./DynamoUserDAO";

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

const bear: UserDto = {
    firstName: "Bear",
    lastName: "Bachmeier",
    alias: "@Bear",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Bear.jpeg"
};

const cody: UserDto = {
    firstName: "Cody",
    lastName: "Hagen",
    alias: "@CHagen",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Cody.jpeg"
};

const carson: UserDto = {
    firstName: "Carson",
    lastName: "Ryan",
    alias: "@CRyan",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Carson.jpeg"
};

const chase: UserDto = {
    firstName: "Chase",
    lastName: "Roberts",
    alias: "@cant_chase_me",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Chase.jpeg"
};

const evan: UserDto = {
    firstName: "Evan",
    lastName: "Johnson",
    alias: "@EJ",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Evan.jpeg"
};

const jack: UserDto = {
    firstName: "Jack",
    lastName: "Kelly",
    alias: "@JK_get_sacked",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Jack.jpeg"
};

const kalani: UserDto = {
    firstName: "Kalani",
    lastName: "Sitake",
    alias: "@Coach_Kilani",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Kalani.jpeg"
};

const kingston: UserDto = {
    firstName: "Parker",
    lastName: "Kingston",
    alias: "@speed_King",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Kingston.jpeg"
};

const lj: UserDto = {
    firstName: "LJ",
    lastName: "Martin",
    alias: "@BYU_Bruiser",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/LJ.jpeg"
};

const satuala: UserDto = {
    firstName: "Faletau",
    lastName: "Satuala",
    alias: "@Super_Satu",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/satuala.jpeg"
};

const wall: UserDto = {
    firstName: "Tanner",
    lastName: "Wall",
    alias: "@the_Great_Wall",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Wall.jpeg"
};

const will: UserDto = {
    firstName: "Will",
    lastName: "Ferrin",
    alias: "@Utah_butt_kicker",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Will.jpeg"
    //         https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Will.jpeg
};

const cougs = [zay, bear, cody, carson, chase, evan, jack, kalani, kingston, lj, satuala, wall, will];

async function testUsers(){
    const usersDao = new DynamoUserDAO();

    // console.log(await usersDao.putBatchOfUsers(cougs));

    console.log(await usersDao.getUser("@Utah_butt_kicker"));
}

testUsers();