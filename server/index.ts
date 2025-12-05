import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes.js';
import './worker.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexsaa_honors_dev';

mongoose.connect(MONGO_URI).then(()=> console.log('MongoDB connected')).catch(err=> console.error(err));

app.use('/api', routes);

app.get('/', (req,res)=> res.send('NexSAA Honors API running'));
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
