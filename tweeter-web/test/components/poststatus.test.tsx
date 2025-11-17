import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "src/components/postStatus/PostStatus";
import { AuthToken, User } from "tweeter-shared";
import "@testing-library/jest-dom";
import { useUserInfo } from "src/components/userInfo/UserInfoHooks";
import { PostStatusPresenter } from "src/presenter/PostStatusPresenter";
import { anything, capture, instance, mock, verify } from "@typestrong/ts-mockito";


const myAuthToken: AuthToken = new AuthToken("abc123", 0);
const myUser: User = new User("jo", "bo", "jobo", "h/kj.c");

jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
    ...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
    __esModule: true,
    useUserInfo: jest.fn(),
}));

describe("Post Status Component", () => {
    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: new User("jo", "bo", "jobo", "h/kj.c"),
            authToken: new AuthToken("abc123", 0),
        });
    });

    it("starts with Post Status and Clear buttons disabled", async () => {
        const { postStatusButton, clearStatusButton } = await renderPostStatusAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    });

    it("enables the Post Status and Clear buttons when the field has text", async () => {
        const { user, statusField, postStatusButton, clearStatusButton } =
            await renderPostStatusAndGetElements();
        await user.type(statusField, "A wise man once said");
        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();
    });

    it("disables both buttons when the text field is cleared", async () => {
        const { user, statusField, postStatusButton, clearStatusButton } =
            await renderPostStatusAndGetElements();
        await user.type(statusField, "A wise man once said");
        await user.clear(statusField);
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    });

    it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async() => {
        const myPost: string = "A wise man once said";
        const mockPresenter: PostStatusPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const { user, statusField, postStatusButton, clearStatusButton } =
            await renderPostStatusAndGetElements(mockPresenterInstance);
        await user.type(statusField, myPost);
        await user.click(postStatusButton);
        verify(mockPresenter.postStatus(anything(), anything(), anything())).once();
        const capturedParams = capture(mockPresenter.postStatus).last();
        expect(capturedParams[0]).toStrictEqual(myAuthToken);
        expect(capturedParams[1]).toStrictEqual(myUser);

        expect(capturedParams[2]).toBe(myPost);
    })
});

function renderPostStatus(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            <PostStatus presenter={presenter}/>
        </MemoryRouter>
    );
}

async function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
    const user = userEvent.setup();

    renderPostStatus(presenter);
    const postStatusButton = screen.getByRole("button", { name: "postStatusButton" });
    const clearStatusButton = screen.getByRole("button", { name: "clearStatusButton" });
    const statusField = screen.getByPlaceholderText("What's on your mind?");
    return { user, statusField, postStatusButton, clearStatusButton };
}
