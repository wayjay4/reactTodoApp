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
    axios.get('http://localhost:8080/list')
    .then(res => {
      //console.log("componentDidMount response:");
      //console.dir(res.data);

      // convert response to an array
      var dataArray = [];
      Object.keys(res.data).map(key =>
        dataArray.push({
          id: key,
          title: res.data[key],
          completed: false
        })
      );

      this.setState({todos: dataArray});
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
    axios.delete(`http://localhost:8080/entry/${id}`)
    .then(res => {
      this.setState({ todos: [...this.state.todos.filter(todo => todo.id !== id)] });
    });
  }

  // add todo
  addTodo = (title) => {
    const newTodo = {
      id: uuid.v4(),
      title,
      completed: false
    }

    axios.put(`http://localhost:8080/entry/${newTodo.id}/${newTodo.title}/${newTodo.completed}`, {
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


    //{
      //id: uuid.v4(),
      //title: 'Take out the trash',
      //completed: false
    //},
    //{
      //id: uuid.v4(),
      //title: 'Dinner with girlfriend',
      //completed: false
    //},
    //{
      //id: uuid.v4(),
      //title: 'Meeting the client',
      //completed: false
    //}

    //const newTodo = {
      //id: uuid.v4(),
      //title,
      //completed: false
    //}

    //axios.post('https://jsonplaceholder.typicode.com/todos', {
      //title,
      //completed: false
    //})
    //.then(res => {
      //this.setState({ todos: [...this.state.todos, res.data] });
    //});

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

export default App;
