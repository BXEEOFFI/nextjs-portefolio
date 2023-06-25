import { MongoClient } from "mongodb";
export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.mb1avb9.mongodb.net/${process.env.mongodb_db}?retryWrites=true&w=majority`
  );
  return client;
}
