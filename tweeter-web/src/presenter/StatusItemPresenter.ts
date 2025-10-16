import { StatusService } from "src/model.service/StatusService";
import { Status } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export const PAGE_SIZE = 10;

export abstract class StatusItemPresenter extends PagedItemPresenter<Status> {
  protected page_size = PAGE_SIZE;
  protected statusService: StatusService = new StatusService();

}
