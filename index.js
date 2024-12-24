const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
            const visaApplicationData =client.db('visaInfo').collection('visaApplicationData') 

            app.post('/allVisa',async(req,res)=>{
                const data = req.body;
                const result = await visaInfo.insertOne(data);
                res.send(result);

            })

            app.post('/visaApplication',async(req,res)=>{
                const data = req.body;
                const result = await visaApplicationData.insertOne(data);
                res.send(result)
            })

            app.get('/allVisa',async(req,res)=>{
                const result = await visaInfo.find().toArray();
                res.send(result)
            })

            app.get('/allVisa/:id',async(req,res)=>{
                    const id = req.params.id
                    const query = {_id:new ObjectId(id)};
                    const result = await visaInfo.findOne(query);
                    console.log(result)
                    res.send(result);
            })

            app.get('/latestVisa',async(req,res)=>{
                const result = await visaInfo.find().limit(6).toArray();
                res.send(result)

            })

            app.get('/visaApplication',async(req,res)=>{
                const result = await visaApplicationData.find().toArray();
                res.send(result);
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
