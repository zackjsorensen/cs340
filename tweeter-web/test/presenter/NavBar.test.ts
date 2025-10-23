import { NavbarPresenter, NavBarView } from "../../src/presenter/NavbarPresenter";
import { anyString, anything, capture, instance, mock, spy, verify, when,} from "@typestrong/ts-mockito";
import { UserService } from "src/model.service/UserService";
import { AuthToken } from "tweeter-shared";

describe("NavBarPresenter", () => {
    let mockNavBarPresenterView: NavBarView;
    let navBarPresenter: NavbarPresenter;
    let mockService: UserService;
    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        /* will be run once before each test */
        mockNavBarPresenterView = mock<NavBarView>(); /* var to config the mock settings */
        const mockNavBarPresenterViewInstance = instance(mockNavBarPresenterView); /* make an instance to use */
        when(mockNavBarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");
        const navBarPresenterSpy = spy(new NavbarPresenter(mockNavBarPresenterViewInstance));
        navBarPresenter = instance(navBarPresenterSpy);
        mockService = mock<UserService>();
        when(navBarPresenterSpy.service).thenReturn(instance(mockService));
        // use mocks/spies when stubbing, verifying
        // use real thing everywhere else
    });
    it("tells the view to dispay a logging out message", async () => {
        /* strings should describe what is being tested */
        await navBarPresenter.logout(authToken);
        verify(mockNavBarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await navBarPresenter.logout(authToken);
        verify(mockService.logout(authToken)).once();

        // how to capture params - though not actually needed here
        // let [capturedAuthToken] = capture(mockService.logout).last();
        // expect(capturedAuthToken).toEqual(authToken);
    });

    it("tells the view to clear the info message that was displayed previously, clears the user info, and navigates to the login page whenb succesful", async () => {
        await navBarPresenter.logout(authToken);

        verify(mockNavBarPresenterView.deleteMessage("messageId123")).once();
        verify(mockNavBarPresenterView.clearUserInfo()).once();
        verify(mockNavBarPresenterView.navigateToLogin()).once();
        verify(mockNavBarPresenterView.displayErrorMessage(anything())).never();
    });

    it("tells the view to display an error message and does not tell it to clear the info message, clera the user info or navigate to the login page when unsuccesful", async () => {
        let error = new Error("An error occurred");
        when(mockService.logout(anything())).thenThrow(error);
        await navBarPresenter.logout(authToken);

        // capture param to see what's up -- debugging, not part of the actual test
        // let [errorString] = capture(mockNavBarPresenterView.displayErrorMessage).last();
        // console.log(errorString);
        verify(
            mockNavBarPresenterView.displayErrorMessage(
                `Failed to log user out because of exception: ${error}`
            )
        ).once();
        verify(mockNavBarPresenterView.clearUserInfo()).never();
        verify(mockNavBarPresenterView.navigateToLogin()).never();
    });
});
