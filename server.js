/*
    Hi, This is Ken Lloyd's Work

    To run while in staging area, run the following command:
    `npm run devStart`
    To trigger Nodemon for easier editing

    Below I created a Basic To-Do List Back-end that can do the following:
        1. Add To-Do Item
        2. Update Title of To-Do Item
        3. Toggle Check Status of To-Do Item
        4. Delete To-Do Item
        5. Get All To-Do Items
    
    Data Structure is:
    data = {
        :id {
            id          - Unique ID by getting the time and date,
            title       - Title of the To-Do Item,
            checked     - Status of the To-Do Item if done or not,
            createdAt   - Records the date and time To-Do Item is created,
            modifiedAt  - Records the date and time To-Do Item last modified 
        }
    }

    Added Middleware to check for common errors to minimize duplications
    Added Proper Status Code Errors
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
    res.send({ todos: data })
})

//Add data
//body should contain "title"
app.post('/api/add-data', checkTitle, async (req, res) => {
    let title = req.body.title
    
    if(!addData(title)){
        res.status(500).json({ error: "Something went wrong..." })
        return
    }
    
    res.send({ todos: returnData() })

    // displayData()
})

//Edit or Update title
//Add the id in the parameter
//body should contain "title"
app.post('/api/update-title/:id', checkId, checkTitle, async (req, res) => {
    const dataItem = data[req.params.id]
    const newTitle = req.body.title

    dataItem.title = newTitle

    if(!updateData(dataItem)){
        res.status(500).json({ error: "Something went wrong..." })
        return
    }
    
    res.send({ todos: returnData() })

    // displayData()
})

//Edit or Update checked
//Every time this api is called, automatically change the checked value to opposite value
app.post('/api/update-checked/:id', checkId, async(req, res) => {
    const dataItem = data[req.params.id]

    dataItem.checked = !dataItem.checked

    if(!updateData(dataItem)){
        res.status(500).json({ error: "Something went wrong..." })
        return
    }
    
    res.send({ todos: returnData() })

    // displayData()
})

//Delete Data
//Add the id in the parameter
app.delete('/api/delete-data/:id', checkId, async (req, res) => {
    const id = req.params.id

    delete data[id]

    if(data[id] != null){
        res.status(500).json({ error: "Something went wrong..." })
        return
    }
    
    res.send({ todos: returnData() })

    // displayData()
})

//FUNCTIONS
//Display data to the terminal
function displayData(){
    console.log("data:")
    console.log(data)
}

function returnData(){
    const modifiedData = {}
    for(const id in data){
        modifiedData[id] = {}
        modifiedData[id].title = data[id].title
        modifiedData[id].checked = data[id].checked
    }
    return modifiedData
}

function addData(title){
    const dataToAdd = {}
    dataToAdd.id = getAvailableId()
    dataToAdd.title = title
    dataToAdd.checked = false
    dataToAdd.createdAt = getCurrentDateTime()
    dataToAdd.modifiedAt = getCurrentDateTime()
    data[dataToAdd.id] = dataToAdd
    return data[dataToAdd.id] != null
}

function updateData(newData){
    newData.modifiedAt = getCurrentDateTime()
    data[newData.id] = newData
    return data[newData.id].title == newData.title && data[newData.id].checked == newData.checked
}

function getAvailableId(){
    const currentDate = new Date()
    const idDate = currentDate.toISOString().replace(/[-T:.Z]/g, '')
    return idDate
}

function getCurrentDateTime(){
    const currentDateTime = new Date()
    const isoDate = currentDateTime.toISOString();
    return isoDate;
}

//Middleware
function checkId(req, res, next){
    if(!data[req.params.id]){
        res.status(404).json({ error: "Item not found!" })
        return
    }
    next()
}

function checkTitle(req, res, next){
    if(!req.body.title){
        res.status(400).json({ error: "Title should not be empty!" })
        return
    }
    next()
}

app.listen(8080, '0.0.0.0')