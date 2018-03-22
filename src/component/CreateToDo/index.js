import React, { Component } from "react";
import Modal from "react-responsive-modal";
import { func } from "prop-types";

import Styles from "./style";
import { stateToDo } from "../../helpers/const.js";

const { DO_IT } = stateToDo;

export default class CreateToDo extends Component {
  static propTypes = {
    saveToDo: func.isRequired
  };

  state = {
    priority: 1,
    description: "",
    modal: false
  };

  componentWillMount = () => {
    const lastIdToDo = localStorage.getItem("lastIdToDo");

    if (Number(lastIdToDo)) {
      this.lastIdToDo = Number(lastIdToDo);
    } else {
      this.lastIdToDo = 0;
    }
  };

  onOpenModal = () => {
    this.setState({ priority: 1, description: "", modal: true });
  };

  onCloseModal = () => {
    this.setState({ modal: false });
  };

  getIdToDo = () => (this.lastIdToDo += 1);

  priorityDown = () => {
    let { priority } = this.state;

    if (priority > 0) {
      priority -= 1;
    }
    this.setState({ priority });
  };

  priorityUp = () => {
    let { priority } = this.state;

    if (priority < 3) {
      priority += 1;
    }
    this.setState({ priority });
  };

  handleKeyPress = e => {
    if (e.charCode === 13 && e.shiftKey) {
      this.createNewToDo();
    }
  };

  createNewToDo = () => {
    const { priority, description } = this.state;
    const dateCreate = new Date().toString();
    const id = this.getIdToDo();

    const toDo = {
      id,
      description,
      priority,
      dateCreate,
      state: DO_IT
    };

    this.props.saveToDo(toDo);
    this.onCloseModal();

    localStorage.setItem("lastIdToDo", id);
  };

  descriptionChange = event => {
    const description = event.target.value;

    this.setState({ description });
  };

  render() {
    const { modal, priority, description } = this.state;

    return (
      <div className={Styles["new-do-it"]}>
        <button onClick={this.onOpenModal}>new</button>
        <Modal little showCloseIcon open={modal} onClose={this.onCloseModal}>
          <h2>Create new TO DO</h2>
          <div className={Styles["info-task-wrapper"]}>
            <div className={Styles.priority}>
              <span>Priority:</span>
              <button onClick={this.priorityDown}>-</button>
              <span>{priority}</span>
              <button onClick={this.priorityUp}>+</button>
            </div>
            <textarea
              placeholder="Describe task"
              ref={node => {
                if (node) {
                  node.focus();
                }
              }}
              value={description}
              onChange={this.descriptionChange}
              onKeyPress={this.handleKeyPress}
            />
            <button
              className={Styles["btn-create"]}
              data-tips="Shift + Enter"
              onClick={this.createNewToDo}
            >
              Add new TO DO
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}
