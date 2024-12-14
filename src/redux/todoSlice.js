import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (todo) => {
  const response = await axios.post(BASE_URL, todo);
  return response.data;
});

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo, { rejectWithValue }) => {
    try {
      await axios.put(`${BASE_URL}/${todo.id}`, todo);
      return todo;
    } catch (error) {
      return todo;
    }
  }
);

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});

export const deleteAllTodos = createAsyncThunk('todos/deleteAllTodos', async (_, { getState }) => {
  const { items } = getState().todos;
  await Promise.all(items.map(todo => axios.delete(`${BASE_URL}/${todo.id}`)));
  return items.map(todo => todo.id);
});

export const deleteSelectedTodos = createAsyncThunk(
  'todos/deleteSelectedTodos',
  async (_, { getState }) => {
    const { selectedTasks } = getState().todos;
    await Promise.all(selectedTasks.map(id => axios.delete(`${BASE_URL}/${id}`)));
    return selectedTasks;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedTasks: [],
  },
  reducers: {
    toggleTaskSelection: (state, action) => {
      const taskId = action.payload;
      const index = state.selectedTasks.indexOf(taskId);
      if (index === -1) {
        state.selectedTasks.push(taskId);
      } else {
        state.selectedTasks.splice(index, 1);
      }
    },
    clearSelectedTasks: (state) => {
      state.selectedTasks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTodo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update task';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteAllTodos.fulfilled, (state) => {
        state.items = [];
        state.selectedTasks = [];
      })
      .addCase(deleteSelectedTodos.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => !action.payload.includes(todo.id));
        state.selectedTasks = [];
      });
  },
});

export const { toggleTaskSelection, clearSelectedTasks } = todoSlice.actions;

export default todoSlice.reducer;
