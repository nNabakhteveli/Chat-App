
import express, { Application} from 'express';
import bodyParser from 'body-parser';
import { User } from './models/user';
import { hashPassword } from './lib/encryptPassword';
import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config();

const app: Application = express();
const PORT: number = 3001 || Number(process.env.PORT);
const dbURI: string = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPass}@chatapp-cluster.j5wns.mongodb.net/chatapp-db?retryWrites=true&w=majority`;

app.use(bodyParser.json());


app.get('/users', async (req, res) => {
   await mongoose.connect(dbURI);
   User.find().then((response: any) => { res.send(response) });
});

app.post('/new-user', async (req, res) => {
   await mongoose.connect(dbURI);
   const user = new User({
      username: req.body.username,
      password: hashPassword(req.body.password)
   });
   await user.save()
});

app.listen(PORT);