import mongoose from "mongoose";
const { Schema } = mongoose;


export const animalSchema = new Schema({
  name: String,
  breed: String,
});

export default animalSchema;
