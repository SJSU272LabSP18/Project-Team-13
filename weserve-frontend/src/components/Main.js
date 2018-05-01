import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from "./Signup";
import Profile from "./Profile";
import Userhome from "./Userhome";
import Project from "./Project";
import Dashboard from './Dashboard';

const Main = () => (
    <Switch>
        <Route exact path = '/' component = { Home } />
        <Route path = '/logout' component = { Home } />
        <Route path = '/login' component = { Login } />
        <Route path = '/signup' component = { Signup } />
        <Route path = '/profile' component = { Profile } />
        <Route path = '/userhome' component = { Userhome } />
        <Route path = '/project/:value/' component = { Project } />
        <Route path = '/dashboard' component = { Dashboard } />
    </Switch>
)

export default Main;

