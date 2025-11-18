import { anyNumber, anyString, anything, capture, instance, mock, spy, verify, when,} from "@typestrong/ts-mockito";
import { tweeterApi } from "src/model.service/constants";
import { ClientCommunicator } from "src/network/ClientCommunicator";
import { ServerFacade } from "src/network/ServerFacade";
import { RegisterRequest } from "tweeter-shared";
import { AuthToken, Status, User } from "tweeter-shared";
import "isomorphic-fetch"
import { PagedUserItemRequest } from "tweeter-shared";
import { UserInfoRequest } from "tweeter-shared";

describe("ServerFacade", () => {
    let communicatorSpy: ClientCommunicator;
    let serverFacade: ServerFacade;

    beforeEach(async () => {
        // communicatorSpy = spy (new ClientCommunicator(tweeterApi));
        // serverFacade = new ServerFacade(instance(communicatorSpy));
        communicatorSpy = new ClientCommunicator(tweeterApi);
        serverFacade = new ServerFacade();
    })


    it("calls the register endpoint and returns the result", async() => {
        const req: RegisterRequest = {
            firstName: "Lebron",
            lastName: "James",
            userImageBytes: Array.from(new Uint8Array([1, 2, 3, 4])),
            imageFileExtension: ".ext",
            alias: "LBJ23",
            password: "asdfasdfasdf",
            token: ""
        }
        const [user, authToken] = await serverFacade.register(req);
        // verify(communicatorSpy.doPost(req, "/user/register")).once();
        expect(user).toBeInstanceOf(User);
        expect(authToken).toBeInstanceOf(AuthToken);
        expect(user.alias).toBeDefined();
    }),

    it("Gets more Followers from the server", async () => {
        const req: PagedUserItemRequest = {
            userAlias: "Jo",
            token: "lkjsa;ldf",
            pageSize: 15,
            lastItem: null
        };
        const [items, hasMore] = await serverFacade.getFollowers(req);
        expect(Array.isArray(items)).toBe(true);
        expect(items.every(item => item instanceof User)).toBe(true);
    }),

    it("Gets the Follower Count from the Server", async() => {
        const req: UserInfoRequest = {
            token: "a;lkdsjf",
            userAlias: "Joe"
        };
        let numFollowers: number = await serverFacade.getFollowersCount(req);
        expect(typeof numFollowers).toBe("number");
        expect(numFollowers).toBeGreaterThanOrEqual(0);
    })
})