class InContextTranslation {

    getTextNodesChildOf(node) {
        var nodes = [];

        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === Node.TEXT_NODE) {
                nodes.push(node);
            } else {
                nodes = nodes.concat(this.getTextNodesChildOf(node));
            }
        }

        return nodes;
    }

    extractIdFromString(string) {
        var re = /(.*)\ufe00\.(.*)\ufe00\.(.*)/;
        var match = re.exec(string);

        var res = {
            'string': string
        };

        if (match !== null) {
            res = {
                'string': match[1] + match[3],
                'id': match[2]
            };
        }

        return res;
    }

    injectIdInMessageFormat(messageFormat, id) {
        messageFormat = "\ufe00." + id + "\ufe00." + messageFormat;
        return messageFormat;
    }

    setup(MESSAGES, document, window) {

        var head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        var body = document.body || document.getElementsByTagName('body')[0];


        var divIceModal = document.createElement('div');
        divIceModal.setAttribute('class', 'mojito-ice-modal');
        body.appendChild(divIceModal);



        var observer = new MutationObserver(function (mutations) {

//    console.log("DOM mutation");
            this.getTextNodesChildOf(window.document).forEach((text) => {

//        console.log(text);

                if (text.nodeValue.indexOf("\ufe00.") !== -1) {
//            console.log(text.nodeValue);
                    var res = extractIdFromString(text.nodeValue);
                    text.nodeValue = res.string;
//            console.log("translatable, key:", res.id, "- text: {}", res.string);

                    var wrapper = document.createElement('span');
                    wrapper.setAttribute("class", "mojito-ice-string");
                    text.parentNode.insertBefore(wrapper, text);
                    wrapper.appendChild(text);

                    var edit = document.createElement('span');
                    edit.setAttribute("class", "mojito-ice-edit");
                    var icon = document.createElement('i');
                    icon.setAttribute('class', 'icon-pencil');

                    edit.appendChild(icon);
                    wrapper.appendChild(edit);


                    wrapper.addEventListener("click", (e) => {
                        console.log('click on: ' + res.id);
                        e.preventDefault();
                    });


                }
            });

//    mutations.forEach(function(mutation) {
////         console.log(mutation);
//         mutation.addedNodes.forEach(function(node) {
//                console.log(node);
////             node.textContent = node.textContent + '@@'
//        
//         });
//    });
        });

// Notify me of everything!
        var observerConfig = {childList: true, subtree: true, attribute: true};


// Node, config
// In this case we'll listen to all changes to body and child nodes
        var targetNode = document.body;
        observer.observe(targetNode, observerConfig);



        Object.keys(MESSAGES).map((item) => {
            MESSAGES[item] = injectIdInMessageFormat(MESSAGES[item], item);
        });




    }
}

export default new InContextTranslation();