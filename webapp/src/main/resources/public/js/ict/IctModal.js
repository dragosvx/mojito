import React from 'react';
import {Button, Modal} from "react-bootstrap";
import {FormattedMessage, injectIntl} from "react-intl";

class IctModal extends React.Component {
   
    render() {
        return (
              <Modal show={this.props.show} onHide={this.props.onClose}>
                  <Modal.Header closeButton>
                      <Modal.Title><FormattedMessage id="ict.modal.title" /></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div>Id: {this.props.id}</div>
                  <div>Translation: {this.props.string}</div>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button bsStyle="primary" onClick={this.props.onOkay}>
                          <FormattedMessage id="label.okay"/>
                      </Button>
                      <Button onClick={this.props.onClose}>
                          <FormattedMessage id="label.cancel"/>
                      </Button>
                  </Modal.Footer>
              </Modal>
          );
  
    }
    
}

export default injectIntl(IctModal);