import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [todoItem, setTodoItem] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/'); // Ensure the port matches your backend
      setTodos(response.data.items);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      await axios.post('http://localhost:5000/addTodo', {
        todoItem: todoItem,
      });
      setTodoItem('');
      fetchTodos();
      notifyAdd();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (todoItem) => {
    try {
      await axios.delete('http://localhost:5000/deleteItem', {
        data: { todoItem },
      });
      fetchTodos();
      notify();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const notify = () => toast('Task Deleted!');
  const notifyAdd = () => toast('Task Added!');

  return (
    <div className='p-5'>
      <h1 className='text-3xl mb-5 text-[#3c5215]'>Todo App</h1>
      <div className='flex space-x-5 mb-5'>
        <input
          type='text'
          placeholder='Todo'
          value={todoItem}
          onChange={(e) => setTodoItem(e.target.value)}
          className='border-2 rounded-md px-2 py-1 flex-grow'
        />
        <button
          onClick={addTodo}
          className='bg-[#577b10] text-white px-4 py-2 rounded-md'
        >
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <div
            key={todo._id}
            className='flex space-x-3 bg-[#cbf165] text-[#1e2e05] w-1/3 py-2 px-3 mb-2 rounded-md'
          >
            <li>{todo.thing}</li>
            <span>
              <FaTrashAlt
                onClick={() => deleteTodo(todo.thing)}
                className='cursor-pointer'
              />
            </span>
          </div>
        ))}
      </ul>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </div>
  );
}

export default TodoApp;
