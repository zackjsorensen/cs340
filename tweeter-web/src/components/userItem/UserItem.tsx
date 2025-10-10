import { Link, useNavigate } from "react-router-dom";
import { AuthToken, User} from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { IndividualUserItemPresenter } from "src/presenter/IndividualUserItemPresenter";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const navigate = useNavigate();

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    const presenter: IndividualUserItemPresenter = new IndividualUserItemPresenter();

    try {
      const toUser = await presenter.getUser(authToken!, event.target.toString());

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${props.featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  };

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${props.featurePath}/${props.user.alias}`}
                onClick={navigateToUser}
              >
                {props.user.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
