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
app.post('/api/add-data', async (req, res) => {
    let title = req.body.title
    if(!title){
        res.status(400).json({ error: "Cannot add empty title." })
        return
    }
    const isAdded = addData(title)
    if(!isAdded){
        res.status(500).json({ error: "Something went wrong..." })
        return
    }
    res.status(201).json({ message: "ToDo Item successfully added!" })

    //Display data to the terminal
    console.log("data:")
    console.log(data)
})

function addData(title){
    const dataToAdd = {}
    dataToAdd.id = getAvailableId()
    dataToAdd.title = title
    dataToAdd.createdAt = getCurrentDateTime()
    dataToAdd.modifiedAt = getCurrentDateTime()
    data[dataToAdd.id] = dataToAdd
    return data[dataToAdd.id] != null
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

app.listen(8080, '0.0.0.0')