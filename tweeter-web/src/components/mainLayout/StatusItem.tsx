import { Link } from "react-router-dom";
import Post from "../statusItem/Post";
import { Status } from "tweeter-shared";
import { useUserNavigation } from "../UserNavigationHook";

interface Props {
  page: string;
  item: Status;
}

const StatusItem = (props: Props) => {

  const navigateToUser = useUserNavigation();

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.item.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.item.user.firstName} {props.item.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`/${props.page}/${props.item.user.alias}`}
                onClick={navigateToUser}
              >
                {props.item.user.alias}
              </Link>
            </h2>
            {props.item.formattedDate}
            <br />
            <Post status={props.item} featurePath={`/${props.page}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
