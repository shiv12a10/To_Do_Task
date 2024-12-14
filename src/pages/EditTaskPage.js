import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTodo } from '../redux/todoSlice';

function EditTaskPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const todo = useSelector(state => 
    state.todos.items.find(todo => todo.id === parseInt(id))
  );
  const status = useSelector(state => state.todos.status);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setCompleted(todo.completed || false);
    }
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const updatedTodo = {
        id: parseInt(id),
        title: title.trim(),
        description: description.trim(),
        completed,
        userId: todo.userId
      };
  
      await dispatch(updateTodo(updatedTodo)).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">Task not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Edit Task</h2>
        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 text-red-700 rounded text-sm sm:text-base">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={status === 'loading'}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label 
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={status === 'loading'}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 sm:h-32"
            />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={status === 'loading'}
              className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label 
              htmlFor="completed"
              className="text-sm sm:text-base font-medium text-gray-700"
            >
              Mark as completed
            </label>
          </div>
          <div className="flex space-x-3 sm:space-x-4 pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {status === 'loading' ? 'Updating...' : 'Update Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={status === 'loading'}
              className="flex-1 bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskPage;
