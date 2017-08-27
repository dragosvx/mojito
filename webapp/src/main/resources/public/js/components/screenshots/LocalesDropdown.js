import $ from "jquery";
import _ from "lodash";
import PropTypes from 'prop-types';
import React from "react";
import {FormattedMessage, injectIntl} from 'react-intl';
import {DropdownButton, MenuItem} from "react-bootstrap";
import Locales from "../../utils/Locales";

let LocalesDropDown = React.createClass({

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
            "bcp47Tags": PropTypes.array.isRequired,
            "fullyTranslatedBcp47Tags": PropTypes.array.isRequired,
            "selectedBcp47Tags": PropTypes.array.isRequired,
            "onSelectedBcp47TagsChanged": PropTypes.func.isRequired
        },

    /**
     *
     * @return {{bcp47Tags: string[], fullyTranslatedBcp47Tags: string[], selectedBcp47Tags: string[], isDropdownOpenned: boolean}}
     */
    getInitialState() {
        return {
            "isDropdownOpenned": false
        };
    },

    /**
     * Get list of locales (with selected state) sorted by their display name
     *
     * @return {{bcp47Tag: string, displayName: string, selected: boolean}[]}}
     */
    getSortedLocales() {
        let locales = this.props.bcp47Tags
                .map((bcp47Tag) => {
                    return {
                        "bcp47Tag": bcp47Tag,
                        "displayName": Locales.getDisplayName(bcp47Tag),
                        "selected": this.props.selectedBcp47Tags.indexOf(bcp47Tag) > -1
                    }
                }).sort((a, b) => a.displayName.localeCompare(b.displayName));

        return locales;
    },

    /**
     * On dropdown selected event, add or remove the target locale from the
     * selected locale list base on its previous state (selected or not).
     *
     * @param locale the locale that was selected
     */
    onLocaleSelected(locale) {

        this.forceDropdownOpen = true;

        let bcp47Tag = locale.bcp47Tag;

        let newSelectedBcp47Tags = this.props.selectedBcp47Tags.slice();

        if (locale.selected) {
            _.pull(newSelectedBcp47Tags, bcp47Tag);
        } else {
            newSelectedBcp47Tags.push(bcp47Tag);
        }

        this.callOnSelectedBcp47TagsChanged(newSelectedBcp47Tags);
    },

    /**
     * Trigger the searchParamsChanged action for a given list of selected
     * bcp47 tags.
     *
     * @param newSelectedBcp47Tags
     */
    callOnSelectedBcp47TagsChanged(newSelectedBcp47Tags) {
        this.props.onSelectedBcp47TagsChanged(newSelectedBcp47Tags);
    },

    /**
     * Gets the text to display on the button.
     *
     * if 1 locale selected the named is shown, else the number of selected locale is displayed (with proper i18n support)
     *
     * @returns {string} text to display on the button
     */
    getButtonText() {

        let label = '';

        let numberOfSelectedLocales = this.props.selectedBcp47Tags.length;

        if (numberOfSelectedLocales === 1) {
            label = Locales.getDisplayName(this.props.selectedBcp47Tags[0]);
        } else {
            label = this.props.intl.formatMessage({id: "search.locale.btn.text"}, {'numberOfSelectedLocales': numberOfSelectedLocales});
        }

        return label;
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
     * Selects fully translated locales.
     */
    onSelectToBeFullyTranslated() {
        this.forceDropdownOpen = true;
        this.callOnSelectedBcp47TagsChanged(this.props.fullyTranslatedBcp47Tags.slice());
    },

    /**
     * Selects all locales.
     */
    onSelectAll() {
        this.forceDropdownOpen = true;
        this.callOnSelectedBcp47TagsChanged(this.props.bcp47Tags.slice());
    },

    /**
     * Clear all selected locales.
     */
    onSelectNone() {
        this.forceDropdownOpen = true;
        this.callOnSelectedBcp47TagsChanged([]);
    },

    /**
     * Indicates if the select to be fully translated menu item should be active.
     *
     * @returns {boolean}
     */
    isToBeFullyTranslatedActive() {
        return this.props.selectedBcp47Tags.length > 0 && _.isEqual(this.props.selectedBcp47Tags, this.props.fullyTranslatedBcp47Tags);
    },


    /**
     * Indicates if the select all menu item should be active.
     *
     * @returns {boolean}
     */
    isAllActive() {
        return this.props.selectedBcp47Tags.length > 0 && this.props.selectedBcp47Tags.length === this.props.bcp47Tags.length;
    },

    /**
     * Indicates if the clear all menu item should be active.
     *
     * @returns {boolean}
     */
    isNoneActive() {
        return this.props.selectedBcp47Tags.length === 0;
    },


    /**
     * Renders the locale menu item list.
     *
     * @returns {XML}
     */
    renderLocales() {
        return this.getSortedLocales().map(
                (locale) =>
                        <MenuItem key={locale.displayName} eventKey={locale} active={locale.selected} onSelect={this.onLocaleSelected}>{locale.displayName}</MenuItem>
        );
    },

    /**
     * @return {JSX}
     */
    render() {
        return (
                <span className="mlm locale-dropdown">
                <DropdownButton 
                        id="localesDropdown" 
                        title={this.getButtonText()} 
                        onToggle={this.onDropdownToggle} 
                        open={this.state.isDropdownOpenned}
                        disabled={this.props.bcp47Tags.length === 0}>
                    <MenuItem key="1" active={this.isToBeFullyTranslatedActive()} onSelect={this.onSelectToBeFullyTranslated}><FormattedMessage id="search.locale.selectToBeFullyTranslated"/></MenuItem>
                    <MenuItem key="2" active={this.isAllActive()} onSelect={this.onSelectAll}><FormattedMessage id="search.locale.selectAll"/></MenuItem>
                    <MenuItem key="3" active={this.isNoneActive()} onSelect={this.onSelectNone}><FormattedMessage id="search.locale.selectNone"/></MenuItem>
                    <MenuItem divider/>
                    {this.renderLocales()}
                </DropdownButton>
                </span>
        );

    }
});

export default injectIntl(LocalesDropDown);
