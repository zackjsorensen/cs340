import { propTypes } from "react-bootstrap/esm/Image";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { ToastType } from "../toaster/Toast";
import { useContext } from "react";
import { ToastActionsContext } from "../toaster/ToastContexts";

interface Props {
  tooltip: string,
  oauthUpper: string,
  oauthLower: string
  
}

const OAuth = (props: Props) => {

    
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
    
      <button
        type="button"
        className="btn btn-link btn-floating mx-1"
        onClick={() =>
          displayInfoMessageWithDarkBackground(
            `${props.oauthUpper} registration is not implemented.`
          )
        }
      >
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={props.tooltip}>{`${props.oauthUpper}`}</Tooltip>}
        >
          <FontAwesomeIcon icon={["fab", props.oauthLower as import("@fortawesome/fontawesome-svg-core").IconName]} />
        </OverlayTrigger>
      </button>
    
  );
};

export default OAuth;
