import React from "react";

const ListItem = ({item, deleteItem, editItem, toggleComplete}) =>{
    const classForTitle = item.completed? "title striken": "title";
    return(
        <div className="task-wrapper flex-wrapper">
            <div style={{flex:7}}>
                <span className={classForTitle} onClick={()=>toggleComplete(item)}>{item.title}</span>
            </div>
            <div style={{flex:1}}>
                <button className="btn btn-sm btn-outline-info edit" onClick={()=>editItem(item)}>Edit</button>
            </div>
            <div style={{flex:1}}>
                <button className="btn btn-sm btn-outline-dark delete" onClick={()=>deleteItem(item)}>-</button>
            </div>

        </div>
    )

}

export default ListItem;