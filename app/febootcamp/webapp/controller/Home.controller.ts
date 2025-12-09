import Controller from "sap/ui/core/mvc/Controller";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace febootcamp.controller
 */
export default class Home extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onButtonPress(): void {
        MessageBox.show(
		"This button is working, yey!", {
			title: "Message Box",
			actions: [MessageBox.Action.YES, MessageBox.Action.NO],
			emphasizedAction: MessageBox.Action.YES,
			onClose: function (oAction) { / * do something * / }
		}
	);
    }
}