"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const MONGO_URL = process.env.MONGO_URI;
console.log("MONGO_URI:", process.env.MONGO_URI);
if (!MONGO_URL) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
}
mongoose_1.default
    .connect(MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process on failure
});
const TodoSchema = new mongoose_1.default.Schema({
    content: { type: String, required: true },
}, { timestamps: true });
const TodoModel = mongoose_1.default.model("Todo", TodoSchema);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true }));
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the Todo App API!");
});
app.post("/todo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        if (!content || typeof content !== "string") {
            res.status(400).json({ message: "Content is required and must be a string." });
        }
        const newTodo = yield TodoModel.create({ content });
        res.status(201).json(newTodo);
    }
    catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ message: "Internal server error. Unable to create todo." });
    }
}));
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield TodoModel.find({});
        res.status(200).json(todos);
    }
    catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Internal server error. Unable to fetch todos." });
    }
}));
app.put("/todo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { content } = req.body;
        if (!content || typeof content !== "string") {
            res.status(400).json({ message: "Content is required and must be a string." });
        }
        const updatedTodo = yield TodoModel.findByIdAndUpdate(id, { content }, { new: true });
        if (!updatedTodo) {
            res.status(404).json({ message: "Todo not found." });
        }
        res.status(200).json(updatedTodo);
    }
    catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: "Internal server error. Unable to update todo." });
    }
}));
app.delete("/todo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTodo = yield TodoModel.findByIdAndDelete(id);
        if (!deletedTodo) {
            res.status(404).json({ message: "Todo not found." });
        }
        res.status(200).json({ message: "Todo successfully deleted." });
    }
    catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: "Internal server error. Unable to delete todo." });
    }
}));
const PORTS = process.env.PORT || 4000;
app.listen(PORTS, () => {
    console.log(`Server is running at http://localhost:${PORTS}`);
});
