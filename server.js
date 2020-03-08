const express = require('express')
const db = require('./db')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/api/people', async(req, res, next) => {
    try {
       res.send(await db.models.Person.findAll()) 
    } catch (error) {
        next(err)
    }
})
app.get('/api/places', async(req, res, next) => {
    try {
       res.send(await db.models.Place.findAll()) 
    } catch (error) {
        next(err)
    }
})
app.get('/api/things', async(req, res, next) => {
    try {
       res.send(await db.models.Thing.findAll()) 
    } catch (error) {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({message: err.message})
})
db.syncAndSeed()
    .then(() => app.listen(port, () => console.log(`listening on port ${port}`)))
