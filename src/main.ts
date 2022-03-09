
import express, { Application, Request, Response } from 'express';
import { User } from './models/user';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config();


const app: Application = express();
const PORT: number = 3000 || process.env.PORT;

const DBURI: string = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPass}@chatapp-cluster.j5wns.mongodb.net/chatapp-db?retryWrites=true&w=majority`;

mongoose.connect(DBURI)
.then(() => {
   console.log("Connected to MongoDB database")
   app.listen(PORT);
}).catch(error => console.log(error))

app.get('/', (req, res) => {

});

