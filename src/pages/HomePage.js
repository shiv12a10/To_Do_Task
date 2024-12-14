import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo } from '../redux/todoSlice';
import TodoList from '../components/TodoList';

function HomePage() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.items);
  const status = useSelector(state => state.todos.status);
  const error = useSelector(state => state.todos.error);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await dispatch(addTodo({
        title: newTitle.trim(),
        description: newDescription.trim(),
        completed: false,
        userId: 1
      })).unwrap();
      
      setNewTitle('');
      setNewDescription('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  if (status === 'loading' && todos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">
          Error: {error || 'Failed to load tasks'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 space-y-3 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Todo List</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm sm:text-base rounded-md hover:bg-blue-600 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add New Task'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddTodo} className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label 
                  htmlFor="newTitle" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title:
                </label>
                <input
                  type="text"
                  id="newTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label 
                  htmlFor="newDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description:
                </label>
                <textarea
                  id="newDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-20 sm:h-24"
                  placeholder="Enter task description (optional)"
                />
              </div>
              <button
                type="submit"
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        )}

        {todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks available. Add a new task to get started!</p>
          </div>
        ) : (
          <TodoList todos={todos} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
