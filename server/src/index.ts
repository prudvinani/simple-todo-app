import dotenv from "dotenv"
dotenv.config()
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";


const MONGO_URL = process.env.MONGO_URI || "mongodb+srv://palvaiuser:palvaiprudvi@cluster0.eqkdy.mongodb.net"
console.log("MONGO_URI:", process.env.MONGO_URI);

if (!MONGO_URL) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}


const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToDatabase();

const TodoSchema = new mongoose.Schema({
  content: { type: String, required: true },
}, { timestamps: true });

const TodoModel = mongoose.model("Todo", TodoSchema);


const app = express();


app.use(express.json());
app.use(cors({ credentials: true }));


app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the Todo App API!");
});

app.post("/todo", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== "string") {
       res.status(400).json({ message: "Content is required and must be a string." });
    }

    const newTodo = await TodoModel.create({ content });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Internal server error. Unable to create todo." });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await TodoModel.find({});
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error. Unable to fetch todos." });
  }
});
app.put("/todo/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "string") {
       res.status(400).json({ message: "Content is required and must be a string." });
    }

    const updatedTodo = await TodoModel.findByIdAndUpdate(id, { content }, { new: true });
    if (!updatedTodo) {
       res.status(404).json({ message: "Todo not found." });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal server error. Unable to update todo." });
  }
});

app.delete("/todo/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTodo = await TodoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
       res.status(404).json({ message: "Todo not found." });
    }

    res.status(200).json({ message: "Todo successfully deleted." });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Internal server error. Unable to delete todo." });
  }
});

const PORTS = process.env.PORT || 4000;
app.listen(PORTS, () => {
  console.log(`Server is running at http://localhost:${PORTS}`);
});
