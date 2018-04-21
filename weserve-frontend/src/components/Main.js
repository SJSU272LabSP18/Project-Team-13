import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from "./Signup";
import Profile from "./Profile";
import Userhome from "./Userhome";

const Main = () => (
    <Switch>
        <Route exact path = '/' component = { Home } />
        <Route path = '/logout' component = { Home } />
        <Route path = '/login' component = { Login } />
        <Route path = '/signup' component = { Signup } />
        <Route path = '/profile' component = { Profile } />
        <Route path = '/userhome' component = { Userhome } />
    </Switch>
)

export default Main;

