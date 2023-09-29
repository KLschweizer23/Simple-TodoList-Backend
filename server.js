const express = require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

//ToDo Data
const data = {}

//API ENDPOINTS

//Retrieve all data
app.get('/api/get-all-data', (req, res) => {
    res.send({ data })
})

//Add data
//body should contain "title"
app.post('/api/add-data', checkTitle, async (req, res) => {
    let title = req.body.title
    
    if(!addData(title)){
        res.status(500).json({ error: "Something went wrong..." })
        return
    }

    res.status(201).json({ message: "ToDo Item was successfully added!" })

    displayData()
})

//Edit or Update data
//Add the id in the parameter
//body should contain "title"
app.post('/api/update-data/:id', checkId, checkTitle, async (req, res) => {
    const dataItem = data[req.params.id]
    const newTitle = req.body.title
    if(!newTitle){
        res.status(400).json({ error: "Title should not be empty!" })
        return
    }

    dataItem.title = newTitle
    if(!updateData(dataItem)){
        res.status(500).json({ error: "Something went wrong..." })
        return
    }

    res.status(201).json({ message: "ToDo Item was successfuly updated!" })

    displayData()
})

//FUNCTIONS
//Display data to the terminal
function displayData(){
    console.log("data:")
    console.log(data)
}

function addData(title){
    const dataToAdd = {}
    dataToAdd.id = getAvailableId()
    dataToAdd.title = title
    dataToAdd.createdAt = getCurrentDateTime()
    dataToAdd.modifiedAt = getCurrentDateTime()
    data[dataToAdd.id] = dataToAdd
    return data[dataToAdd.id] != null
}

function updateData(newData){
    newData.modifiedAt = getCurrentDateTime()
    data[newData.id] = newData
    return data[newData.id].title == newData.title
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
        res.status(404).json({ message: "Item not found!" })
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