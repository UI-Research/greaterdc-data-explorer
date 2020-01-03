import { h, Component } from "preact";
import classnames from "classnames";

export default class Modal extends Component {
  render() {
    const { children, isOpen, onRequestClose } = this.props;

    const overlayCx = classnames("Modal-overlay", { visible: isOpen });
    const modalCx = classnames("Modal", { visible: isOpen });

    return (
      <div class={overlayCx} onClick={onRequestClose}>
        <div class={modalCx}>
          <button onClick={onRequestClose}>✖</button>
          {children}
        </div>
      </div>
    );
  }
}
