var React = require('react');
var ReactDOM = require('react-dom');

/*Store Picker
This will let us make <StorePicker/>*/

var StorePicker = React.createClass({

  render : function(){
    var name = "Iulia";
    return(
      <form className="store-selector">
        <h2>Please Select A Store, {name}</h2>
        <input type="text" ref="storeId" required />
        <input type="Submit" />
      </form>
    )
  }

});

ReactDOM.render(<StorePicker/>, document.querySelector('#main'));
