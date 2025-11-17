import { ServerFacade } from "src/network/ServerFacade";
import { ServerFacadeObject } from "src/network/ServerFacadeInterface";

export class Service {
    protected server: ServerFacadeObject = new ServerFacade();
}