import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

const Main = () => (
    <Switch>
        <Route exact path = '/' component = { Home } />
        <Route path = '/login' component = { Login } />
    </Switch>
)

export default Main;

