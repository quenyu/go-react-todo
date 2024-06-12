import ky from 'ky';
import { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/todoStore';
import { deleteTodo, setTodos, updateTodo } from '../../store/todoActions';
import { AddTodo } from '../AddTodo/AddTodo';
import { ENDPOINT } from '../../api/fetchData';
import { Todo } from '../../types/todo';
import { EditingTodo } from '../EditingTodo/EditingTodo';
import { FaTrash } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import styles from './styles.module.css';

export function Main() {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch: AppDispatch = useDispatch();

  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [updatedText, setUpdatedText] = useState<string>('');
  const [updatedTitle, setUpdatedTitle] = useState<string>('');

  const fetchTodos = async () => {
    try {
      const data: Todo[] = await ky.get(`${ENDPOINT}/api/todos`).json();
      dispatch(setTodos(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo.id);
    setUpdatedText(todo.body);
    setUpdatedTitle(todo.title);
  };

  const handleSaveClick = async (todoId: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);
    if (!todoToUpdate) return;

    const updatedTodo: Todo = {
      ...todoToUpdate,
      body: updatedText,
      title: updatedTitle,
    };

    try {
      await ky.put(`${ENDPOINT}/api/todos/${todoId}`, { json: updatedTodo }).json();
      dispatch(updateTodo(updatedTodo));
      setEditingTodo(null);
      setUpdatedText('');
      setUpdatedTitle('');
      fetchTodos()
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    setEditingTodo(null)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedText(e.target.value);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.target.value);
  };

  const handleDeleteClick = async (todoId: string) => {
    try {
      await ky.delete(`${ENDPOINT}/api/todos/${todoId}`).json();
      dispatch(deleteTodo(todoId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.todolist}>
        <h1 className={styles.todoTitle}>Personal Todo List</h1>
        <AddTodo fetchTodos={fetchTodos} />
        <div className={todos.length > 0 ? styles.todosWrapper : ''}>
          {todos?.map((todo) => (
            <div key={todo.id} className={styles.todoBlock}>
              <div className={styles.todoInfo}>
                {editingTodo === todo.id ? (
                  <EditingTodo
                    handleSaveClick={handleSaveClick}
                    handleInputChange={handleInputChange}
                    handleTitleChange={handleTitleChange}
                    handleCancelClick={handleCancelClick}
                    updatedTitle={updatedTitle}
                    updatedText={updatedText}
                    todo={todo}
                  />
                ) : (
                  <>
                    <h3>{todo.title}</h3>
                    <p>{todo.body}</p>
                  </>
                )}
              </div>
              <div className={styles.todoBtns}>
                <div className={styles.todoBtn} onClick={() => handleEditClick(todo)}>
                  <FiEdit2 size={25} />
                </div>
                <div className={styles.todoBtn} onClick={() => handleDeleteClick(todo.id)}>
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
