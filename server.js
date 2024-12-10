import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()


//Initialize Express add
const app = express()
const PORT = 5001

//middleware
app.use(bodyParser.json())

//mongodb connection
const mongoURI = process.env.MONGODBURI
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongodb connection error: '))
db.once('open', ()=>{
    console.log('Connected to mongodb')
})


//mongo schema
const dataSchema = new mongoose.Schema({
    isGamer: {type: Boolean, required: true},
    age: {type: Number, required: true},
    reactionTime: {type: Number, required: true},
    gender: {type: String, required: true}
})


const Data = mongoose.model('Data', dataSchema)


//Routes
app.post('/reaction-data', async(req, res)=>{
    try{
        const { isGamer, age, reactionTime, gender } = req.body

        console.log(`came here and the data are ${isGamer}, ${age}, ${reactionTime}, ${gender}`)


        //save data to database
        const newData = new Data({isGamer, age, reactionTime, gender})
        await newData.save()

        res.status(201).json({message: 'Data saved', data: newData})

    }catch(error){
        res.status(500).json({error: 'Internal server error', details: error.message})
    }
})




//start the server
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})