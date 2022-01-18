require('dotenv').config()
const express = require('express')
const app = express()
const useRouter = require('./routes/userRouter')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect(process.env.MONGO_CONNECTION_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error) => {
        if (error) {
            console.log(error)
        } else {
            console.log('connection ready')
        }
    })
app.use(cors())

app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    next()
})




app.use(express.urlencoded({ extended: true }))

app.use('/market', express.json(), useRouter)

app.listen(process.env.PORT, () => { console.log('Server Running') })
