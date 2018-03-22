import React, { Component } from "react";
import {
  arrayOf,
  func,
  string,
  shape,
  number,
  objectOf,
  oneOfType
} from "prop-types";
import { TransitionGroup, Transition } from "react-transition-group";

import { fromTo } from "gsap";
//Instrument
import Styles from "./style.scss";
import ToDo from "../ToDo";

export default class ToDoList extends Component {
  static propTypes = {
    nextStateText: string.isRequired,
    functional: objectOf(
      shape({
        nextState: func,
        toAborted: func,
        priorityLow: func,
        priorityUp: func,
        changeDescride: func
      })
    ).isRequired,
    toDos: arrayOf(
      shape({
        id: oneOfType([number, string]).isRequired,
        dateCreate: string.isRequired,
        desription: string,
        state: string.isRequired,
        priority: number.isRequired
      }).isRequired
    )
  };

  shouldComponentUpdate = (nextProps) => {
    const { toDos } = this.props;
    const { toDos: nextToDos } = nextProps;

    return toDos.length !== nextToDos.length;
  }

  sortedToDo = addToDos => {
    const highToDos = addToDos.filter(item => item.priority === 3);
    const normalToDos = addToDos.filter(item => item.priority === 2);
    const lowToDos = addToDos.filter(item => item.priority === 1);

    const compareTimeCreate = (a, b) => {
      const timeA = new Date(a.dateCreate).getTime();
      const timeB = new Date(b.dateCreate).getTime();

      if (timeA > timeB) {
        return 1;
      }
      if (timeA < timeB) {
        return -1;
      }
    };

    highToDos.sort(compareTimeCreate);
    normalToDos.sort(compareTimeCreate);
    lowToDos.sort(compareTimeCreate);

    return [...highToDos, ...normalToDos, ...lowToDos];
  };

  handleToDoAppear = toDo => {
    fromTo(
      toDo,
      0.6,
      {
        transform: "scaleY(.0)",
        opacity: 0
      },
      {
        transform: "scaleY(1)",
        opacity: 1
      }
    );
  };

  handleToDoDisappear = toDo => {
    fromTo(
      toDo,
      0.6,
      {
        transform: "scaleY(1)",
        opacity: 1
      },
      {
        transform: "scaleY(.0)",
        opacity: 0
      }
    );
  };

  getToDoList = () => {
    const { toDos } = this.props;

    const doItJSX = this.sortedToDo(toDos).map((item, index) => {
      const {
        nextState,
        toAborted,
        priorityLow,
        priorityUp,
        changeDescride
      } = this.props.functional;
      const { nextStateText } = this.props;

      return (
        <Transition
          key={item.id}
          timeout={600}
          onEnter={this.handleToDoAppear}
          onExit={this.handleToDoDisappear}
        >
          <ToDo
            nextState={nextState}
            nextStateText={nextStateText}
            toAborted={toAborted}
            priorityLow={priorityLow}
            priorityUp={priorityUp}
            changeDescride={changeDescride}
            toDo={item}
          />
        </Transition>
      );
    });

    return doItJSX;
  };

  render() {
  
    return (
      <div className={Styles["list-wrapper"]}>
        <TransitionGroup>{this.getToDoList()}</TransitionGroup>
      </div>
    );
  }
}
