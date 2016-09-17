
let App = React.createClass({
  getInitialState() {
    return {
      transactions: []
    }
  },

  addTransaction(transaction) {
    const { transactions } = this.state;
    this.setState({
      transactions: [...transactions, transaction]
    })
  },

  render() {
    const { transactions } = this.state;
    return (
      <div className="container">
        <div className="row">
          <h4>
            <TransactionForm addTransaction={this.addTransaction}/>
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
  getInitialState() {
    return {
      type: '',
      amount: 0,
      description: ''
    }
  },

  selectType(event) {
    let type = event.target.value;
    this.setState({ type });
  },

  amountChange(event) {
    let amount = event.target.value;
    this.setState({ amount });
  },

  descriptionChange(event) {
    let description = event.target.value;
    this.setState({ description });
  },

  submitForm(event) {
    event.preventDefault();
    let transaction = {
      type: this.state.type,
      amount: this.state.amount,
      description: this.state.description,
      createAt: Date.now()
    };
    this.props.addTransaction(transaction);
  },

  render() {
    return (
      <div>
        <form className="form-inline" >
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
              <input
                type="number"
                min="0"
                className="form-control"
                id="exampleInputAmount"
                placeholder="Amount"
                value={this.state.amount}
                onChange={this.amountChange}
              />
            </div>
          </div>
          <span>  For: </span>
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={this.state.description}
            onChange={this.descriptionChange}
          />
          <button className="btn btn-primary" onClick={this.submitForm}>Submit</button>
        </form>
      </div>
    )
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
