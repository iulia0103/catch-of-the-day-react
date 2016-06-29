import React from 'react';
import {History} from  'react-router';
import helpers from  '../helpers.js';

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

export default StorePicker;
