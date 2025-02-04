import { useState } from "react"

export default function Todo(){
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [todos,setTodos] = useState([])
    const [error,setError] = useState("")
    const [message,setMessage] = useState("")

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
            }).then((res)=> {
                if(res.ok){
                    //add item to list
                    setTodos([...todos,{title, description}])
                    setMessage("Todo item created successfully");
                    setTimeout(()=> {
                        setMessage("")
                    },3000)
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
            },3000)
        }
    }
    return <>
        <div className="row p-3 bg-success text-light text-center">
            <h1>ToDo Project with MERN stack</h1>
        </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input className="form-control" type="text" onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
                <input className="form-control" type="text" onChange={(e)=>setDescription(e.target.value)} placeholder="Description" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
    </>
}
