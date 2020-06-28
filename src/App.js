import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Server from './constants/server';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

// class Welcome extends React.Component {
//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { cartId: "", showModal: true, selected: "", ids: [], edit: false, items: [], newItem: false };
  }

  componentDidMount() {
    //get IDs from server. use them to generate dropdown options
    let requestOptions = {
      method: 'GET'
    };
    let url = `${Server.IP}/carts`;
    fetch(url, requestOptions).then((response) => {
      response.json().then((data) => {
        console.log("cart list", data)
        this.setState({ids: data});
      });
      
    }).catch((err) => {
      console.log('Fetch Error :-S', err);
    });
  }
  handleSelection = () => {
    this.setState({showModal: false});
    //get the items
    let requestOptions = {
      method: 'GET'
    };
    let url = `${Server.IP}/carts/${this.state.selected}`;
    fetch(url, requestOptions).then((response) => {
      response.json().then((data) => {
        console.log("item list", data)
        this.setState({items: data.items});
      });
      
    }).catch((err) => {
      console.log('Fetch Error :-S', err);
    });
  }

  add = () => {
    //call POST endpoint

    let {newItem, selected, items} = this.state;

    newItem["cart_id"] = selected;

    //call PUT endpoint
    let url = `${Server.IP}/items`;
    let header = {};
    header["Content-Type"] = "application/json; charset=utf-8";
    let requestOptions = {
      method: 'POST',
      headers: header,
      body: JSON.stringify(newItem)
    };
    fetch(url, requestOptions).then((response) => {
      console.log("POST", response)
      if (Array.isArray(items)) items.push(newItem);
      else items = [newItem];
      this.setState({items: items});
    }).catch((err) => {
      console.log('Fetch Error :-S', err);
    });
    
    this.setState({newItem: false});
  }

  update = () => {
    let {edit} = this.state;

    //call PUT endpoint
    let url = `${Server.IP}/items/${edit.id}`;
    let header = {};
    header["Content-Type"] = "application/json; charset=utf-8";
    let requestOptions = {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(edit)
    };
    fetch(url, requestOptions).then((response) => {
      console.log("put", response)
    }).catch((err) => {
      console.log('Fetch Error :-S', err);
    });

    this.setState({edit: false});
  }

  delete = id => {
    let {items} = this.state;

    //call deletion endpoint
    //call PUT endpoint
    let url = `${Server.IP}/items/${id}`;
    let requestOptions = {
      method: 'DELETE'
    };
    fetch(url, requestOptions).then((response) => {
      console.log("DELETE", response)
      let output = items.filter(item => {
        if (item.id === id) return false;
        return true;
      })
      this.setState({items: output});
    }).catch((err) => {
      console.log('Fetch Error :-S', err);
    });
  }

  render() {

    let {ids, items, selected, edit, newItem} = this.state;

    let rows = items.map(item => {
      return (
        <tr>
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td>{item.price}</td>
          <td>{item.quantity}</td>
          <td><Button onClick={() => this.setState({edit: item})}>Edit</Button></td>
          <td><Button onClick={() => this.delete(item.id)}>Delete</Button></td>
        </tr>
      )
    })

    return (
      <div>
        <header className="App-header">
        <Button onClick={() => this.setState({newItem: {}})}>Add new</Button>
        <Table striped bordered hover style={{color: "white"}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
        <Modal show={this.state.showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <p>Pick a shopping card ID.</p>
            {ids.length > 0 && (
              <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {this.state.selected}
              </Dropdown.Toggle>

              <Dropdown.Menu >
                {ids.map(item => <Dropdown.Item onSelect={() => this.setState({selected: item})} active={this.state.selected === item}>{item}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
            )}
            
          </Modal.Body>
  
          <Modal.Footer>
            <Button variant="secondary" disabled={!selected} onClick={() => this.handleSelection()}>{ids.length == 0 ? "Loading..." : "Select"}</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={newItem}>
          <Modal.Header closeButton>
            <Modal.Title>Edit an item.</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <FormControl
              value={newItem.name}
              placeholder={"Name"}
              onChange={newName => {
                let newVal = newItem;
                newVal.name = newName.currentTarget.value;
                this.setState({newItem: newVal});
              }}
            />
            <FormControl
              value={newItem.description}
              placeholder={"Description"}
              onChange={newDescription => {
                let newVal = newItem;
                newVal.description = newDescription.currentTarget.value;
                this.setState({newItem: newVal});
              }}
            />      
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={newItem.price}
                placeholder={"Price"}
                onChange={newPrice => {
                  let newVal = newItem;
                  newVal.price = newPrice.currentTarget.value;
                  this.setState({newItem: newVal});
                }}
              />
            </InputGroup>
            <FormControl
              value={newItem.quantity}
              placeholder={"Quantity"}
              onChange={newQuantity => {
                console.log("new quantity ", newQuantity.currentTarget.value)
                let newVal = newItem;
                newVal.quantity = newQuantity.currentTarget.value;
                this.setState({newItem: newVal});
              }}
            />
            
          </Modal.Body>
  
          <Modal.Footer>
            <Button variant="secondary" disabled={!selected} onClick={() => this.add()}>{"Save"}</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={edit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit an item.</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <FormControl
              value={edit.name}
              onChange={newName => {
                let newVal = edit;
                newVal.name = newName.currentTarget.value;
                this.setState({edit: newVal});
              }}
            />
            <FormControl
              value={edit.description}
              onChange={newDescription => {
                let newVal = edit;
                newVal.description = newDescription.currentTarget.value;
                this.setState({edit: newVal});
              }}
            />      
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={edit.price}
                onChange={newPrice => {
                  let newVal = edit;
                  newVal.price = newPrice.currentTarget.value;
                  this.setState({edit: newVal});
                }}
              />
            </InputGroup>
            <FormControl
              value={edit.quantity}
              onChange={newQuantity => {
                console.log("new quantity ", newQuantity.currentTarget.value)
                let newVal = edit;
                newVal.quantity = newQuantity.currentTarget.value;
                this.setState({edit: newVal});
              }}
            />
            
          </Modal.Body>
  
          <Modal.Footer>
            <Button variant="secondary" disabled={!selected} onClick={() => this.update()}>{"Save"}</Button>
          </Modal.Footer>
        </Modal>

        </header>
      </div>
    );
  }
  
}

export default App;
