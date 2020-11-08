import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Wall } from "./wall";
import { Kaleidoscope } from "./kaleidoscope";
import { Board } from "./board";
import { Book } from "./book";
import './main.css';
import { Service } from "./service";
import { Overrides } from "./overrides";
const service = new Service([]);
ReactDOM.render(React.createElement("div", null,
    React.createElement(Router, null,
        React.createElement(Switch, null,
            React.createElement(Route, { path: "/w17829", render: (props) => React.createElement(Wall, Object.assign({}, props, { service: service, viewOnly: false })) }),
            React.createElement(Route, { path: "/k2954", render: (props) => React.createElement(Kaleidoscope, Object.assign({}, props, { service: service, viewOnly: false })) }),
            React.createElement(Route, { path: "/b46100", render: (props) => React.createElement(Board, Object.assign({}, props, { service: service, viewOnly: false })) }),
            React.createElement(Route, { path: "/j31875", render: (props) => React.createElement(Book, Object.assign({}, props, { service: service, viewOnly: false })) }),
            React.createElement(Route, { path: "/a1331" },
                React.createElement("div", null,
                    React.createElement(Overrides, { service: service }),
                    React.createElement(Book, { service: service, viewOnly: true }),
                    React.createElement(Kaleidoscope, { service: service, viewOnly: true }),
                    React.createElement(Board, { service: service, viewOnly: true }),
                    React.createElement(Wall, { service: service, viewOnly: true }))),
            React.createElement(Route, null,
                React.createElement("div", { className: "error-page" },
                    React.createElement("p", null, "There is a maze in the desert carved from sand and rock. A vast labyrinth of pathways and corridors a hundred miles long, a thousand miles wide, full of twists and dead ends."),
                    React.createElement("p", null, "Picture it a puzzle."),
                    React.createElement("p", null, "You walk, and at the end of this maze is a prize just waiting to be discovered. All you have to do is find your way through."),
                    React.createElement("p", null, "Can you see the maze? Its walls and floors, its twists and turns?"),
                    React.createElement("p", null, "Good, because the maze you've created in your mind is, itself, the maze. There is no desert, no rock or sand. There is only the idea of it. But it's an idea that will come to dominate your every waking and sleeping moment."),
                    React.createElement("p", null, "You're inside the maze now."),
                    React.createElement("p", null, "You cannot escape."),
                    React.createElement("p", null, "Welcome to madness."),
                    React.createElement("p", null, "-- Narrator, \"Legion\"")))))), document.getElementById('react-app-root'));
