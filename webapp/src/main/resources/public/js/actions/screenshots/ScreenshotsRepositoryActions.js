import $ from "jquery";
import alt from "../../alt";

class ScreenshotsRepositoryActions {

    getAllRepositories() {
        //TODO this is not good it must use the SDK'
        return (dispatch) => $.get(CONTEXT_PATH + "/api/repositories").then(response => {
           dispatch(response);
        });
    }
    
    changeSelectedRepositoryIds(newSelectedRepoIds) {
        return newSelectedRepoIds;
    }
}

export default alt.createActions(ScreenshotsRepositoryActions);
