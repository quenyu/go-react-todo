import { ChangeEvent } from 'react';
import { Todo } from '../../types/todo';
import styles from './styles.module.css'

type EditingTodoProps = {
  handleSaveClick: (todoId: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCancelClick: () => void
  updatedTitle: string;
  updatedText: string;
  todo: Todo;
};

export function EditingTodo({
  handleSaveClick,
  handleInputChange,
  handleTitleChange,
  handleCancelClick,
  updatedTitle,
  updatedText,
  todo
}: EditingTodoProps) {
  return (
    <div className={styles.editingWrapper}>
      <input
        type="text"
        value={updatedTitle}
        onChange={handleTitleChange}
        placeholder="Заголовок"
      />
      <input
        type="text"
        value={updatedText}
        onChange={handleInputChange}
        placeholder="Описание"
      />
      <div className={styles.editingBtns}>
        <button onClick={() => handleSaveClick(todo.id)}>Save</button>
        <button onClick={() => handleCancelClick()}>Cancel</button>
      </div>
    </div>
  );
}
