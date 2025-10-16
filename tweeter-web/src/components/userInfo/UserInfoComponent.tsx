import "./UserInfoComponent.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import {
  UserInfoPresenter,
  UserInfoView,
} from "src/presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  const view: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    setIsFollower: setIsFollower,
    setFolloweeCount: setFolloweeCount,
    setFollowerCount: setFollowerCount,
  };

  const presenter: UserInfoPresenter = new UserInfoPresenter(view);

  useEffect(() => {
    setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    setNumbFollowees(authToken!, displayedUser!);
    setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    await presenter.getIsFollowerStatus(authToken, currentUser, displayedUser);
  };

  const setNumbFollowees = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    await presenter.getFolloweeCount(authToken, displayedUser);
  };

  const setNumbFollowers = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    await presenter.getFollowerCount(authToken, displayedUser);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
    navigate(`${getBaseUrl()}/${currentUser!.alias}`);
  };

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    setIsLoading(true);
    await presenter.follow(authToken!, displayedUser!);
    setIsLoading(false);
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();
      setIsLoading(true);
      await presenter.unfollow(authToken!, displayedUser!);
      setIsLoading(false);
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={unfollowDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={followDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
