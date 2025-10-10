// import { UserService } from "src/model.service/UserService";
// import { User } from "tweeter-shared";


export class LoginView{
  dummy: string = "Dummy";
}

// export class LoginPresenter {
//     private userService: UserService;

//     public constructor(){
//         this.userService = new UserService();
//     }


//   public async doLogin(alias: string, password: string) {

//     const [user, authToken] = await this.userService.login(alias, password);

//     updateUserInfo(user, user, authToken, rememberMe);

//     if (!!props.originalUrl) {
//       navigate(props.originalUrl);
//     } else {
//       navigate(`/feed/${user.alias}`);
//     }
//   }
//   catch(error) {
//     displayErrorMessage(`Failed to log user in because of exception: ${error}`);
//   }
// }
