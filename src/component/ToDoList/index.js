import React, { Component } from 'react';
import { arrayOf, func, string, shape, number } from 'prop-types';
import { TransitionGroup, Transition } from 'react-transition-group';
import { fromTo } from 'gsap';
//Instrument
import Styles from './style.scss';
import ToDo from '../ToDo';

export default class ToDoList extends Component {
    static propTypes = {
        nextState:     func,
        nextStateText: string,
        toAborted:     func,
        toDos:         arrayOf(
            shape({
                id:         number,
                dateCreate: string,
                desription: string,
                state:      string,
                priority:   number
            }).isRequired
        )
    };

    sortedToDo = (addToDos) => {
        const highToDos = addToDos.filter((item) => item.priority === 3);
        const normalToDos = addToDos.filter((item) => item.priority === 2);
        const lowToDos = addToDos.filter((item) => item.priority === 1);

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

    handleToDoAppear = (toDo) => {
        fromTo(
            toDo,
            0.6,
            {
                transform: 'scaleY(.0)',
                opacity:   0
            },
            {
                transform: 'scaleY(1)',
                opacity:   1
            }
        );
    };

    handleToDoDisappear = (toDo) => {
        fromTo(
            toDo,
            0.6,
            {
                height: 'auto',
                opacity:   1
            },
            {
                height: 0,
                opacity:   0
            }
        );
    };

    getToDoList = () => {
        const { toDos } = this.props;

        const doItJSX = this.sortedToDo(toDos).map((item, index) => {
            const {
                nextState: _nextState,
                nextStateText: _nextStateText,
                toAborted: _toAborted
            } = this.props;

            return (
                <Transition
                    key = { index }
                    timeout = { 600 }
                    onEnter = { this.handleToDoAppear }
                    onExit = { this.handleToDoDisappear }>
                    <ToDo
                        nextState = { _nextState }
                        nextStateText = { _nextStateText }
                        toAborted = { _toAborted }
                        toDo = { item }
                    />
                </Transition>
            );
        });

        return doItJSX;
    };

    render () {
        return (
            <div className = { Styles['list-wrapper'] }>
                <TransitionGroup>{this.getToDoList()}</TransitionGroup>
            </div>
        );
    }
}
