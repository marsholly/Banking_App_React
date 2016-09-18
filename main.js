var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

let App = React.createClass({
  getInitialState() {
    return {
      transactions: []
    }
  },

  componentDidMount() {
    let bankTransactions = this.bankStorage();
    this.setState({ transactions: bankTransactions });
  },

  addTransaction(transaction) {
    let { transactions } = this.state;
    this.setState({
      transactions: [...transactions, transaction]
    });

    let bankTransactions = this.bankStorage();
    bankTransactions.push(transaction);
    this.writeToStorage(bankTransactions);
  },

  bankStorage() {
    let json = localStorage.bankTransactions;
    let bankTransactions;
    try {
      bankTransactions = JSON.parse(json);
    }catch(e) {
      bankTransactions = [];
    }
    return bankTransactions;
  },

  writeToStorage(bankTransactions) {
    localStorage.bankTransactions = JSON.stringify(bankTransactions);
  },

  removeTransaction(id) {
    let bankTransactions = this.bankStorage();
    bankTransactions = bankTransactions.filter(transaction => transaction.createAt !== id);
    this.writeToStorage(bankTransactions);

    let { transactions } = this.state;
    this.setState({ transactions: bankTransactions });
  },

  updateTransaction(id, newTransaction){
    let json = localStorage.bankTransactions;
    let bankTransactions = JSON.parse(json);
    let index = bankTransactions.findIndex(transaction => {
      return transaction.createAt === id;
    });
    bankTransactions[index] = newTransaction;
    localStorage.bankTransactions = JSON.stringify(bankTransactions);
    this.setState({
      transactions: bankTransactions
    })
  },

  getBalance() {
    let {transactions} = this.state;
    let balanceObj = {};
    let balance = 0, creditTotal = 0, debitTotal = 0;
    transactions.forEach(transaction => {
      if(transaction.type === 'credit') {
        balance += Number(transaction.amount);
        creditTotal += Number(transaction.amount);
        balanceObj.balance = balance;
        balanceObj.creditTotal = creditTotal;
      }else{
        balance -= Number(transaction.amount);
        debitTotal += Number(transaction.amount);
        balanceObj.balance = balance;
        balanceObj.debitTotal = debitTotal;
      }
    })
    return balanceObj;
  },

  sortTransactions(newTransactions){
    this.setState({transactions: newTransactions});
  },

  render() {
    let transactions = this.state;
    const balanceObj = this.getBalance();
    return (
      <div className="container">
        <div className="row">
          <h4>
            <TransactionForm addTransaction={this.addTransaction} />
          </h4>
        </div>
        <div className="row">
          <h3>
            <div className="alert alert-warning" role="alert">
              The Balance is ${numeral(balanceObj.balance).format('0,0')}.
              Total Credits: ${numeral(balanceObj.creditTotal).format('0,0')} .
              Total Debits: ${numeral(balanceObj.debitTotal).format('0,0')} .
            </div>
          </h3>
        </div>
        <div className="row">
          <TransactionTable
            transactions={this.state.transactions}
            removeTransaction={this.removeTransaction}
            updateTransaction={this.updateTransaction}
            sortTransactions={this.sortTransactions}
          />
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

    this.setState({
      type: '',
      amount: 0,
      description: ''
    });
  },

  render() {
    let { transactions } = this.props;
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
            />&nbsp;
          <button className="btn btn-default" onClick={this.submitForm}>Submit</button>
        </form>
      </div>
    )
  }
});

