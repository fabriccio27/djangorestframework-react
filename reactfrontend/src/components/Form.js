import React from 'react';

function Form({handleSubmit, handleChange, activeItem}) {
    return (
        <form id="form" onSubmit={(ev)=>{handleSubmit(ev)}}>
                  <div className="flex-wrapper">

                      <div style={{flex:6}}>
                          <input 
                          type="text" 
                          className="form-control" 
                          name="title" 
                          id="title"
                          value={activeItem.title} 
                          onChange={(ev)=>handleChange(ev)}
                          placeholder="Agregar tarea..." />
                      </div>
                      <div style={{flex:1}}>
                          <input type="submit" value="Agregar" className="btn" id="submit-btn" />
                      </div>

                  </div>
              </form>
    );
}

export default Form;