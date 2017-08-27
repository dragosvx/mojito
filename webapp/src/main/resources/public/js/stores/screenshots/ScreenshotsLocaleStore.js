import alt from "../../alt";
import ScreenshotsRepositoryActions from "../../actions/screenshots/ScreenshotsRepositoryActions";
import ScreenshotsPageActions from "../../actions/screenshots/ScreenshotsPageActions";
import ScreenshotsLocaleActions from "../../actions/screenshots/ScreenshotsLocaleActions";
import RepositoryLocale from "../../sdk/entity/RepositoryLocale";
import ScreenshotsRepositoryStore from "./ScreenshotsRepositoryStore";

class ScreenshotsLocaleStore {

    constructor() {       
        this.setDefaultState();        
        this.bindActions(ScreenshotsRepositoryActions);
        this.bindActions(ScreenshotsPageActions);
        this.bindActions(ScreenshotsLocaleActions);
    }
    
    setDefaultState() {
        this.bcp47Tags = [];
        this.fullyTranslatedBcp47Tags = [];
        this.selectedBcp47Tags = [];
        this.isDisabled = true;
    }
    
    resetScreenshotSearchParams() {
        this.setDefault();
    }
        
    getAllRepositories() {
        this.waitFor(ScreenshotsRepositoryStore);
        let selectedRepositoryIds = ScreenshotsRepositoryStore.getState().selectedRepositoryIds;
        this.bcp47Tags = this.getSortedBcp47TagsFromStore(selectedRepositoryIds);
        this.fullyTranslatedBcp47Tags = this.getSortedFullyTranslatedBcp47TagsFromStore(selectedRepositoryIds);
    }
    
    
    changeSelectedRepositoryIds(selectedRepositoryIds) {
        this.waitFor(ScreenshotsRepositoryStore);     
        this.bcp47Tags = this.getSortedBcp47TagsFromStore(selectedRepositoryIds);
        this.fullyTranslatedBcp47Tags = this.getSortedFullyTranslatedBcp47TagsFromStore(selectedRepositoryIds);
        
        if (selectedRepositoryIds.length === 0) {
            this.selectedBcp47Tags = [];
        }
    }
    
    changeSelectedBcp47Tags(selectedBcp47Tags) {
        this.selectedBcp47Tags = selectedBcp47Tags.slice().sort();
    }

    /**
     * Gets sorted bcp47tags from stores.
     *
     * Sort is important to ensure later array comparison in the component will
     * work as expected.
     *
     * @returns {string[]}
     */
    getSortedBcp47TagsFromStore(selectedRepositoryIds) {
        return ScreenshotsRepositoryStore.getAllBcp47TagsForRepositoryIds(selectedRepositoryIds).sort();
    }

    /**
     * Gets sorted fully translated bcp47tags from stores.
     *
     * Sort is important to ensure later array comparison in the component will
     * work as expected.
     *
     * @returns {string[]}
     */
    getSortedFullyTranslatedBcp47TagsFromStore(selectedRepositoryIds) {
        return ScreenshotsRepositoryStore.getAllBcp47TagsForRepositoryIds(selectedRepositoryIds, true).sort();
    }
}

export default alt.createStore(ScreenshotsLocaleStore, 'ScreenshotsLocaleStore');