const TransactionTable = React.createClass({
  getInitialState() {
    return {
      showModal: false,
      editType:'',
      editAmount: 0,
      editDescription:'',
      editCreateAt: '',
      sortBtn: false
    }
  },

  cancelEdit() {
    this.setState({editId: null});
    this.closeModal();
  },

  closeModal() {
    this.setState({showModal: false});
  },

  openModal() {
    this.setState({showModal: true});
  },

  editTransaction(transaction) {
    this.openModal();
    this.setState({
      editDescription: transaction.description,
      editAmount: transaction.amount,
      editType: transaction.type,
      editCreateAt: transaction.createAt
    })
  },

  saveEdit(id) {
    let newTransaction = {
      type: this.state.editType,
      description: this.state.editDescription,
      amount: this.state.editAmount,
      createAt: this.state.editCreateAt
    };

    this.props.updateTransaction(id, newTransaction);
    this.setState({editCreateAt: null});
    this.closeModal();
  },

  deleteTransaction(transaction) {
    let id = transaction.createAt;
    this.props.removeTransaction(id);
  },

  sortByTime(transactions) {
    if(!this.state.sortBtn) {
      this.setState({sortBtn: true});
      let newTransactions = transactions.sort((cur, next) => {
        return ( cur.createAt - next.createAt);
      });
      this.props.sortTransactions(newTransactions);
    } else {
      this.setState({sortBtn: false});
      let newTransactions = transactions.sort((cur, next) => {
        return ( next.createAt - cur.createAt);
      });
      this.props.sortTransactions(newTransactions);
    }
  },

  sortByDescription(transactions) {
    if(!this.state.sortBtn) {
      this.setState({sortBtn: true});
      let newTransactions = transactions.sort((cur, next) => {
        return ( cur.description > next.description) ? 1 : ((next.description > cur.description) ? -1 : 0) ;
      });
      this.props.sortTransactions(newTransactions);
    } else {
      this.setState({sortBtn: false});
      let newTransactions = transactions.sort((cur, next) => {
        return ( cur.description < next.description) ? 1 : ((next.description < cur.description) ? -1 : 0) ;
      });
      this.props.sortTransactions(newTransactions);
    }
  },

  render() {
    let { transactions } = this.props;
    let rows = transactions.map(transaction => {
      let debit = 0;
      let credit = 0;
      if(transaction.type === 'debit'){
        debit = Number(transaction.amount);
      }else{
        credit = Number(transaction.amount);
      }

      return (
        <tr key={transaction.createAt}>
          <td>{moment(transaction.createAt).format('lll')}</td>
          <td>{transaction.description}</td>
          <td>+{numeral(credit).format('0,0')}</td>
          <td>-{numeral(debit).format('0,0')}</td>
          <td>
            <button className="btn btn-primary btn-xs" onClick={() => this.editTransaction(transaction)}>
              <span className="glyphicon glyphicon-edit"></span>
            </button>
          </td>
          <td>
            <button className="btn btn-danger btn-xs" onClick={() => this.deleteTransaction(transaction)}>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </td>
        </tr>
      )
    });

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr className="success tbr">
              <td>Date <span onClick={()=>this.sortByTime(transactions)}>{this.state.sortBtn?'▲':'▼'}</span></td>
              <td>Description <span onClick={()=>this.sortByDescription(transactions)}>{this.state.sortBtn?'▲':'▼'}</span></td>
              <td>Credit</td>
              <td>Debit</td>
              <td>Edit</td>
              <td>Delete</td>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="radio"
              name= "type"
              value="debit"
              onClick={e=>{this.setState({editType: e.target.value})}}
            />
              Debit &nbsp;
            <input
              type="radio"
              name= "type"
              value="credit"
              onClick={e=>{this.setState({editType: e.target.value})}}
            />
              Credit
            <br/>
            <span>AMOUNT: </span>
            <input
              type="number"
              min="0"
              className="form-control"
              id="exampleInputAmount"
              placeholder="Amount"
              value={this.state.editAmount}
              onChange={e => {this.setState({editAmount: e.target.value}) }}
            />
            <br/>
            <span>DESCRIPTION: </span>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={this.state.editDescription}
              onChange={e => {this.setState({editDescription: e.target.value}) }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary" onClick={() => this.saveEdit(this.state.editCreateAt)}>Save</Button>
            <Button onClick={this.cancelEdit}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
});


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
