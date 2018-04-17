import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from "./Signup";

const Main = () => (
    <Switch>
        <Route exact path = '/' component = { Home } />
        <Route path = '/login' component = { Login } />
        <Route path = '/signup' component = { Signup } />
    </Switch>
)

export default Main;

