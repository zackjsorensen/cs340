import { anyNumber, anyString, anything, capture, instance, mock, spy, verify, when,} from "@typestrong/ts-mockito";
import { ClientCommunicator } from "src/network/ClientCommunicator";
import { ServerFacade } from "src/network/ServerFacade";
import { LoginRequest, RegisterRequest, tweeterApi } from "tweeter-shared";
import { AuthToken, Status, User } from "tweeter-shared";
import "isomorphic-fetch"
import { PagedUserItemRequest } from "tweeter-shared";
import { UserInfoRequest } from "tweeter-shared";
import { PostStatusPresenter } from "src/presenter/PostStatusPresenter";

describe("ServerFacade", () => {
    let communicatorSpy: ClientCommunicator;
    let serverFacade: ServerFacade;

    beforeEach(async () => {
        // communicatorSpy = spy (new ClientCommunicator(tweeterApi));
        // serverFacade = new ServerFacade(instance(communicatorSpy));
        communicatorSpy = new ClientCommunicator(tweeterApi);
        serverFacade = new ServerFacade();
        // postPresenterSpy = spy (new PostStatusPresenter())
    })


    it("calls the login endpoint and returns the result", async() => {
        const req: LoginRequest = {
            alias: "@Cosmo",
            password: "gocougs",
            token: ""
        }
        const [user, authToken] = await serverFacade.login(req);
        // verify(communicatorSpy.doPost(req, "/user/register")).once();
        expect(user).toBeInstanceOf(User);
        expect(authToken).toBeInstanceOf(AuthToken);
        expect(user.alias).toBeDefined();

        // call PostStatus on the presenter

    })
});

//     it("Gets more Followers from the server", async () => {
//         const req: PagedUserItemRequest = {
//             userAlias: "Jo",
//             token: "lkjsa;ldf",
//             pageSize: 15,
//             lastItem: null
//         };
//         const [items, hasMore] = await serverFacade.getFollowers(req);
//         expect(Array.isArray(items)).toBe(true);
//         expect(items.every(item => item instanceof User)).toBe(true);
//     }),

//     it("Gets the Follower Count from the Server", async() => {
//         const req: UserInfoRequest = {
//             token: "a;lkdsjf",
//             userAlias: "Joe"
//         };
//         let numFollowers: number = await serverFacade.getFollowersCount(req);
//         expect(typeof numFollowers).toBe("number");
//         expect(numFollowers).toBeGreaterThanOrEqual(0);
//     })
// })