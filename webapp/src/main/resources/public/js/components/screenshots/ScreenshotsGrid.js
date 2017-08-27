import $ from "jquery";
import _ from "lodash";
import PropTypes from 'prop-types';
import React from "react";
import {FormattedMessage, injectIntl} from 'react-intl';
import {Label} from "react-bootstrap";
import ReactSidebarResponsive from "../misc/ReactSidebarResponsive";

import Screenshot from "./Screenshot";
import ScreenshotsTextUnit from "./ScreenshotsTextUnit";


let ScreenshotsGrid = React.createClass({

    propTypes: {
        "screenshotsData": PropTypes.array.isRequired,
        "selectedScreenshotIdx": PropTypes.number,
        "onScreenshotsTextUnitTargetClick": PropTypes.func.isRequired,
        "onScreenshotsTextUnitNameClick": PropTypes.func.isRequired,
        "onScreenshotClicked": PropTypes.func.isRequired,
        "onLocaleClick": PropTypes.func.isRequired,
        "onNameClick": PropTypes.func.isRequired,
        "onStatusGlyphClick": PropTypes.func.isRequired,
        "onStatusChanged": PropTypes.func.isRequired
    },

    getSelectedScreenshot: function () {
        let selectedScreenshot = null;

        if (this.props.screenshotsData.length > 0 && this.props.selectedScreenshotIdx < this.props.screenshotsData.length) {
            selectedScreenshot = this.props.screenshotsData[this.props.selectedScreenshotIdx];
        }

        return selectedScreenshot;
    },

    getTextUnitsForSelectedScreenshot: function () {

        let textUnitsRendered = [];
        let selectedScreenshot = this.getSelectedScreenshot();

        if (selectedScreenshot && selectedScreenshot.textUnits) {
            textUnitsRendered = _.sortBy(selectedScreenshot.textUnits,'id');
         }

        return textUnitsRendered;
    },

    renderSideBar() {

        return (<div>
            {
                        this.getTextUnitsForSelectedScreenshot().map(textUnit => {

                            let locale = this.getSelectedScreenshot().locale.bcp47Tag;

                            return <ScreenshotsTextUnit 
                                key={textUnit.id}
                                textUnit={textUnit} 
                                onNameClick={(e) => this.props.onScreenshotsTextUnitNameClick(e, textUnit, locale)}
                                onTargetClick={(e) => this.props.onScreenshotsTextUnitTargetClick(e, textUnit, locale)}
                                />
            })
            }
        </div>);
    },

    renderScreenshots() {
        return this.props.screenshotsData.map((screenshot, idx) =>
            <Screenshot
                key={screenshot.name + '_' + idx}
                screenshot={screenshot} 
                isSelected={idx === this.props.selectedScreenshotIdx} 
                onClick={() => this.props.onScreenshotClicked(idx)}
                onLocaleClick={ () => this.props.onLocaleClick([screenshot.locale.bcp47Tag])}
                onNameClick={() => this.props.onNameClick(screenshot.name)}
                onStatusGlyphClick={() => this.props.onStatusGlyphClick(idx)}
                onStatusChanged={(status) => this.props.onStatusChanged({status: status, idx: idx})}
                />)
        },

        renderNoResults() {

            let divStyle = {clear: 'both'};

            return (
                    <div style={divStyle} className="empty-search-container text-center center-block">
                        <FormattedMessage id="search.result.empty"/>
                        <img className="empty-search-container-img" src={require('../../../img/magnifying-glass.svg')} />
                    </div>
                    );
        },

        renderWithResults() {

            console.log("ScreenshotsGrid::renderWithResults");
            return (
                    <div>
                        <ReactSidebarResponsive 
                            ref="sideBarScreenshot" 
                            sidebar={this.renderSideBar()}
                            rootClassName="side-bar-root-container-screenshot"
                            sidebarClassName="side-bar-container-screenshot"
                            contentClassName="side-bar-main-content-container-screenshot"
                            docked={true} pullRight={true} transitions={false}>
                    
                            {this.renderScreenshots()}
                    
                        </ReactSidebarResponsive>
                    </div>);
        },

        /**
         * @return {JSX}
         */
        render() {
            return this.props.screenshotsData.length > 0 ?
                    this.renderWithResults() :
                    this.renderNoResults();
        }

    });

    export default injectIntl(ScreenshotsGrid);
