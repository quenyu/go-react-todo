import styles from './styles.module.css';
import {AddTodo, Todo} from "../AddTodo/AddTodo.tsx";
import {fetcher} from "../../api/fetchData.ts";
import useSWR from "swr";
import ky from "ky";

export function Main() {
  const {data, mutate} = useSWR<Todo[]>("api/todos", fetcher)

  const deleteTodo = (id: number) => {
    ky.delete(`api/todos/${id}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.todolist}>
        <h1 className={styles.todoTitle}>Personal Todo List</h1>
        <AddTodo mutate={mutate}/>
        <div className={styles.todosWrapper}>
          {data?.map((todo) => (
            <div key={todo.id} className={styles.todoBlock}>
              <div className={styles.todoInfo}>
                <h3>{todo.title}</h3>
                <p>{todo.body}</p>
              </div>
              <div className={styles.todoDeleteBtn}>
                <button onClick={() => deleteTodo(todo.id)}>
                  Delete Todo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
