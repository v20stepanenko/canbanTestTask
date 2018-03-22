import React, { Component } from "react";
import { func, string, object } from "prop-types";

import Styles from "./style.scss";
import { getMonthByNum } from "../../helpers/index.js";
import { stateToDo } from "../../helpers/const.js";

const { DO_IT, IN_PROGRESS } = stateToDo;

export default class ToDo extends Component {
  static propTypes = {
    nextState: func,
    nextStateText: string,
    toAborted: func,
    toDo: object
  };

  getNormalTime = timeStr => {
    const date = new Date(timeStr);
    const monthStr = getMonthByNum(date.getMonth());
    const dateNum = date.getDate();

    const normalizeTime = time => {
      if (time.length === 1) {
        return `0${time}`;
      }

      return time;
    };

    const hours = normalizeTime(String(date.getHours()));
    const minutes = normalizeTime(String(date.getMinutes()));

    const time = `${hours}:${minutes}`;

    return `${dateNum} ${monthStr} ${time}`;
  };

  getFunctionalButton = toDoID => {
    const { toAborted, nextState, nextStateText } = this.props;
    const btnToAbort = (
      <button
        className={Styles.btn}
        key="aborted btn"
        onClick={() => {
          toAborted(toDoID);
        }}
      >
        Abort
      </button>
    );
    const btnToNextState = (
      <button
        className={Styles.btn}
        key="next state bnt"
        onClick={() => {
          nextState(toDoID);
        }}
      >
        {nextStateText}
      </button>
    );

    const btns = [];

    if (nextState && nextStateText) {
      btns.push(btnToNextState);
    }
    if (toAborted) {
      btns.push(btnToAbort);
    }

    return btns;
  };

  getPriorityBody = item => {
    switch (item.state) {
      case DO_IT:
      case IN_PROGRESS: {
        const { priorityUp, priorityLow } = this.props;
        return (
          <div className = { Styles.priority }>
            <div>Priority: {item.priority}</div>
            <button
              onClick={() => {
                priorityUp(item.id);
              }}
            >
              {" "}
              +{" "}
            </button>
            <button
              onClick={() => {
                priorityLow(item.id);
              }}
            >
              {" "}
              -{" "}
            </button>
          </div>
        );
      }
      default: {
        return <div>Priority: {item.priority}</div>;
      }
    }
  };

  getDescribBody = item => {
    const { changeDescride } = this.props;
    if (item.state === DO_IT) {
      let refDescribe;
      return (
        <div>
          <div className={Styles.task}>
            Task:{" "}
            <div
              ref={node => {
                refDescribe = node;
              }}
              onBlur = {(e) => {
                e.target.setAttribute('contenteditable', 'false');
                changeDescride(item.id, e.target.textContent)}}
            >
              {item.description}
            </div>
          </div>
          <button
            className = {Styles.pen}
            onFocus={() => {
              refDescribe.setAttribute('contenteditable', 'true');
              refDescribe.focus();
            }}
          > </button>
        </div>
      );
    } else {
      return <div className={Styles.task}>Task: {item.description}</div>;
    }
  };

  getBodyToDo = item => {
    return (
      <div className={Styles["task-info"]}>
        {this.getDescribBody(item)}
        {this.getPriorityBody(item)}
        <div className={Styles.time}>
          {" "}
          Time create: {this.getNormalTime(item.dateCreate)}{" "}
        </div>
      </div>
    );
  };

  getClassPriority = priority => {
    switch (priority) {
      case 1: {
        return Styles["low-priority"];
      }
      case 2: {
        return Styles["normal-priority"];
      }
      case 3: {
        return Styles["high-priority"];
      }
      default: {
        break;
      }
    }
  };

  render() {
    const { toDo: item } = this.props;

    return (
      <div
        className={`${this.getClassPriority(item.priority)} ${
          Styles["todo-wrapper"]
        }`}
      >
        {this.getBodyToDo(item)}
        {this.getFunctionalButton(item.id)}
      </div>
    );
  }
}
