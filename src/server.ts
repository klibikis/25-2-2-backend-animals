import express from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import { connectDb } from "./connectDb";
import mongoose from "mongoose";
import  animalSchema  from  './model/animalSchema'

mongoose.set('strictQuery', false)

//Connect to MongoDB
connectDb()

const Animal = mongoose.model('animal', animalSchema)

const app = express();

app.use(bodyparser.json());
app.use(cors({ origin: "*" }));

app.get("/animals", async (req: Request, res: Response) => {
  const allAnimals = await Animal.find();
  return res.status(200).json(allAnimals);
});


app.post("/animals/new", async ({body}: Request, res: Response) => {
  if(!body.name || !body.breed){
    return res.status(404).json({error: "Missing data"})
  }
  const postAnimal = new Animal({name: body.name, breed: body.breed})
  try {
    await postAnimal.save();
    return res.status(200).json({message: "Post created!"})
  } catch(error){
    return res.status(404).json({error: "Error!"})
  }
})

app.delete("/animals/delete/:id", async (req: Request, res: Response) => {
  const animalId = req.params.id;
  const deletedAnimal = await Animal.findOneAndDelete({_id: animalId});
  if(!deletedAnimal){
    return res.status(404).json({ error: "Task not found"})
  }
  return res.status(200).json({message: "Task deleted"})
})


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(3006, () => {
    console.log("Server running on port 3006!");
});
})

app.get("/", (req: Request, res: Response) => {
    res.send("Application works!");
});
