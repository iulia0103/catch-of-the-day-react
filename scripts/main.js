var React = require('react');
var ReactDOM = require('react-dom');

var helpers = require('./helpers.js');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

/*Applictation*/
var App = React.createClass({
  getInitialState: function(){
    return {
      fishes: {},
      order: {}
    }
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
  render: function(){
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Good" />
        </div>

        <Order />

        <Inventory addFish={this.addFish}/>
      </div>
    )
  }

});

/*Header*/
var Header = React.createClass({

  render: function(){
    return(
      <header className="top">
        <h1>Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
        Day</h1>

        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
    )
  }

});

/*Order*/
var Order = React.createClass({

  render: function(){
    return(
      <p>Order</p>
    )
  }

});

/*Inventory*/
var Inventory = React.createClass({

  render: function(){
    return(
      <div>
        <h2>Inventory</h2>
        <AddFishForm {...this.props}/>
      </div>
    )
  }

});

/*Add fish form*/
var AddFishForm = React.createClass({
  createFish: function(event){
    //1. prevent the form from submitting
    event.preventDefault();
    //2.take the data from the form and create a fish object
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    };
    //3.add the fish to the App state
    this.props.addFish(fish);
    //4.reset the form
    this.refs.fishForm.reset();

  },
  render: function(){
    return(
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
      </form>
    )
  }

});


/*Store Picker
This will let us make <StorePicker/>*/
var StorePicker = React.createClass({
  mixins : [History],
  goToStore : function(event){
    event.preventDefault;
    //get the data from the input field
    var storeId = this.refs.storeId.value;

    //change from <StorePicker /> to <App />
    this.history.pushState(null, '/store/'+storeId);
  },
  render : function(){
    var name = "Iulia";
    return(
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Select A Store, {name}</h2>
        <input type="text" ref="storeId" defaultValue={helpers.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }

});


/*Not Found*/
var NotFound = React.createClass({

  render : function() {
    return <h1>Not Found!</h1>
  }

});

/*Routes*/
var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
