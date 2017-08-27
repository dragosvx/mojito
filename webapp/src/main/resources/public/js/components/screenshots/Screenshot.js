import $ from "jquery";
import _ from "lodash";
import PropTypes from 'prop-types';
import React, {Image} from "react";
import {FormattedMessage, injectIntl} from 'react-intl';
import {Label} from "react-bootstrap";
import ReactDOM from "react-dom";
import keycode from "keycode";
import StatusGlyph from "./StatusGlyph";
import {StatusCommonTypes} from "./StatusCommon";


let Screenshot = React.createClass({

    propTypes: {
        "screenshot": PropTypes.object.isRequired,
        "onClick": PropTypes.func.isRequired,
        "isSelected": PropTypes.bool.isRequired,
        "onLocaleClick": PropTypes.func.isRequired,
        "onNameClick": PropTypes.func.isRequired,
        "onStatusChanged": PropTypes.func.isRequired,
        "onStatusGlyphClick": PropTypes.func.isRequired,
    },

    componentDidMount() {
        this.scrollIntoScreenshotIfSelected();
    },

    componentDidUpdate() {
        this.scrollIntoScreenshotIfSelected();
    },

    onLocaleClick(e) {
        e.stopPropagation();
        this.props.onLocaleClick();
    },

    onNameClick(e) {
        e.stopPropagation();
        this.props.onNameClick();
    },

    onKeyUp(e) {
        e.stopPropagation();
        switch (keycode(e)) {
            case "a":
                this.props.onStatusChanged(StatusCommonTypes.ACCEPTED);
                break;
            case "r":
                this.props.onStatusChanged(StatusCommonTypes.NEEDS_REVIEW);
                break;
            case "x":
                this.props.onStatusChanged(StatusCommonTypes.REJECTED);
                break;
        }
    },

    scrollIntoScreenshotIfSelected() {
        if (this.props.isSelected) {
            ReactDOM.findDOMNode(this.refs.screenshot).focus();
            this.refs.screenshot.scrollIntoView();
        }
    },

    /**
     * @return {JSX}
     */
    render() {
        const divStyle = {
            float: "left",
            width: "300px",
            minHeight: "200px",
            paddingTop: "3px",
            paddingBottom: "3px",
//            paddingRight: "5px",
//            paddingLeft: "5px",
            margin: "5px",
            borderRadius: "5px",
            border: "1px solid #559745",
            outline: "none"
        };

        const divStyleDescription = {
//            "background-color": "rgba(85,151,69,0.1)", 
//            "background-color": "#eef4ec", 
            backgroundColor: "#fff",
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginBottom: "4px",
            display: "inline-block"
        };

        const divStyleGlyph = {
//            color: "#559745",
            float: "right",
        };

        if (this.props.isSelected) {
//            divStyle["border-top-color"] = "#559745";
//            divStyle["border-top-width"] = "5px";
            //           divStyle["background-color"] = "rgba(85,151,69,0.1)";
//           divStyle["background-color"] = "#559745";
//   divStyle["background-color"] = "#eef4ec";
            divStyle["boxShadow"] = "3px 3px 3px #559745";
        }

        return (
                <div 
                    ref="screenshot" 
                    style={divStyle}
                    onClick={this.props.onClick}
                    tabIndex={0}
                    onKeyUp={this.onKeyUp}
                    >
                    <div><img src={this.props.screenshot.src} width="100%"/></div>
                
                    <div style={divStyleDescription}>
                        <Label bsStyle='primary' 
                               bsSize='large' 
                               className="mrxs mtl clickable"
                               onClick={this.onLocaleClick}>
                            {this.props.screenshot.locale.bcp47Tag}
                        </Label> 
                
                        <span onClick={this.onNameClick} className="clickable">
                            {this.props.screenshot.name}
                        </span>
                    </div>
                    <span style={divStyleGlyph}>
                        <StatusGlyph status={this.props.screenshot.status} 
                                     onClick={this.props.onStatusGlyphClick}
                                    />
                    </span >
                </div>
                    );
    }

});

export default injectIntl(Screenshot);
