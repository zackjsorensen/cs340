import "./PostStatus.css";
import { useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { PostStatusPresenter, PostStatusView } from "src/presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();
  const { currentUser, authToken } = useUserInfo(); // move this?????
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage
  }

  const presenterRef = new PostStatusPresenter(listener); // change later

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();

    var postingStatusToastId = "";

    try {
      setIsLoading(true); // move into Presenter?? No business logic involved...
      postingStatusToastId = displayInfoMessage(
        "Posting status...",
        0
      );

      presenterRef.postStatus(authToken!, currentUser!, post);
      // const status = new Status(post, currentUser!, Date.now());
      // await postStatus(authToken!, status);
      setPost("");
      // displayInfoMessage( "Status posted!", 2000);
    // } catch (error) {
    //   displayErrorMessage(
    //     `Failed to post the status because of exception: ${error}`
     // );
    } finally {
      deleteMessage(postingStatusToastId);
      setIsLoading(false);
    }
  };

// postStatus was here

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
