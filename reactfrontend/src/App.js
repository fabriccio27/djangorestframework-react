import React from "react";
import './App.css';

import ListItem from "./components/ListItem";
import Form from "./components/Form";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toDoList:[],
      activeItem:{
        id:null,
        title:"",
        completed:false
      },
      editing:false,
    }

    this.fetchData = this.fetchData.bind(this);
    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleComplete =  this.toggleComplete.bind(this);
    this.getCookie = this.getCookie.bind(this);

  }
  
  componentDidMount(){
    this.fetchData();
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
  



  toggleComplete(item){
    
    const url = `http://127.0.0.1:8000/api/task-update/${item.id}`;

    fetch(url, {
      method:"POST",
      headers:{
        "Content-type":"application/json",
        "X-CSRFToken": this.getCookie('csrftoken')
      },
      body:JSON.stringify({
        ...item,
        completed:!item.completed
      })
    })
    .then(()=>{
      this.fetchData();
    })
    .catch((err)=>console.log(`This happened while trying to toggle completed status: \n ${err}`));

    
  }

  fetchData(){
    console.log("Fetching data from api...");
    fetch("http://127.0.0.1:8000/api/task-list")
    .then(resp=>resp.json())
    .then(data=>{
      
      this.setState(()=>{
        return {
          toDoList:data
        }
      })
    })
    .catch(err=>console.log(`this happened while fetching data from api:\n${err}`));
  };

  editItem(item) {
    console.log(`Trying to edit item ${item.id}`);
    
    /* esto tiene que modificar el recurso?, si, pero con el submit del form en realidad, 
    aca seteo que item estoy editando en state */
    this.setState(()=>({
      activeItem:{
        id:item.id,
        title:item.title
      },
      editing:true
      //esto me va a permitir saber en handleSubmit si tengo que usar url de update o de create
    }))

  };

  deleteItem(item){
    console.log(`Trying to remove item ${item.id}`)
    const url = `http://127.0.0.1:8000/api/task-delete/${item.id}`;
    fetch(url, {
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
        "X-CSRFToken": this.getCookie('csrftoken')

      }
    })
    .then(()=>{
      this.fetchData();
    })
    .catch(err=>console.log("Esto pasó tratando de borrar elemento:\n ", err));
  };

  handleChange(ev){
    this.setState((prevState)=>{
      return {
        activeItem:{
          //aca tengo que clonar el estado previo, si no pierdo el id cuando quiera actualizar en handleSubmit
          ...prevState.activeItem,
          title:ev.target.value
        }
      }
    });
  }

  handleSubmit(ev){
    ev.preventDefault();
    //aca tengo que modificar el recurso con api call, y segun si estoy editando o creando
    let url = `http://127.0.0.1:8000/api/task-create`;
    if (this.state.editing){
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}`;
      this.setState(()=>({
        editing:false
      }))
    }
    fetch(url, {
      method:"POST",
      headers:{
        "Content-type":"application/json",
        "X-CSRFToken": this.getCookie('csrftoken')

      },
      body:JSON.stringify(this.state.activeItem)
      //si estoy creando activeItem tiene id:null
    })
    .then(()=>{
      this.fetchData();
      this.setState(()=>{
        return {
          activeItem:{
            id:null,
            title:"",
            completed:false
          }
        }
      })
    })
    .catch(err=>console.log(`This happened trying to create/update: \n${err}`));
    
  }

  render(){
    return(
      <div className="container">

        <div id="task-container">
          <div id="form-wrapper">
            <Form activeItem={this.state.activeItem} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>
          </div>
          <div id="list-wrapper">
            {
              this.state.toDoList.map((item, idx)=>{
                return (
                  <ListItem 
                  key={idx} 
                  item={item} 
                  editItem={this.editItem} 
                  deleteItem={this.deleteItem} 
                  toggleComplete={this.toggleComplete}/>
                )
              })
            }
          </div>

        </div>
      </div>
    )
  }
}

export default App;
