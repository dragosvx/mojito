import React from "react";
import ReactDOM from "react-dom";

import IctUtils from "./IctUtils";
import IctContainer from "./IctContainer"

require('./ict.css');

class InContextTranslation {

    instrumentMessages(messages) {
        Object.keys(messages).map((key) => {
            messages[key] = IctUtils.injectIdInMessageFormat(messages[key], key);
        });
    }

    getNodesChildOf(node) {
        var nodes = [];
        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === Node.TEXT_NODE) {
                nodes.push(node);
            } else if (this.isElementWithPlaceholder(node)) {
                console.log("with placehodler");
                nodes.push(node);
            } else {
                nodes = nodes.concat(this.getNodesChildOf(node));
            }
        }

        return nodes;
    }
    
    isElementWithPlaceholder(node) {
        return node.nodeType === Node.ELEMENT_NODE && this.getPlaceholderAttribute(node);
    }
    
    getPlaceholderAttribute(node) {
        return node.getAttribute('placeholder');
    }
    
    getStringFromNode(node) {
        var string = node.nodeValue;
        
        if (this.isElementWithPlaceholder(node)) {
            string = this.getPlaceholderAttribute(node);
        }
        
        return string;
    }

    wrapNode(node, onClick) {
        
        var res = IctUtils.extractIdFromString(this.getStringFromNode(node));
       
        var wrapper = document.createElement('span');
        wrapper.setAttribute("class", "mojito-ict-string");
        node.parentNode.insertBefore(wrapper, node);
        wrapper.appendChild(node);

        var edit = document.createElement('span');
        edit.setAttribute("class", "mojito-ict-edit");

        var icon = document.createElement('i');
        icon.setAttribute('class', 'glyphicon glyphicon-pencil');
        edit.appendChild(icon);

        wrapper.appendChild(edit);
        edit.addEventListener("click", (e) => onClick(e, res));
    }


    installIctReactContainer() {
        var body = document.body || document.getElementsByTagName('body')[0];
        var divIctContainer = document.createElement('div');
        
        divIctContainer.setAttribute('id', 'mojito-ict-container');
        body.appendChild(divIctContainer);
        this.divIctContainer = divIctContainer;
        
        var reactContainer = ReactDOM.render(
                <IctContainer 
                    locale={LOCALE} 
                    messages={MESSAGES} 
                    onClose={this.closeModal} />,
                this.divIctContainer
                );
        
        this.reactContainer = reactContainer;
    }

    onClickBehavior(e, res) {
        e.preventDefault();
        e.stopPropagation();
        // TODO remove hardcoded repository and locale
        this.reactContainer.showModal(2, 'fr-FR', res.id, res.string);
    }

    processNode(node) {
        var hasMetaData = IctUtils.hasIctMetadata(this.getStringFromNode(node));
        var isAlreadyProccessed =
                node.parentNode &&
                node.parentNode.getAttribute('class') &&
                node.parentNode.getAttribute('class').indexOf('mojito-ict-string') !== -1;

        if (hasMetaData && !isAlreadyProccessed) {
            this.wrapNode(node, this.onClickBehavior.bind(this));
            this.wrapped[node] = 1;
        }
    }

    installObserver() {

        var observer = new MutationObserver(() => {
            this.getNodesChildOf(window.document).forEach((node) => {
                this.processNode(node);
            });
        });

        var observerConfig = {childList: true, subtree: true, attribute: true};
        var targetNode = document.body;
        observer.observe(targetNode, observerConfig);
    }

    setup(messages, locale) {
        this.wrapped = {};
        this.instrumentMessages(messages);
        this.installIctReactContainer();
        this.installObserver();
        this.locale = locale;
    }

}

export default new InContextTranslation();