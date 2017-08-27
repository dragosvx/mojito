import alt from "../../alt";
import ScreenshotsSearchTextActions from "../../actions/screenshots/ScreenshotsSearchTextActions";
import ScreenshotsPageActions from "../../actions/screenshots/ScreenshotsPageActions";
import SearchParamsStore from "../../stores/workbench/SearchParamsStore";
import {StatusCommonTypes} from "../../components/screenshots/StatusCommon";

class ScreenshotsSearchTextStore {

    constructor() {
        this.setDefaultState();
        this.bindActions(ScreenshotsSearchTextActions);
        this.bindActions(ScreenshotsPageActions);
    }

    setDefaultState() {
        this.searchAttribute = ScreenshotsSearchTextStore.SEARCH_ATTRIBUTES_SCREENSHOT;
        this.searchType = SearchParamsStore.SEARCH_TYPES.ILIKE;
        this.searchText = "";
        this.isSpinnerShown = false;
        this.status = StatusCommonTypes.ALL;
    }

    resetScreenshotSearchParams() {
        this.setDefault();
    }
    
    changeSearchAttribute(searchAttribute) {
        this.searchAttribute = searchAttribute;
    }

    changeSearchType(searchType) {
        this.searchType = searchType;
    }

    changeSearchText(searchText) {
        this.searchText = searchText;
    }

    changeStatus(status) {
        this.status = status;
    }

    performSearch() {
        this.isSpinnerShown = true;
    }

    screenshotsSearchResultsReceivedSuccess() {
        this.isSpinnerShown = false;
    }

    screenshotsSearchResultsReceivedError() {
        this.isSpinnerShown = false;
    }

}

ScreenshotsSearchTextStore.SEARCH_ATTRIBUTES_SCREENSHOT = "screenshot";

export default alt.createStore(ScreenshotsSearchTextStore, 'ScreenshotsSearchTextStore');
