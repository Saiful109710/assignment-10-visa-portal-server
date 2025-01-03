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
            const userCollection = client.db('visaInfo').collection('users')

            app.post('/allVisa',async(req,res)=>{
                const data = req.body;
                const allVisas = await visaInfo.find().toArray();
                const newData = {...data,id:allVisas.length + 1}
                  
                 
                const result = await visaInfo.insertOne(newData);
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

             app.get('/myAddedVisa',async(req,res)=>{
                const email = req.headers.email;
                
                const result = await visaInfo.find({email}).toArray()
                res.send(result)
             })    

            app.get('/visaApplication',async(req,res)=>{
                const result = await visaApplicationData.find().toArray();
                res.send(result);
                })

             app.get('/myVisaApplication',async(req,res)=>{
                const email = req.headers.email
                const search = req.query.search || ""
                const query = {
                    email,
                    countryName:{$regex:search,$options:'i'}
                }
                
                const result = await visaApplicationData.find(query).toArray()
                res.send(result)
             })   

            app.patch('/allVisa/:id',async(req,res)=>{
                const id = req.params.id;
                console.log(id)
                const query = {_id:new ObjectId(id)}
                const data = req.body;
                const update = {
                    $set:{
                        countryImage:data.countryImage,
                        countryName:data.countryName,
                        visaType:data.visaType,
                        processingTime:data.processingTime,
                        requiredDocuments:data.requiredDocuments,
                        description:data.description,
                        ageRestriction:data.ageRestriction,
                        fee:data.fee,
                        validity:data.validity,
                        applicationMethod:data.applicationMethod

                         }
                }

                const result = await visaInfo.updateOne(query,update)
                res.send(result)
                })

                app.delete('/allVisa/:id',async(req,res)=>{
                    const {id} = req.params;
                    const query = {_id:new ObjectId(id)};
                    const result = await visaInfo.deleteOne(query);
                    res.send(result);
                })

                app.delete('/visaApplication/:id',async(req,res)=>{

                    const {id} = req.params;
                    console.log(id)
                    const query = {_id:new ObjectId(id)};
                    const result = await visaApplicationData.deleteOne(query);
                    console.log(result)
                    res.send(result);
                })

                // user db api
                app.post('/users',async(req,res)=>{
                    const data = req.body;
                    const result = await userCollection.insertOne(data);
                    res.send(result)
                })
                
                app.get('/user',async(req,res)=>{
                    const result = await userCollection.find().toArray();
                    res.send(result);
                })

                console.log('connect to db')

    }catch(err){
        console.log(err)
    }

    
}

run()


app.get('/',(req,res)=>{
    res.send("server is running")
})

app.listen(port,()=>{
    console.log(`serrver is running on port ${port}`)
})
