import express from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import { connectDb } from "./connectDb";
import mongoose from "mongoose";
import  taskSchema  from  './model/taskSchema'

mongoose.set('strictQuery', false)

//Connect to MongoDB
connectDb()

const Todo = mongoose.model('task', taskSchema)

const app = express();

app.use(bodyparser.json());
app.use(cors({ origin: "*" }));

app.get("/tasks", async (req: Request, res: Response) => {
  const allTasks = await Todo.find();
  return res.status(200).json(allTasks);
});

app.post("/tasks/new", async ({body}: Request, res: Response) => {
  if(!body.title || !body.content){
    return res.status(404).json({error: "Missing data"})
  }
  const postTask = new Todo({title: body.title, content: body.content})
  try {
    await postTask.save();
    return res.status(200).json({message: "Post created!"})
  } catch(error){
    return res.status(404).json({error: "Error!"})
  }
})

app.delete("/tasks/delete/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const deletedTask = await Todo.findOneAndDelete({_id: taskId});
  if(!deletedTask){
    return res.status(404).json({ error: "Task not found"})
  }
  return res.status(200).json({message: "Task deleted"})
})

app.patch("/tasks/patch", async (req: Request, res: Response) => {
  const taskId = req.body.id;
  const updatedTask = await Todo.findOneAndUpdate({_id: taskId}, {isDone: req.body.isTaskDone});
  return res.status(200).json({message: "Task updated"})
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

// app.get("/scores", (req: Request, res: Response) => {
//     db.query("SELECT * FROM scores ORDER BY `date` desc LIMIT 100;", function (err, data) {
//         if (err) throw err;
//         res.send(data);
//     });
// }); 

// app.post("/scores", (req: Request, res: Response) => {
//   const values = [
//     req.body.gameEndState,
//     req.body.playerPoints,
//     req.body.opponentPoints,
//     req.body.date
//   ];
//   db.query("INSERT INTO scores(gameEndState, playerPoints, opponentPoints, date) VALUES (?);", [values], (err, data) => {
//     if (err) throw err;
//       res.send(data);
//     });
// });


// // SORTING
// app.get("/scores/dateDesc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `date` desc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
// app.get("/scores/dateAsc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `date` asc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
// app.get("/scores/statusDesc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `gameEndState` desc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
// app.get("/scores/statusAsc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `gameEndState` asc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
// app.get("/scores/playerPointsDesc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `playerPoints` desc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
// app.get("/scores/playerPointsAsc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `playerPoints` asc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
// app.get("/scores/opponentPointsDesc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `opponentPoints` desc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
// app.get("/scores/opponentPointsAsc", (req: Request, res: Response) => {
//   db.query("SELECT * FROM scores ORDER BY `opponentPoints` asc LIMIT 100;", function (err, data) {
//       if (err) throw err;
//       res.send(data);
//   });
// });
