import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Todo } from "../types/todo";

const initialTodo: Todo[] = []

const todosSlice = createSlice({
  name: "todos",
  initialState: initialTodo,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      return action.payload
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.push(action.payload)
    },
    updateTodo(state, action: PayloadAction<Todo>) {
      const todoIndex = state.findIndex(todo => todo.id === action.payload.id)
      if (todoIndex && todoIndex !== -1) {
        state[todoIndex] = action.payload
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      return state.filter(todo => todo.id !== action.payload)
    }
  }
})

export const { setTodos, addTodo, updateTodo, deleteTodo } = todosSlice.actions
export default todosSlice.reducer
