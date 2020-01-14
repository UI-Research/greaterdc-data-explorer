import React, { Component } from "react";
import classnames from "classnames";

import './Modal.scss'

export default class Modal extends Component {
  render() {
    const { children, isOpen, onRequestClose } = this.props;

    const overlayCx = classnames("Modal-overlay", { visible: isOpen });
    const modalCx = classnames("Modal", { visible: isOpen });

    return (
      <div className={overlayCx} onClick={onRequestClose}>
        <div className={modalCx}>
          <button onClick={onRequestClose}>✖</button>
          {children}
        </div>
      </div>
    );
  }
}
