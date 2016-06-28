var React = require('react');
var ReactDOM = require('react-dom');

var helpers = require('./helpers.js');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

//Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://catch-of-the-day-react-3f746.firebaseio.com/');

/*Applictation*/
var App = React.createClass({
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
  addFish: function(fish){
    var timestamp = (new Date()).getTime();
    //1.update the state of the App
    this.state.fishes['fish-' + timestamp] = fish;
    //2.set the new state of the App
    this.setState({
      fishes: this.state.fishes
    });
  },
  loadSamples: function(){
    this.setState({
      fishes: require('./sample-fishes.js')
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

        <Order fishes={this.state.fishes} order={this.state.order}/>

        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    )
  }

});

/*Fish*/
var Fish = React.createClass({
  onButtonClick : function() {
    console.log("Going to add the fish: ", this.props.index);
    var key = this.props.index;
    this.props.addToOrder(key);
  },
  render : function() {
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!');
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{helpers.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
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
  renderOrder : function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if(!fish) {
      return <li key={key}>Sorry, fish no longer available!</li>
    }

    return (
      <li key={key}>
        {count}lbs
        {fish.name}
        <span className="price">{helpers.formatPrice(count * fish.price)}</span>
      </li>)
  },
  render : function() {
    var orderIds = Object.keys(this.props.order);

    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <ul className="order">
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {helpers.formatPrice(total)}
          </li>
        </ul>
      </div>
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

        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
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
