import ScreenshotsPageActions from "./ScreenshotsPageActions";

import ScreenshotsRepositoryStore from "../../stores/screenshots/ScreenshotsRepositoryStore";
import ScreenshotsLocaleStore from "../../stores/screenshots/ScreenshotsLocaleStore";
import ScreenshotsSearchTextStore from "../../stores/screenshots/ScreenshotsSearchTextStore";
import ScreenshotsPaginatorStore from "../../stores/screenshots/ScreenshotsPaginatorStore";
import ScreenshotClient from "../../sdk/ScreenshotClient";
import {StatusCommonTypes} from "../../components/screenshots/StatusCommon";

const ScreenshotsDataSource = {
    performScreenshotSearch: {
        remote(state) {
            console.log("performScreenshotSearch");
            let screenshotsRepositoryStoreState = ScreenshotsRepositoryStore.getState();
            let screenshotsLocaleStoreState = ScreenshotsLocaleStore.getState();
            let screenshotsSearchTextStoreState = ScreenshotsSearchTextStore.getState();
            let screenshotsPaginatorStoreState = ScreenshotsPaginatorStore.getState();

            let promise;

            if (screenshotsRepositoryStoreState.selectedRepositoryIds.length === 0
                    || screenshotsLocaleStoreState.selectedBcp47Tags.length === 0) {
                
                promise = new Promise((resolve) => {
                    setTimeout(function () {
                        resolve([]);
                    }, 0);
                });
            } else {
                let params = {
                    repositoryIds: screenshotsRepositoryStoreState.selectedRepositoryIds,
                    bcp47Tags: screenshotsLocaleStoreState.selectedBcp47Tags,
                    screenshotName: screenshotsSearchTextStoreState.searchText,
                    status: screenshotsSearchTextStoreState.status === StatusCommonTypes.ALL ? null : screenshotsSearchTextStoreState.status,
                    limit: screenshotsPaginatorStoreState.limit,
                    offset: screenshotsPaginatorStoreState.limit * (screenshotsPaginatorStoreState.currentPageNumber - 1),
                };

                promise = ScreenshotClient.getScreenshots(params).then(function (results) {
                    return results;
                });
            }

            return promise;
        },
        success: ScreenshotsPageActions.screenshotsSearchResultsReceivedSuccess,
        error: ScreenshotsPageActions.screenshotsSearchResultsReceivedError
    },
};

export default ScreenshotsDataSource;
