import React from 'react';
import ReactDOM from 'react-dom';

/*Import router*/
import ReactRouter from 'react-router';
import {Router} from 'react-router';
import {Route} from 'react-router';

import createBrowserHistory from 'history/lib/createBrowserHistory';

/*Import components*/
import NotFound from './components/NotFound.js';
import StorePicker from './components/StorePicker.js';
import App from './components/App.js';


/*Routes*/
var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
