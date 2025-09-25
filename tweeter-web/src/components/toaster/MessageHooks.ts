import { useContext } from "react";
import { ToastActionsContext, ToastListContext } from "./ToastContexts";
import { ToastType } from "./Toast";

interface MessageActions {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => string;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => string;
  deleteMessage: (messageId: string) => void;
  deleteAllMessages: () => void;
}

export const useMessageActions = (): MessageActions => {
  const { displayToast, deleteToast, deleteAllToasts } =
    useContext(ToastActionsContext);
  return {
    displayInfoMessage: (
      message: string,
      duration: number,
      bootstrapClasses?: string
    ) =>
      displayToast(
        ToastType.Info,
        message,
        duration,
        undefined,
        bootstrapClasses
      ),
    displayErrorMessage: (message: string, bootstrapClasses?: string) =>
      displayToast(ToastType.Error, message, 0, undefined, bootstrapClasses),
    deleteMessage: deleteToast,
    deleteAllMessages: deleteAllToasts,
  };
};

export const useMessageList = () => {
    return useContext(ToastListContext);   // making context available through a hook
}