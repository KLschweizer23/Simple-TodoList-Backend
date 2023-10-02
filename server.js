/*
    Hi, This is Ken Lloyd's Work

    To run while in staging area, run the following command:
    `npm run devStart`
    To trigger Nodemon for easier editing

    Below I created a Basic To-Do List Back-end that can do the following:
        1. Add To-Do Item
        2. Update Task of To-Do Item
        3. Toggle Check Status of To-Do Item
        4. Delete To-Do Item
        5. Get All To-Do Items
    
    Data Structure is:
    data = {
        :id {
            id          - Unique ID by getting the time and date,
            task        - Task of the To-Do Item
        }
    }

    Added Middleware to check for common errors to minimize duplications
    Added Proper Status Code Errors

    APIs:
    1. /api/get-all-data - Returns all data
    2. /api/add-data (body: task) - Adds data with the task
    3. /api/update-data/:id (body: task) - Updates data with the task base on id
    4. /api/update-checked/:id - Updates and toggles the todo item if checked or not
    5. /api/delete-data/:id - Deletes data base on the id
*/

const express = require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

//ToDo Data
const data = {}

//API ENDPOINTS

//Retrieve all data
app.get('/api/get-all-data', (req, res) => {
    let data = returnData()
    let message = data.length == 0 ? "ToDo List is empty!" : "success"
    res.send({ response: message, list_todos: data })
})

//Add data
//body should contain "task"
app.post('/api/add-data', checktask, async (req, res) => {
    let task = req.body.task
    
    if(!addData(task)){
        res.status(500).json({ response: "Something went wrong..." , list_todos: returnData() })
        return
    }
    
    res.send({ response: "success", list_todos: returnData() })

    // displayData()
})

//Edit or Update task
//body should contain "task" and "id"
app.post('/api/update-task', checkId, checktask, async (req, res) => {
    const dataItem = data[req.body.id]
    const newtask = req.body.task

    dataItem.task = newtask

    if(!updateData(dataItem)){
        res.status(500).json({ response: "Something went wrong...", list_todos: returnData() })
        return
    }
    
    res.send({ response: "success", todos: returnData() })

    // displayData()
})

//Delete Data
//Add the id in the parameter
app.delete('/api/delete-data/:id', checkId, async (req, res) => {
    const id = req.params.id

    delete data[id]

    if(data[id] != null){
        res.status(500).json({ response: "Something went wrong...", list_todos: returnData() })
        return
    }
    
    res.send({ response: "success", list_todos: returnData() })

    // displayData()
})

//FUNCTIONS
//Display data to the terminal
function displayData(){
    console.log("data:")
    console.log(data)
}

function returnData(){
    var arrayData = []
    let count = 0
    for(const id in data){
        arrayData.push(data[id])
        count++
    }
    return arrayData
}

function addData(task){
    const dataToAdd = {}
    dataToAdd.id = getAvailableId()
    dataToAdd.task = task
    data[dataToAdd.id] = dataToAdd
    return data[dataToAdd.id] != null
}

function updateData(newData){
    data[newData.id] = newData
    return data[newData.id].task == newData.task
}

function getAvailableId(){
    const currentDate = new Date()
    const idDate = currentDate.toISOString().replace(/[-T:.Z]/g, '')
    return idDate
}

//Middleware
function checkId(req, res, next){
    const foundData = String(req.originalUrl).match("update") ? data[req.body.id] : data[req.params.id]
    if(!foundData){
        res.status(404).json({ response: "Item not found!", list_todos: returnData() })
        return
    }
    next()
}

function checktask(req, res, next){
    if(!req.body.task){
        res.status(400).json({ response: "Task should not be empty!", list_todos: returnData()  })
        return
    }
    next()
}

app.listen(8080, '0.0.0.0')