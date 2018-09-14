import * as React from 'react';
import './Apollo.css';
import './App.css';

import logo from './logo.svg';

import { request } from 'graphql-request';

class App extends React.Component {
  public state = {
    currentError: "",
    currentTodoComplete: false,
    currentTodoId: "",
    currentTodoTitle: "",
    currentTodos: [] as any[],
  }
  public getTodos = () => {
    const query = `
        {
          allTodos(count: 5) {
            id
            title
            completed
          }
        }
      `;
    request('https://fakerql.com/graphql', query).then((data: any) => {
      if (data && data.allTodos) {
        data.allTodos.map((todo: any) => {
          if (todo) {
            const currentTodos = this.state.currentTodos;
            currentTodos.push(todo);
            this.setState({
              ...this.state,
              currentTodos
            })
          }
        });
      }
    });
  }

  public getTodo = (id: string) => {
    const query = `{
      Todo(id: "${id}") {
        id
        title
        completed
      }
    }`;
    request('https://fakerql.com/graphql', query).then((data: any) => {
      if (data && data.Todo) {
        const todo = data.Todo;
        this.setState({
          ...this.state,
          currentTodoComplete: todo.completed,
          currentTodoId: todo.id,
          currentTodoTitle: todo.title
        })
      };
    });
  };
  public closePopup = () => {
    this.setState({
      ...this.state,
      currentError: "",
      currentTodoComplete: false,
      currentTodoId: "",
      currentTodoTitle: "",
    })
  }

  public addTodo = () => {
    const query = `mutation {
      createTodo(title: "Book movie tickets", completed:false) {
        id
        title
        completed
      }
    }`;
    request('https://fakerql.com/graphql', query).then((data: any) => {
      if (data && data.createTodo) {
        const todo = data.createTodo;
        const currentTodos = this.state.currentTodos;
        currentTodos.push(todo);
        this.setState({
          ...this.state,
          currentTodos
        })
      };
    });
  }

  public updateTodo = () => {
    const query = `mutation {
      updateTodo(id: "${this.state.currentTodoId}", completed:${!this.state.currentTodoComplete}) {
        id
        title
        completed
      }
    }`;
    request('https://fakerql.com/graphql', query).then((data: any) => {
      if (data && data.updateTodo) {
        const updateTodo = data.updateTodo;
        const currentTodos = this.state.currentTodos;
        currentTodos.map((todo: any) => {
          if (todo.id === updateTodo.id) {
            todo.completed = updateTodo.completed
          }
        })
        this.setState({
          ...this.state,
          currentError: "",
          currentTodoComplete: false,
          currentTodoId: "",
          currentTodoTitle: "",
          currentTodos,
        })
      }
    });
  }

  public componentDidMount() {
    this.getTodos();
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Apollo graphQL</h1>
        </header>
        {this.state.currentTodos && this.state.currentTodos.length === 0 &&
          <div className="todosContainer">Todo list is loading...</div>}
        {this.state.currentTodos && this.state.currentTodos.length > 1 &&
          <div className="todosContainer">
            {this.state.currentTodos.map((todo: any) => {
              const onClick = () => { this.getTodo(todo.id) }
              return (
                <div key={todo.id} className={todo.completed ? "TodoStyle completed" : "TodoStyle"}>
                  <div onClick={onClick}>{`${todo.title}`}</div>
                </div>
              )
            })
            }
          </div>
        }
        <div className="addTodo" onClick={this.addTodo}>Add todo</div>
        {(this.state.currentTodoId && this.state.currentTodoTitle) &&
          <div className="TodoPopup">
            <div className="TodoPopupContainer">
              <div className="TodoPopupTitle">{this.state.currentTodoTitle}</div>
              <div className="TodoPopupComplete" onClick={this.updateTodo}>Complete</div>
              <div className="TodoClose" onClick={this.closePopup}>x</div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
