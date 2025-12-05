import Agenda from 'agenda';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexsaa_honors_dev';
export const agenda = new Agenda({ db: { address: MONGO_URI, collection: 'agendaJobs' } });
