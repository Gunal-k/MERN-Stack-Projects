//Using Express
const express = require( 'express');
const mongoose = require('mongoose');
const cors = require("cors");

//create an instance of express
const app = express();

//express middleware
app.use(express.json());
app.use(cors())

// //Define a route
// app.get('/',(req, res) => {
//     res.send("Hello, World!")
// } )

//connecting db
mongoose.connect('mongodb://localhost:27017/Todo-List')
.then(() => {
    console.log("DB connected!");
})
.catch((error)=>{
    console.log(error);
})

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type: String
    },
    description: String
})

//creating Schema
const todoModel = mongoose.model('Todo',todoSchema);

//Sample in-memory storage for todo items
// let todos = [];

//Create a new todo item
app.post('/todos',async (req,res) => {
    const {title,description} = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // }
    // todos.push(newTodo);
    // console.log(todos);

    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);    
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})

//trying to create a delete router (own code)
app.delete('/todos/:id', async(req,res) => {
    // const {id} = req.body;
    // todos.splice(id-1,1);
    // console.log(todos);
    // res.status(201).send("Item Deleted");

    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

//get router
app.get('/todos', async (req,res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

//update router
app.put('/todos/:id',async (req,res) => {
    try {
        const {title,description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true} // to send updated data else it will return old data
        )
        if(!updatedTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.status(201).json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})

//start the server
const port = 8000;
app.listen(port,() => {
    console.log("Server is Running on port "+port);
})