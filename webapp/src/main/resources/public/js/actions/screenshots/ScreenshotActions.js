import alt from "../../alt";

class ScreenshotActions {

    constructor() {
        console.log("ScreenshotActions::constructor");
        this.generateActions( 
            "changeStatus",
            "changeStatusSuccess",
            "changeStatusError"
        );
    }
}

export default alt.createActions(ScreenshotActions);
