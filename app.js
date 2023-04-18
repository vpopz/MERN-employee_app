const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const Mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const { employeeModel } = require("./model/EmployeeList");
const { userModel } = require("./model/Users");
const ObjectId = require('mongodb').ObjectId;


const app = Express();

app.use(Cors());
app.use(BodyParser.urlencoded({extended:true}));
app.use(BodyParser.json());

Mongoose.connect("mongodb+srv://vaisakh1996v:1996@employee.dxco8t1.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});

//view all data
         app.post('/api/viewdata', async (req,res)=>{
            let data = await employeeModel.find()
            jwt.verify(req.body.token,"employeeapp",
            (error,decoded)=>{
                if (decoded && decoded.email) {
                   
                    res.json(data)
                    
                } else {
                    res.json({status:"Unauthorized User"})
                }
            })
        })

//get single data
app.post('/viewone', async(req,res)=>{
    
    let data = await employeeModel.findOne(req.body)
    jwt.verify(req.body.token,"employeeapp",
    (error,decoded)=>{
        if (decoded && decoded.email) {
           
            res.json(data)
            
        } else {
            res.json({status:"Unauthorized User"})
        }
    })
})

//post data
         app.post('/api/enterData', async(req,res)=>{
            let data = new employeeModel(req.body)
            jwt.verify(req.body.token,"employeeapp",
            (error,decoded)=>{
                if (decoded && decoded.email) {
                    data.save(req.body.token)
                    console.log()
                    res.json({status : 'Data Saved'}) 
                } else {
                    res.json({status:"Unauthorized User"})
                }
                console.log(req.body.token)
            })
        
            
        })

    //update data
      app.post('/api/changeData', async(req,res)=>{
        console.log(req.body._id)
        let data = await employeeModel.findOneAndUpdate({"_id": req.body._id},req.body)
        console.log(data)
        jwt.verify(req.body.token,"employeeapp",
        (error,decoded)=>{
            if (decoded && decoded.email) {
                
                res.json({status:'Data Updated'})
                
            } else {
                res.json({status:"Unauthorized User"})
            }
        })
    })

//delete data
        app.post('/api/deleteData', async (req,res)=>{

            const data = await employeeModel.findByIdAndDelete(req.body)
            console.log(req.body)
            jwt.verify(req.body.token,"employeeapp",
            (error,decoded)=>{
                if (decoded && decoded.email) {
                   
                    res.json({status:'Deleted Successfully'})
                    
                } else {
                    res.json({status:"Unauthorized User"})
                }
            })
        })

//login
app.post('/api/login',async(req,res)=>{

    let email = req.body.email
    let password = req.body.password

    let user = await userModel.findOne({email : email})
    console.log(user)
    if(!user){
        res.json({status: "User not Found"})
    }
    try {

        if( user.password == password){
            console.log("inside if")
            console.log(user._id)
            jwt.sign({email:email,id:user._id},"employeeapp",{expiresIn:"1d"},
            (error,token)=>{
                console.log("token generating")
                if (error) {
                    res.json({status:"Token not Generated"})
                } else {
                    res.json({status:"Login Successful",token:token,data:user})
                    console.log(token)
                }
            })
        }
        else{
            res.json({status:"Login Failed"})
        }
    } catch (error) {
        
    }
    
})
//signup
app.post('/api/signup',async(req,res)=>{
    let data = new userModel(req.body)
    data.save(
        res.json({status: 'Registered Successfully'})
    )
})

const path = require('path');
app.use( Express.static(path.join(__dirname, './build')));

app.get('*' , (req ,res)=>{ res.sendFile(path.join(__dirname, './build/index.html' ))});


app.listen(3001, ()=>{
    console.log('server up and running........')
})


