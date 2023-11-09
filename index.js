import express from 'express';
import bodyParser from 'body-parser';

import usersRoutes from './routes/users.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// DB CONNECTION

import mongoose from "mongoose";
import config from './config.js';



main().catch(err => console.log("db connection error"));

async function main() {
  await mongoose.connect(config.dbURL);
 
  console.info("connected to the db");
  
}

import articleObj from './models/channel.js';

// ROUTES

app.use('/users', usersRoutes );






app.get('/insert', async (req,res)=>{
   try {
  const newArticleData = {
      title: "Neuroscience",
      subtitle: "teh wonders of the brain",
      intro: "I really like to blog about the sciences of the mind",
      paragraphs: [ "I cant live without blogging about this dear and close to my heart passion called neuroscience", 
    "exploring the realms of neuroscience, biohacking and evolutionary biology have been theme in my everyday curiosity"],
    keywords: [ "neuroscience", "mind", "thinking"],
    }

  const savedArticle = await articleObj.create(newArticleData);
  res.json(savedArticle);

   } catch (error) {
      console.error('error inserting article', error);
      res.status(500).json({error: 'Internal Server Error'});
   }
});

app.use('/', (req, res) => { res.send('Hello world!'); }); 



app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));