import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import axios from "axios";
import { Button } from "./components/ui/button";

interface Todo {
  _id: string;
  content: string;
}

function App() {
  const [content, setContent] = useState<string>("");
  const [allData, setAllData] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);



  async function fetchTodos() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/todos`);
      setAllData(response.data);
    } catch (error) {
      console.error("Unable to fetch todos:", error);
    }
  }

  async function handleAddTodo() {
    if (!content.trim()) {
      alert("Content cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/todo`, { content });
      setAllData((prev) => [...prev, response.data]);
      setContent("");
    } catch (error) {
      console.error("Unable to add todo:", error);
    }
  }

  async function handleDeleteTodo(id: string) {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/todo/${id}`);
      setAllData((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Unable to delete todo:", error);
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Enter a new todo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handleAddTodo}>Add Todo</Button>
      </div>

     
      <div>
        {allData.length > 0 ? (
          allData.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2"
            >
              <p>{todo.content}</p>
              <Button variant="destructive" onClick={() => handleDeleteTodo(todo._id)}>
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p>No todos available. Start by adding one!</p>
        )}
      </div>
    </div>
  );
}

export default App;
