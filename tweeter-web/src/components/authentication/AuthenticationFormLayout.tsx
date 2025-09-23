import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useContext } from "react";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { ToastType } from "../toaster/Toast";

interface Props {
  headingText: string;
  submitButtonLabel: string;
  oAuthHeading: string;
  inputFieldFactory: () => JSX.Element;
  switchAuthenticationMethodFactory: () => JSX.Element;
  setRememberMe: (value: boolean) => void;
  submitButtonDisabled: () => boolean;
  isLoading: boolean;
  submit: () => void;
}

const AuthenticationFormLayout = (props: Props) => {
  const { displayToast } = useContext(ToastActionsContext);

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayToast(
      ToastType.Info,
      message,
      3000,
      undefined,
      "text-white bg-primary"
    );
  };

  return (
    <div className="center">
      <div className="form-main w-100 m-auto rounded">
        <form>
          <img
            className="mb-4"
            src="/bird-logo-64.png"
            alt=""
            width="72"
            height="72"
          />
          <h1 className="h3 mb-3 fw-normal">{props.headingText}</h1>

          {props.inputFieldFactory()}

          <h1 className="h4 mb-3 fw-normal">Or</h1>
          <h1 className="h5 mb-3 fw-normal">{props.oAuthHeading}</h1>

          <div className="text-center mb-3">
            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  "Google registration is not implemented."
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="googleTooltip">Google</Tooltip>}
              >
                <FontAwesomeIcon icon={["fab", "google"]} />
              </OverlayTrigger>
            </button>

            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  "Facebook registration is not implemented."
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="facebookTooltip">Facebook</Tooltip>}
              >
                <FontAwesomeIcon icon={["fab", "facebook"]} />
              </OverlayTrigger>
            </button>

            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  "Twitter registration is not implemented."
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="twitterTooltip">Twitter</Tooltip>}
              >
                <FontAwesomeIcon icon={["fab", "twitter"]} />
              </OverlayTrigger>
            </button>

            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  "LinkedIn registration is not implemented."
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="linkedInTooltip">LinkedIn</Tooltip>}
              >
                <FontAwesomeIcon icon={["fab", "linkedin"]} />
              </OverlayTrigger>
            </button>

            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  "Github registration is not implemented."
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="githubTooltip">GitHub</Tooltip>}
              >
                <FontAwesomeIcon icon={["fab", "github"]} />
              </OverlayTrigger>
            </button>
          </div>

          <div className="checkbox mb-3">
            <label>
              <input
                type="checkbox"
                value="remember-me"
                onChange={(event) => props.setRememberMe(event.target.checked)}
              />{" "}
              Remember me
            </label>
          </div>

          {props.switchAuthenticationMethodFactory()}

          <button
            id="submitButton"
            className="w-100 btn btn-lg btn-primary"
            type="button"
            disabled={props.submitButtonDisabled()}
            onClick={() => props.submit()}
          >
            {props.isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>{props.submitButtonLabel}</div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthenticationFormLayout;
