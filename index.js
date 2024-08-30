import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from "path";


const app = express();

dotenv.config();
const Port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const connectDB = async() =>  {

    try {
        await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.pbeyk.mongodb.net/RegistrationForm_DB`)
        console.log("DB Connection Established Successfully")
   
    } catch (error) {
        console.log(error)
    }    
};


const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
});
const Registration = mongoose.model("Registration", registrationSchema);


app.use(bodyParser.urlencoded({extended: false})); //for making form data as a readable formate
app.use(bodyParser.json());


// app.get('/', (req, res) => {
//     res.send("this is my home page");
// });


const __dirname = path.resolve();
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/pages/index.html"));
  });


app.post("/register", async(req, res) => {

    try {
        const {name, email, password} = req.body;

        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
            })
            await registrationData.save();
    
            res.sendFile(path.join(__dirname,"/pages/success.html"));
        }
        else{
            console.log("User Already Exist");
            res.redirect("/error");
        }
          
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
  });


  app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname,"/pages/error.html"));  
  })


app.listen(Port, () => {
    console.log(`app is listening on Port ${Port}`);
    connectDB();
});
