import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import MainLayout from './containers/MainLayout';
import SearchLayout from './containers/SearchLayout';
import AddAudioLayout from './containers/AddAudioLayout'
import * as serviceWorker from './serviceWorker';
import stores from './stores/MainStore';
import 'bootstrap/dist/css/bootstrap.css';

export const StoreContext = React.createContext();

ReactDOM.render(<StoreContext.Provider value={stores}>
    <Router>
        <Switch>
            <Route exact path="/" component = {MainLayout}/>
            <Route path ="/home" component = {MainLayout}/>
            <Route path ="/search" component = {SearchLayout}/>
            <Route path ="/add" component={AddAudioLayout}/>
        </Switch>
    </Router>
</StoreContext.Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
