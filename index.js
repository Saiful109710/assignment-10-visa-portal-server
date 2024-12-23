const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000

const uri = "mongodb+srv://visa-application:G3JWiajjK01v8Db2@cluster0.92ej0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });



// middleware
app.use(express.json())
app.use(cors())



async function run(){
    try{
            const visaInfo = client.db('visaInfo').collection('visaType')

            app.post('/allVisa',async(req,res)=>{
                const data = req.body;
                const result = await visaInfo.insertOne(data);
                res.send(result);

            })

            app.get('/allVisa',async(req,res)=>{
                const result = await visaInfo.find().toArray();
                res.send(result)
            })

            app.get('/latestVisa',async(req,res)=>{
                const result = await visaInfo.find().limit(6).toArray();
                res.send(result)

            })

    }catch(err){
        console.log(err)
    }

    console.log('connect to db')
}

run()


app.get('/',(req,res)=>{
    res.send("server is running")
})

app.listen(port,()=>{
    console.log(`serrver is running on port ${port}`)
})
