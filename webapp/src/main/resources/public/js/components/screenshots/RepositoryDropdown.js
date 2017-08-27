import PropTypes from 'prop-types';
import React from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import {DropdownButton, MenuItem} from "react-bootstrap";

let RepositoryDropDown = React.createClass({

    /**
     * Currently there is no way to prevent the dropdown to close on select
     * unless using a trick based on this attribute.
     *
     * Action that shouldn't close the dropdown can set this attribute to 'true'
     * This will prevent onDropdownToggle to actually close the dropdown.
     * Subsequent calls to onDropdownToggle will behave normally.
     */
    forceDropdownOpen: false,

    propTypes: {
        /** @type {Repository[]} */
        "repositories": PropTypes.array.isRequired,
        "selectedRepositoryIds": PropTypes.array.isRequired,
        "onSelectedRepositoryIdsChanged": PropTypes.func.isRequired,
    },

    /**
     *
     */
    getInitialState: function () {
        return {
            /** @type boolean */
            "isDropdownOpenned": false
        };
    },

    /**
     * Get list of repositories (with selected state) sorted by their display name
     *
     * @return {{id: number, name: string, selected: boolean}[]}}
     */
    getSortedRepositories() {
        return this.props.repositories
                .map((repository) => {
                    return {
                        "id": repository.id,
                        "name": repository.name,
                        "selected": this.props.selectedRepositoryIds.indexOf(repository.id) > -1
                    }
                }).sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * On dropdown selected event, add or remove the target repository from the
     * selected repository list base on its previous state (selected or not).
     *
     * @param repository the repository that was selected
     */
    onRepositorySelected(repository) {

        this.forceDropdownOpen = true;

        let id = repository.id;

        let newSelectedRepoIds = this.props.selectedRepositoryIds.slice();

        if (repository.selected) {
            _.pull(newSelectedRepoIds, id);
        } else {
            newSelectedRepoIds.push(id);
        }

        this.callonSelectedRepositoryIdsChanged(newSelectedRepoIds);
    },

    /**
     * Trigger the searchParamsChanged action for a given list of selected
     * repository ids.
     *
     * @param newSelectedRepoIds
     */
    callonSelectedRepositoryIdsChanged(newSelectedRepoIds) {
        this.props.onSelectedRepositoryIdsChanged(newSelectedRepoIds);
    },

    /**
     * Gets the text to display on the button.
     *
     * if 1 repository selected the named is shown, else the number of selected repositories is displayed (with proper i18n support)
     *
     * @returns {string} text to display on the button
     */
    getButtonText() {

        let label = '';

        let numberOfSelectedRepositories = this.props.selectedRepositoryIds.length;

        if (numberOfSelectedRepositories === 1) {
            let repoId = this.props.selectedRepositoryIds[0];
            let repo = this.getRepositoryById(repoId);
            // NOTE repo is null before the list of repositories are returned.  But this is not big deal b'c
            // when repositories returns, the state is updated, and this component re-renders.
            label = repo ? repo.name : "";
        } else {
            label = this.props.intl.formatMessage({"id": "search.repository.btn.text"}, {"numberOfSelectedRepositories": numberOfSelectedRepositories});
        }

        return label;
    },

    /**
     * Gets a repository by id from the state.
     *
     * @param repoId the repository id
     */
    getRepositoryById(repoId) {
        return _.find(this.props.repositories, {"id": repoId});
    },

    /**
     * Gets the list of repository ids from the state.
     *
     * @returns {number[]}
     */
    getRepositoryIdsFromState() {
        return this.props.repositories.map(repository => repository.id);
    },

    /**
     * Here we handle the logic to keep the dropdown open because it is not
     * supported by default react-bootstrap component.
     *
     * "forceDropdownOpen" can be set in any function that wants to prevent the
     * the dropdown to close.
     *
     * @param newOpenState
     */
    onDropdownToggle(newOpenState){

        if (this.forceDropdownOpen) {
            this.forceDropdownOpen = false;
            this.setState({"isDropdownOpenned": true});
        } else {
            this.setState({"isDropdownOpenned": newOpenState});
        }
    },

    /**
     * Selects all locales.
     */
    onSelectAll() {
        this.forceDropdownOpen = true;
        this.callonSelectedRepositoryIdsChanged(this.getRepositoryIdsFromState());
    },

    /**
     * Clear all selected locales.
     */
    onSelectNone() {
        this.forceDropdownOpen = true;
        this.callonSelectedRepositoryIdsChanged([]);
    },

    /**
     * Indicates if the select all menu item should be active.
     *
     * @returns {boolean}
     */
    isAllActive() {
        return this.props.selectedRepositoryIds.length > 0 && this.props.selectedRepositoryIds.length === this.getRepositoryIdsFromState().length;
    },

    /**
     * Indicates if the clear all menu item should be active.
     *
     * @returns {boolean}
     */
    isNoneActive() {
        return this.props.selectedRepositoryIds.length === 0;
    },

    /**
     * Renders the locale menu item list.
     *
     * @returns {XML}
     */
    renderRepositories() {
        return this.getSortedRepositories().map(
                (repository) =>
                        <MenuItem key={repository.name} eventKey={repository} active={repository.selected} onSelect={this.onRepositorySelected}>{repository.name}</MenuItem>
        );
    },

    /**
     * @return {JSX}
     */
    render() {
        return (
                <span className="mlm repository-dropdown">
                <DropdownButton id="repositoryDropdown" title={this.getButtonText()} onToggle={this.onDropdownToggle} open={this.state.isDropdownOpenned}>
                    <MenuItem key="search.repository.selectAll" active={this.isAllActive()} onSelect={this.onSelectAll}><FormattedMessage id="search.repository.selectAll"/></MenuItem>
                    <MenuItem key="search.repository.selectNone" active={this.isNoneActive()} onSelect={this.onSelectNone}><FormattedMessage id="search.repository.selectNone"/></MenuItem>
                    <MenuItem divider/>
                    {this.renderRepositories()}
                </DropdownButton>
                </span>
        );
    }

});

export default injectIntl(RepositoryDropDown);
