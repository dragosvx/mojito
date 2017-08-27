import $ from "jquery";
import alt from "../../alt";

class ScreenshotsLocaleActions {

    constructor() {
        this.generateActions(
            "changeSelectedBcp47Tags"
        );
    }
}

export default alt.createActions(ScreenshotsLocaleActions);
