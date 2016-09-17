
let App = React.createClass({
  getInitialState() {
    return {
      transactions: [],
      type: ''
    }
  },

  getType(type){
    this.setState({ type });
  },

  render() {
    return (
      <div className="container">
        <div className="row">
          <h4>
            <TransactionForm getType={this.getType}/>
          </h4>
        </div>
        <div className="row">
          <h3>
            Amount
          </h3>
        </div>
        <div className="row">
          table
        </div>
      </div>
    )
  }
});

const TransactionForm = React.createClass({

  selectType(event) {
    
  }

  render() {
    return (
      <div>
        <form className="form-inline">
          <label className="radio-inline">
            <input type="radio" name="type" id="inlineRadio1" value="credit" onClick={this.selectType}/> Credit
          </label>
          <label className="radio-inline">
            <input type="radio" name="type" id="inlineRadio2" value="debit" onClick={this.selectType}/> Debit
          </label>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <div className="form-group">
            <label className="sr-only">Amount (in dollars)</label>
            <div className="input-group">
              <div className="input-group-addon">$</div>
              <input type="text" className="form-control" id="exampleInputAmount" placeholder="Amount" />
            </div>
          </div>
          <span>  For: </span>
          <input type="text" className="form-control" placeholder="Description"/>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
