import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Switch, Redirect, Link } from "react-router-dom";

import { Wall } from "./wall";
import { Kaleidoscope } from "./kaleidoscope";
import { Board } from "./board";
import { Book } from "./book";

import './main.css';
import { Service } from "./service";
import { Overrides } from "./overrides";

const service = new Service([]);

ReactDOM.render(
<div>
    <Router>
        <Switch>
            <Route path="/w17829" render={(props) => <Wall {...props} service={service} viewOnly={false}/> }/>
            <Route path="/k2954" render={(props) => <Kaleidoscope {...props} service={service} viewOnly={false}/> }/>
            <Route path="/b46100" render={(props) => <Board {...props} service={service} viewOnly={false}/> }/>
            <Route path="/j31875" render={(props) => <Book {...props} service={service} viewOnly={false}/> }/>
            <Route path="/a1331">
                <div>
                    <Overrides service={service}/>
                    <Book service={service} viewOnly={true} />
                    <Kaleidoscope service={service} viewOnly={true} />
                    <Board service={service} viewOnly={true} />
                    <Wall service={service} viewOnly={true} />
                </div>
            </Route>
            <Route>
                <div className="error-page">
                    <p>
                        There is a maze in the desert carved from sand and rock.
                        A vast labyrinth of pathways and corridors a hundred miles long, a thousand miles wide, full of twists and dead ends.
                    </p>
                    <p>Picture it a puzzle.</p>
                    <p>
                        You walk, and at the end of this maze is a prize just waiting to be discovered.
                        All you have to do is find your way through.
                    </p>
                    <p>Can you see the maze? Its walls and floors, its twists and turns?</p>
                    <p>
                        Good, because the maze you've created in your mind is, itself, the maze.
                        There is no desert, no rock or sand.
                        There is only the idea of it.
                        But it's an idea that will come to dominate your every waking and sleeping moment.
                    </p>
                    <p>You're inside the maze now.</p>
                    <p>You cannot escape.</p>
                    <p>Welcome to madness.</p>
                    <p>-- Narrator, "Legion"</p>
                </div>
            </Route>
        </Switch>
    </Router>
</div>,
document.getElementById('react-app-root'));