import React, { Component } from 'react';
import { func, string, object } from 'prop-types';
import { Transition } from 'react-transition-group';
import { fromTo } from 'gsap';

import Styles from './style.scss';
import { getMonthByNum } from '../../helpers/index.js';

export default class ToDo extends Component {
    static propTypes = {
        nextState:     func,
        nextStateText: string,
        toAborted:     func,
        toDo:          object
    };

    getNormalTime = (timeStr) => {
        const date = new Date(timeStr);
        const monthStr = getMonthByNum(date.getMonth());
        const dateNum = date.getDate();

        const normalizeTime = (time) => {
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

    getFunctionalButton = (toDoID) => {
        const { toAborted, nextState, nextStateText } = this.props;

        const btnToAbort = (
            <button
                className = { Styles.btn }
                key = 'aborted btn'
                onClick = { () => {
                    toAborted(toDoID);
                } }>
                Abort
            </button>
        );
        const btnToNextState = (
            <button
                className = { Styles.btn }
                key = 'next state bnt'
                onClick = { () => {
                    nextState(toDoID);
                } }>
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

    getBodyToDo = (item) => (
        <div className = { Styles['task-info'] }>
            <div className = { Styles.task }>Task: {item.description}</div>
            <div>Priority: {item.priority}</div>
            <div className = { Styles.time }>
                {' '}
                Time create: {this.getNormalTime(item.dateCreate)}{' '}
            </div>
        </div>
    );

    getClassPriority = (priority) => {
        switch (priority) {
            case 1: {
                return Styles['low-priority'];
            }
            case 2: {
                return Styles['normal-priority'];
            }
            case 3: {
                return Styles['high-priority'];
            }
            default: {
                break;
            }
        }
    };

    render () {
        const { toDo: item } = this.props;

        return (
            <div
                className = { `${this.getClassPriority(item.priority)} ${
                    Styles['todo-wrapper']
                }` }
                ref = { (c) => {
                    this.container = c;
                } }>
                TO Do
                {this.getBodyToDo(item)}
                {this.getFunctionalButton(item.id)}
            </div>
        );
    }
}
