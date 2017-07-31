import React from 'react';
import IctModal from "./IctModal";
import {IntlProvider} from "react-intl";
import queryString from "query-string";

class IctContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    showModal(repository, locale, id, string) {
        this.setState({
            showModal: true,
            repository: repository,
            locale: locale,
            id: id,
            string: string,
        });
    }

    closeModal() {
        this.setState({
            showModal: false
        });
    }
    
    openWorkbench() {
        var query = queryString.stringify({
            'repoIds[]' : this.state.repository,
            'bcp47Tags[]' : this.state.locale,
            'searchAttribute' : 'stringId',
            'searchText' : this.state.id
            
        });
        window.open("http://localhost:8080/workbench?" + query);
    }

    render() {
        return (
                <IntlProvider locale={this.props.locale} messages={this.props.messages}>
                    <IctModal
                        show={this.state.showModal}
                        onClose={() => this.closeModal()}
                        onOkay={() => this.openWorkbench()}
                        id={this.state.id}
                        string={this.state.string}
                        />
                </IntlProvider>
        );
    }
}

export default IctContainer;