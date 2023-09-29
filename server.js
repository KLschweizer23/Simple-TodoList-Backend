const express = require('express')

const app = express()

app.use(express.json())

app.listen(8080, '0.0.0.0')