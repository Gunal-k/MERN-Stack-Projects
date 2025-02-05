import { useState , useEffect} from "react"

export default function Todo(){
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [todos,setTodos] = useState([])
    const [error,setError] = useState("")
    const [message,setMessage] = useState("")
    const [editId,setEditId] = useState(-1)
    const [edittitle,setEditTitle] = useState("")
    const [editdescription,setEditDescription] = useState("")

    const apiUrl = "http://localhost:8000"

    const handleSubmit = ()=>{
        setMessage("")
        //check inputs
        if(title.trim() !=='' && description.trim() !==''){
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title, description})
            }).then((res)=> res.json() )
            .then((newTodo)=>{
                if(newTodo._id){
                    //add item to list
                    setTodos([...todos,newTodo])
                    setTitle("")
                    setDescription("")
                    setMessage("Todo item created successfully");
                    setTimeout(()=> {
                        setMessage("")
                    },4000)
                }
                else{
                    //set error
                    setError("Unable to create Todo item")
                }
            }).catch((error)=>{
                setError(error)
            })
        }
        else {
            setError("inputs are empty")
            setTimeout(()=>{
                setError("")
            },4000)
        }
    }
    useEffect(()=>{
        getItems()
    },[])

    const getItems = ()=> {
        fetch(apiUrl+"/todos")
        .then((res)=> res.json())
        .then((res)=>{
            setTodos(res)
        })
    }

    const handleUpdate = () => {
        setMessage("")
        if(edittitle.trim() !=='' && editdescription.trim() !==''){
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title: edittitle, description: editdescription})
            }).then((res)=> {
                if(res.ok){
                    //update item to list
                    const updatedTodos = todos.map((item)=>{
                        if(item._id==editId){
                            item.title = edittitle;
                            item.description = editdescription;
                        }
                        return item
                    });

                    setTodos(updatedTodos);
                    setEditTitle("")
                    setEditDescription("")
                    setMessage("Todo item updated successfully");
                    setTimeout(()=> {
                        setMessage("")
                    },4000)
                    setEditId(-1);
                }
                else{
                    //set error
                    setError("Unable to update Todo item")
                }
            }).catch((error)=>{
                setError(error)
            })
        }
        else {
            setError("inputs are empty")
        }
        setTimeout(()=> {
            setError("")
        },4000)
        setEditId(-1);
    }

    const handleDelete = (id) => {
        setMessage("")
        if(window.confirm("Are you sure want to delete")){
            fetch(apiUrl+"/todos/"+id,{
                method:"DELETE",
            }).then((res)=> {
                if(res.ok){
                    //update item to list
                    const updatedTodos = todos.filter(todo => todo._id !== id)
                    setTodos(updatedTodos);
                    setMessage("Todo item Deleted successfully");
                    setTimeout(()=> {
                        setMessage("")
                    },4000)
                }
                else{
                    //set error
                    setError("Unable to Delete Todo item")
                }
            }).catch((error)=>{
                setError(error)
            })
            setTimeout(()=> {
                setError("")
            },4000)
        }
    }

    const handleEdit = (item)=> {
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description); 
    }

    return <>
        <div className="row p-3 bg-success text-light text-center">
            <h1>ToDo List Project with MERN stack</h1>
        </div>
        <div className="row">
            <h3 className="mt-2">Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input className="form-control" type="text" onChange={(e)=>setTitle(e.target.value)} value={title} placeholder="Title" />
                <input className="form-control" type="text" onChange={(e)=>setDescription(e.target.value)} value={description} placeholder="Description" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3 className="mt-2">Tasks</h3>
            <ul className="list-group">
                {
                    todos.map((item) => <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                                            <div className="d-flex flex-column">
                                                {
                                                    editId == -1 || editId != item._id  ?<>
                                                        <span className="fw-bold">{item.title}</span>
                                                        <span>{item.description}</span>
                                                    </>:
                                                    <>
                                                        <div className="form-group d-flex gap-2">
                                                            <input className="form-control" type="text" onChange={(e)=>setEditTitle(e.target.value)} value={edittitle}/>
                                                            <input className="form-control me-3" type="text" onChange={(e)=>setEditDescription(e.target.value)} value={editdescription} />
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            <div className="d-flex gap-2">
                                                {
                                                editId == -1 || editId != item._id ?<>
                                                    <button className="btn-warning btn" onClick={()=>handleEdit(item)}>Edit</button>
                                                    </> : <>
                                                        <button className="btn-warning btn" onClick={handleUpdate}>Update</button>
                                                    </>
                                                }
                                                {
                                                    editId == -1 || editId != item._id ?<>
                                                        <button className="btn-danger btn" onClick={()=>handleDelete(item._id)}>Delete</button>
                                                    </>:
                                                    <>
                                                        <button className="btn-danger btn" onClick={()=>setEditId(-1)}>Cancel</button>
                                                    </>
                                                }
                                                
                                            </div>
                                        </li>
                    )
                }
            </ul>

        </div>
    </>

}