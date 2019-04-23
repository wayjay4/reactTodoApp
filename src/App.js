import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import Header from './components/layout/Header';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';
import About from './components/pages/About';
import uuid from 'uuid';
import axios from 'axios';

class App extends Component {
  state = {
    todos: []
  }

  componentDidMount(){
    // get todo data list from api server, then save to state
    axios({
      url: `http://${apiAddr}/todo`,
      method: 'get'
    })
    .then(res => {
      // convert response to an array
      var dataArray = [];
      Object.keys(res.data.todos).map(key => {
        // convert completed String to boolean
        var completed;
        (String(res.data.todos[key].completed) === "true") ? completed = true : completed = false;

        // add todo to dataArray
        dataArray.push({
          id: res.data.todos[key].id,
          title: res.data.todos[key].title,
          completed: completed
        })
        return dataArray;
      });

      // save todo dataArray to state
      this.setState({todos: dataArray});
    })
    .catch(function (error) {
      // handle error
      console.log("There was an error: ");
      console.dir(error);
    });

  }

  // toggle complete
  toggleComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if(todo.id === id){
        todo.completed = !todo.completed;
      }
      return todo;
    }) })
  }

  // delete todo
  delTodo = (id) => {
    axios.delete(`http://${apiAddr}/todo/${id}`)
    .then(res => {
      this.setState({ todos: [...this.state.todos.filter(todo => todo.id !== id)] });
    })
    .catch(function (error) {
      // handle error
      console.log("There was an error: ");
      console.dir(error);
    });
  }

  // add todo
  addTodo = (title) => {
    const newTodo = {
      id: uuid.v4(),
      title,
      completed: false
    }

    axios.put(`http://${apiAddr}/todo/${newTodo.id}/${newTodo.title}/${newTodo.completed}`, {
      testKey: newTodo.id,
      testTitle: newTodo.title,
      testCompleted: newTodo.completed
    })
    .then(res => {
      console.log("api response:");
      console.dir(res.data);
      this.setState({ todos: [...this.state.todos, newTodo] });
    })
    .catch(function (error) {
      // handle error
      console.log("There was an error: ");
      console.dir(error);
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Header />

            <Route exact path="/" render={props => (
              <React.Fragment>
                <AddTodo addTodo={this.addTodo} />
                <Todos todos={this.state.todos} toggleComplete={this.toggleComplete} delTodo={this.delTodo} />
              </React.Fragment>
            )} />

            <Route path="/about" component={About} />

          </div>
        </div>
      </Router>
    );
  }
}

const apiAddr = "localhost:8080";
//const apiAddr = "54.200.156.39"

export default App;
