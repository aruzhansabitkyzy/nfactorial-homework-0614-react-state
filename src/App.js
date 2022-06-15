import { useState, useEffect } from "react";
import { v4 as myNewID } from "uuid";

import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];


function App() {
  const local = ()  => {
    let list = localStorage.getItem('todos')
  
    if (list) {
      return JSON.parse(localStorage.getItem('todos'))
    } else {
      return []
    }
  }
  
  const [itemToDo, setItemToDo] = useState("");
  const [items, setItems] = useState(local);
  const [filterType, setFilterType] = useState("all");
  const[filteredData, setFilteredData] = useState([]);
  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  };
 
  const handleAddItem = () => {
    const newItem = { key: myNewID(), label: itemToDo };

    setItems((prevElement) => [newItem, ...prevElement]);
    setItemToDo("");
    
    localStorage.setItem("todos",JSON.stringify(newItem));
    localStorage.getItem('todos')
  };

  useEffect(()=> {
    localStorage.setItem("todos",JSON.stringify(items));
  }, [items]);

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleImportant = ({key})  => {
    setItems((prevItems) => prevItems.map((item) => {
      if(item.key === key) {
        return {...item, important: !item.important};
      }else return item;
    }))
  }
//   const handleImportant = ({key}) => {
//     setItems((prevItems) => 
//     prevItems.map((cur) => {
//       if(cur.key === key) {
//         if(cur.label.indexOf("important") == -1) {
//           console.log(cur.label);
//           return {...cur, label : cur.label + " important"} 
//         }
//         else if(cur.label.indexOf("important") != -1){
//           return {...cur, label: cur.label.replace("important", "")}
//         }
//       }
//       else return cur;
//     }))
// };

  const handleFilterChange = ({ type }) => {
    setFilterType(type);
  };
  const handleSearchingBar = (event)=> {
      let value = event.target.value; 

      const todos = items.filter(todo => {
        return todo.label.indexOf(value) > -1;
      });

      setFilterType("search");
      setFilteredData(todos);
  };
 
  const handleDelete = ({key}) => {
       setItems((prevItems) => {
           return prevItems.filter((item)=> {
                if(item.key != key) {
                  localStorage.removeItem('todos', JSON.stringify(item));
                  return true; 
                }
                return false;
           });
       });


  }
  

  const moreToDo = items.filter((item) => !item.done).length;

  const doneToDo = items.length - moreToDo;

  const filteredArray = filterType === "search" ? filteredData :
  filterType === "all"
                ? items
                : filterType === "done"
                ? items.filter((item) => item.done)
                : items.filter((item) => !item.done) 
    

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {moreToDo} more to do, {doneToDo} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={event => (handleSearchingBar(event))}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`btn btn-info ${
                filterType === item.type ? "" : "btn-outline-info"
              }`}
              onClick={() => handleFilterChange(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredArray.length > 0 &&
          filteredArray.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.done ? "done" : ""}`}>
                <span
                  className={`todo-list-item-label ${(item.important === true) ? "text-warning" : " "}`}
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                  
                </span>

                <button 
                  type="button"
                  key={item.key}
                  className={`btn btn-outline-success btn-sm float-right`}
                  onClick={() => handleImportant(item)} 
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  key = {item.id}
                  onClick = {() => handleDelete(item)}
                  className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
