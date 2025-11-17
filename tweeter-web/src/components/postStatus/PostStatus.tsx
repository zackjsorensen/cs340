import "./PostStatus.css";
import { useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import {
  PostStatusPresenter,
  PostStatusView,
} from "src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";

interface Props {
  presenter?: PostStatusPresenter;
}


const PostStatus = (props: Props) => {
  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();
  const {currentUser, authToken} = useUserInfo();
  // const { authToken:defaultAuthToken } = useUserInfo(); // There's gotta be a better way to do this..
  // const authToken = props.authToken ? props.authToken : defaultAuthToken;
  // const {currentUser: defualtUser} = useUserInfo();
  // const currentUser = props.currentUser ? props.currentUser : defualtUser;
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    setPost: setPost,
    setIsLoading: setIsLoading
  };

  const presenterRef = props.presenter ? props.presenter : new PostStatusPresenter(listener); // change later

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    await presenterRef.postStatus(authToken!, currentUser!, post);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          aria-label= "postStatusButton"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          aria-label="clearStatusButton"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
