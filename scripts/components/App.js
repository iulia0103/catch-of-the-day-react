import React from 'react';

/*Firebase database*/
import Rebase from 're-base';
var base = Rebase.createClass('https://catch-of-the-day-react-3f746.firebaseio.com/');

import Catalyst from 'react-catalyst';

/*Import components*/
import Header from './Header.js';
import Fish from './Fish.js';
import Inventory from './Inventory.js';
import Order from './Order.js';

var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin],
  getInitialState: function(){
    return {
      fishes: {},
      order: {}
    }
  },
  componentDidMount: function(){
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

    if(localStorageRef) {
      // update our component state to reflect what is in localStorage
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  },
  componentWillUpdate : function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  addToOrder : function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order : this.state.order });
  },
  removeFromOrder: function(key){
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    });
  },
  addFish: function(fish){
    var timestamp = (new Date()).getTime();
    //1.update the state of the App
    this.state.fishes['fish-' + timestamp] = fish;
    //2.set the new state of the App
    this.setState({
      fishes: this.state.fishes
    });
  },
  removeFish: function(key){
    if(confirm("Are you sure you want remove the fish?")){
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      });
    }
  },
  loadSamples: function(){
    this.setState({
      fishes: require('../sample-fishes.js')
    });
  },
  renderFishes: function(key){
    return (
      <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
    )
  },
  render: function(){
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Good" />

          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFishes)}
          </ul>
        </div>

        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />

        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} removeFish={this.removeFish}/>
      </div>
    )
  }

});

export default App;
