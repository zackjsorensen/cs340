import { anyNumber, anyString, anything, capture, instance, mock, spy, verify, when,} from "@typestrong/ts-mockito";
import { StatusService } from "src/model.service/StatusService";
import { PostStatusPresenter, PostStatusView } from "src/presenter/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";

describe("PostStatusPresenter", ()=> {
    let mockView: PostStatusView;
    let mockService: StatusService;
    let presenterSpy: PostStatusPresenter;
    let presenterInstance: PostStatusPresenter;
    const authToken: AuthToken = new AuthToken("abc123", Date.now());
    const user: User = new User("Steph", "Curry", "@goat_shooter", "fakeURL");
    const dummyPost = "dummy post!";

    beforeEach(() => {
        mockView = mock<PostStatusView>();
        mockService = mock<StatusService>();
        when(mockView.displayInfoMessage(anything(), 0)).thenReturn("messageId");
        const mockViewInstance = instance(mockView);
        presenterSpy = spy(new PostStatusPresenter(instance(mockView)));
        when(presenterSpy.statusService).thenReturn(instance(mockService));
        presenterInstance = instance(presenterSpy);

    });

    it("tells the view to display a posting status message", async()=> {
        // presenter.postStatus(auth, user, post);
        // verify view.displayInfo was called
        await presenterInstance.postStatus(authToken, user, dummyPost);
        verify(mockView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async()=> {
        await presenterInstance.postStatus(authToken, user, dummyPost);
        verify(mockService.postStatus(anything(), anything())).once();
    });

    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
        await presenterInstance.postStatus(authToken, user, dummyPost);
        verify(mockView.deleteMessage("messageId")).once();
        verify(mockView.setPost("")).once();
        verify(mockView.displayInfoMessage("Status posted!", 0)).once();
    });

    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message on failure", async() => {
        const error: Error = new Error("Error occurred");
        when(mockService.postStatus(anything(), anything())).thenThrow(error);
        await presenterInstance.postStatus(authToken, user, dummyPost);
        verify(mockView.deleteMessage("messageId")).once();
        verify(mockView.displayErrorMessage(`Failed to post the status because of exception: ${error}`)).once();
        verify(mockView.setPost(anything())).never();
        verify(mockView.displayInfoMessage("Status posted!", anyNumber())).never();
    })
})