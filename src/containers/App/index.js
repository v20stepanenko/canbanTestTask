// Core
import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';

// Instruments
import '../../theme/scroll-bar.scss';
import '../../theme/common.scss';
import Styles from './styles';
import CreateToDo from '../../component/CreateToDo';
import { stateToDo } from '../../helpers/const.js';
import ToDoList from '../../component/ToDoList';

const { DO_IT, IN_PROGRESS, DONE, ABORTED } = stateToDo;

export default class App extends Component {
    state = {
        toDos: []

        /*
            {
                id,
                dateCreate:string,
                desription:string,
                state: STRING(stateToDo constants),
                priority
            }
        */
    };

    componentWillMount = () => {
        let toDos = localStorage.getItem('toDos');

        if (toDos) {
            toDos = JSON.parse(toDos);
            toDos.forEach((toDo) => {
                toDo.id = Number(toDo.id);
            });
            this.setState({ toDos });
        }
    };

    setState = (partialState, callback = () => undefined) => {
        let callBackDecor = callback;

        if (partialState.toDos) {
            callBackDecor = () => {
                this.saveToDos();
                callback();
            };
        }
        Component.prototype.setState.bind(this)(partialState, callBackDecor);
    };

    saveToDos = () => {
        const toDos = JSON.stringify(this.state.toDos);

        localStorage.setItem('toDos', toDos);
    };

    saveToDo = (toDo) => {
        const { toDos } = this.state;
        const newToDos = [toDo, ...toDos];

        this.setState({ toDos: newToDos });
    };

    nextState = (toDoID) => {
        const newState = this.state.toDos.map((item) => {
            if (item.id === toDoID) {
                switch (item.state) {
                    case DO_IT: {
                        item.state = IN_PROGRESS;
                        break;
                    }
                    case IN_PROGRESS: {
                        item.state = DONE;
                        break;
                    }
                    case DONE:
                    case ABORTED: {
                        return null;
                    }
                    default: {
                        break;
                    }
                }
            }

            return item;
        });

        this.setState({ toDos: newState.clean() }); //MY OWN FUNCTION >> in src/helpers/index.js
    };

    toAborted = (toDoID) => {
        const newState = this.state.toDos.map((item) => {
            if (item.id === toDoID) {
                item.state = ABORTED;
            }

            return item;
        });

        this.setState({ toDos: newState });
    };

    getToDos = (nameList) => {
        switch (nameList) {
            case DO_IT:
            case IN_PROGRESS:
            case DONE:
            case ABORTED: {
                break;
            }
            default: {
                console.warn('state to do list is wrong, getToDoList(!!!x!!!)');

                return;
            }
        }
        const { toDos } = this.state;

        return toDos.filter((item) => item.state === nameList);
    };

    render () {
        return (
            <section className = { Styles.app }>
                <div>
                    <span>DO IT</span>
                    <CreateToDo saveToDo = { this.saveToDo } />
                    <ToDoList
                        nextState = { this.nextState }
                        nextStateText = { 'To progress' }
                        toAborted = { this.toAborted }
                        toDos = { this.getToDos(DO_IT) }
                    />
                </div>
                <div>
                    <span>IN POGRESS</span>
                    <ToDoList
                        nextState = { this.nextState }
                        nextStateText = { 'Done' }
                        toAborted = { this.toAborted }
                        toDos = { this.getToDos(IN_PROGRESS) }
                    />
                </div>
                <div>
                    <span>DONE</span>
                    <ToDoList
                        nextState = { this.nextState }
                        nextStateText = { 'Delete' }
                        toDos = { this.getToDos(DONE) }
                    />
                </div>
                <div>
                    <span>ABORTED</span>
                    <ToDoList
                        nextState = { this.nextState }
                        nextStateText = { 'Delete' }
                        toDos = { this.getToDos(ABORTED) }
                    />
                </div>
            </section>
        );
    }
}
