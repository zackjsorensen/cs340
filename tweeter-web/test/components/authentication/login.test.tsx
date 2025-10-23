import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "src/components/authentication/login/Login";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter, LoginRequest } from "src/presenter/LoginPresenter";
import { anything, capture, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Componenet", () => {
    it("starts with sign in button disabled", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    });

    it("enables the sign in button if both alias and password fields have text", async () => {
        const { user, signInButton, aliasField, passwordField } =
            await getElementsAndFillFields();
        expect(signInButton).toBeEnabled();
    });

    it("disables the sign in button if either alias or password field is cleared", async () => {
        const { user, signInButton, aliasField, passwordField } =
            await getElementsAndFillFields();
        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();
        await user.type(aliasField, "Yoda");
        expect(signInButton).toBeEnabled();
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
        const req: LoginRequest = {
            alias: "abc",
            password: "abc123",
            originalUrl: "htpps://heck2theyes.org",
        };
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements(req.originalUrl!, mockPresenterInstance);
        await user.type(aliasField, req.alias);
        await user.type(passwordField, req.password);
        await user.click(signInButton);
        const [capturedRequest] = capture(mockPresenter.doAuthentication).last();
        expect(capturedRequest.alias).toBe(req.alias);
        expect(capturedRequest.password).toBe(req.password);
        expect(capturedRequest.originalUrl).toBe(req.originalUrl);
        verify(mockPresenter.doAuthentication(anything())).once();
    });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    /* Memory router subs in tests for Browser router */
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter} />
            ) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
}

function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter); /* render our component */

    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { user, signInButton, aliasField, passwordField };
}

async function getElementsAndFillFields() {
    const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");
    await user.type(aliasField, "Oogway");
    await user.type(passwordField, "Ascends");
    return { user, signInButton, aliasField, passwordField };
}
