import express, { Application} from 'express';
import bodyParser from 'body-parser';
import { NormalUser } from './models/normalUser';
import { GoogleAuthenticatedUser } from './models/googleUser';
import { hashPassword } from './lib/encryptPassword';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './controllers/User';


dotenv.config();

const app: Application = express();
const PORT: number = 3001 || Number(process.env.PORT);
const dbURI: string = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPass}@chatapp-cluster.j5wns.mongodb.net/chatapp-db?retryWrites=true&w=majority`;


app.use(bodyParser.json());
app.use(cors());


app.get('/users', (req, res) => { User.getUser(req, res) });


app.get('/api/app-params', (req, res) => {
   res.json({
      "GoogleClientID": process.env.GoogleClientID
   });
});

app.post('/api/google-login', (req, res) => User.googleLogin(req, res));

app.post('/new-user', async (req, res) => {
   await mongoose.connect(dbURI);
   const user = new NormalUser({
      username: req.body.username,
      password: hashPassword(req.body.password)
   });
   await user.save()
});

app.get('/current-user', async (req, res) => {
   await mongoose.connect(dbURI);

   const getUser: any = await GoogleAuthenticatedUser.findOne({ email: req.query.email });

   res.json(JSON.stringify(getUser));
});

app.listen(PORT);

function fn(req: any, res: any, next: any): any {
   throw new Error('Function not implemented.');
}


function req(req: any, res: any, next: any): any {
   throw new Error('Function not implemented.');
}


function res(req: any, res: any, next: any): any {
   throw new Error('Function not implemented.');
}


function next(req: any, res: any, next: any): any {
   throw new Error('Function not implemented.');
}
