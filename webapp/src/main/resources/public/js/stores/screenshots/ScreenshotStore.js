import alt from "../../alt";
import ScreenshotDataSource from "../../actions/screenshots/ScreenshotDataSource";
import ScreenshotActions from "../../actions/screenshots/ScreenshotActions";

class ScreenshotStore {

    constructor() {
        this.bindActions(ScreenshotActions);
        this.registerAsync(ScreenshotDataSource);
    } 

    changeStatus(data) {
        this.getInstance().changeStatus(data.status, data.comment, data.idx);
    }

    changeStatusSuccess(data) {
        console.log("ScreenshotStore::changeStatusSuccess", data.status, data.comment, data.idx);
    }

}

export default alt.createStore(ScreenshotStore, 'ScreenshotStore');
