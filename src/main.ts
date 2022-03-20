import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import User from '../controllers/User';

dotenv.config();

const app: Application = express();
const PORT: number = 3001 || Number(process.env.PORT);
const dbURI: string = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPass}@chatapp-cluster.j5wns.mongodb.net/chatapp-db?retryWrites=true&w=majority`;


app.use(cors());
app.use(bodyParser.json());
// Parse URL-encoded bodies (sent by HTML form)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (sent by API clients)
app.use(express.json());


app.get('/users', (req, res) => { User.getUser(req, res) });

app.get('/api/app-params', (req, res) => {
   res.json({
      "GoogleClientID": process.env.GoogleClientID
   });
});

app.post('/api/google-login', (req, res) => User.googleLogin(req, res));

app.post('/user/register', (req, res) => User.registerUser(req, res));

app.post('/user/login', (req, res) => User.loginHandler(req, res));


app.listen(PORT);
