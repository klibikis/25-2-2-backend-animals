import mongoose from "mongoose";
const { Schema } = mongoose;

const date = new Date;

export const taskSchema = new Schema({
  title: String,
  content: String,
  date: { type: String, default: date.toDateString() },
  isDone: { type: Boolean, default: false }
});

export default taskSchema;
