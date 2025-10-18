import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthFields";
import { useMessageActions } from "src/components/toaster/MessageHooks";
import { useUserInfoActions } from "src/components/userInfo/UserInfoHooks";
import { LoginPresenter, LoginRequest } from "src/presenter/LoginPresenter";
import { AuthToken, User } from "tweeter-shared";
import { AuthView } from "src/presenter/AuthPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const view: AuthView = {
    displayErrorMessage: displayErrorMessage,
    authenticated: (user: User, authToken: AuthToken) => {
      updateUserInfo(user, user, authToken, rememberMe);
    },
    navigate: navigate
  }
  const presenter: LoginPresenter = new LoginPresenter(view);

  const doLogin = async () => {
    try {
      setIsLoading(true);
      const data: LoginRequest = {
        alias,
        password,
        originalUrl: props.originalUrl
      }
      await presenter.doAuthentication(data);
    } finally {
      setIsLoading(false);
    }
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          onEnter={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
