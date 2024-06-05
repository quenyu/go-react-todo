import styles from './styles.module.css';
import ky from "ky"
import { AddTodo } from "../AddTodo/AddTodo.tsx";
import { useCallback, useEffect, useState } from 'react';
import { ENDPOINT } from '../../api/fetchData.ts';
import { Todo } from '../../types/todo.ts';
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

export function Main() {
  const [todos, setTodos] = useState<Todo[] | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      const data: Todo[] = await ky.get(`${ENDPOINT}/api/todos`).json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const deleteTodo = async (id: string) => {
    try {
      await ky.delete(`${ENDPOINT}/api/todos/${id}`).json();
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  }

  const editTodo = async (id: string) => {
    const values = {};
    try {
      await ky.put(`${ENDPOINT}/api/todos/${id}`, { json: values }).json();
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.todolist}>
        <h1 className={styles.todoTitle}>Personal Todo List</h1>
        <AddTodo fetchTodos={fetchTodos} />
        <div className={todos && todos.length > 0 ? styles.todosWrapper : ''}>
          {todos?.map((todo) => (
            <div key={todo.id} className={styles.todoBlock}>
              <div className={styles.todoInfo}>
                <h3>{todo.title}</h3>
                <p>{todo.body}</p>
              </div>
              <div className={styles.todoBtns}>
                <div className={styles.todoBtn} onClick={() => editTodo(todo.id)}>
                  <FiEdit2 size={25} />
                </div>
                <div className={styles.todoBtn} onClick={() => deleteTodo(todo.id)}>
                  <FaTrash size={25} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
