import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  // updateTodo, 
  deleteTodo, 
  deleteAllTodos, 
  deleteSelectedTodos, 
  toggleTaskSelection 
} from '../redux/todoSlice';

function TodoList({ todos }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedTasks = useSelector(state => state.todos.selectedTasks);

  // const handleStatusToggle = (todo) => {
  //   dispatch(updateTodo({
  //     ...todo,
  //     completed: !todo.completed
  //   }));
  // };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTodo(id));
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      dispatch(deleteAllTodos());
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.length === 0) {
      alert('Please select tasks to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} selected task(s)?`)) {
      dispatch(deleteSelectedTodos());
    }
  };

  const handleSelectTask = (id) => {
    dispatch(toggleTaskSelection(id));
  };

  const handleEdit = (todo) => {
    navigate(`/edit-task/${todo.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Todo List</h2>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <button
          onClick={() => navigate('/add')}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-colors"
        >
          Add New Task
        </button>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleDeleteAll}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-colors"
          >
            Delete All Tasks
          </button>
          
          <button
            onClick={handleDeleteSelected}
            className={`w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-colors ${
              selectedTasks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={selectedTasks.length === 0}
          >
            Delete Selected ({selectedTasks.length})
          </button>
        </div>
      </div>

      {todos.map((todo) => (
        <div key={todo.id} className="flex flex-col p-3 sm:p-4 mb-3 sm:mb-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
              <input
                type="checkbox"
                checked={selectedTasks.includes(todo.id)}
                onChange={() => handleSelectTask(todo.id)}
                className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-0 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex flex-col">
                <span className={`text-base sm:text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.title}
                </span>
                {todo.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    {todo.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 sm:space-x-4 ml-7 sm:ml-0">
              <button
                onClick={() => handleEdit(todo)}
                className="text-sm sm:text-base text-blue-500 hover:text-blue-600 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-sm sm:text-base text-red-500 hover:text-red-600 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
