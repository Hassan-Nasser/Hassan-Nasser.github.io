import React, { Component } from "react";
import "./Modal.scss";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class Modal extends Component {
    constructor(props) {
        super(props);
        this.dialogRef = React.createRef();
    }

    handleClickOutside(event) {
        const modalBox = event.target;
        if (!this.dialogRef?.current?.contains(modalBox) && this.props.isOpen) {
            this.props.onClose(false);
        }
    }

    handleKeydown(ev) {
        if (ev.key === "Escape") {
            this.props.onClose(false);
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.dialogRef?.current?.focus();
        }
    }
    componentDidMount() {
        if (this.props.isOpen)
            document.body.style.overflow = 'hidden'
    }

    componentWillUnmount() {
        document.body.style.overflow = 'unset';
    }

    render() {

        const displayClass = this.props.isOpen ? "show" : "hide";

        return (

            <div
                id="modal-comp"
                className={displayClass}
                isOpen={this.props.isOpen}
                onKeyDown={(e) => this.handleKeydown(e)}
                onClick={(e) => this.handleClickOutside(e)}
            >
                <div className="animate-modal">
                    <div
                        className="dialog"
                        ref={this.dialogRef}
                        tabIndex={1}
                        onKeyDown={(e) => this.handleKeydown(e)}
                    >
                        <div className="modal-title-container">
                            <div className="modal-title">{this.props.project.name}</div>
                            <FontAwesomeIcon icon={faCircleXmark} size="2x" onClick={() => this.props.onClose()} />
                        </div>
                        <iframe className="iframe" src={this.props.project.url} />
                        <ul className="">
                            {this.props.project.tags.map((tag, index) =>
                                <li className=" tag-list montserrat" key={index}>{tag.name}</li>
                            )}
                        </ul>
                        <div className="Mukta description">{this.props.project.description}</div>


                    </div>
                </div>

            </div>);
    }
}

export default Modal;