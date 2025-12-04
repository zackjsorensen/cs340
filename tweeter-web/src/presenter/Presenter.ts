export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}

export abstract class Presenter<v extends View> {
  private _view: v;

  public constructor(view: v) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error: any) {
      this._view.displayErrorMessage(
        `${error.message}`
      );
    }
  }
}
