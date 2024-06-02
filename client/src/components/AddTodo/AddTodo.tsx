import {useForm} from "react-hook-form"
import styles from './styles.module.css'
import {ENDPOINT} from "../../api/fetchData.ts";
import {KeyedMutator} from "swr";

type IFormInput = {
  title: string
  body: string
}

export type Todo = {
  id: number
  title: string
  body: string
  done: boolean
}

type Props = {
  mutate: KeyedMutator<Todo[]>
}

export function AddTodo({mutate}: Props) {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      body: "",
    }
  })

  async function onSubmit(values: { title: string; body: string }) {
    const updated = await fetch(`${ENDPOINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((r) => r.json());

    mutate(updated);
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addTodoForm}>
      <input placeholder="Title" {...register("title")} />

      <input placeholder="Body" {...register("body", {required: false})} />
      {errors?.body?.type === "required" && <span>This field is required</span>}

      <button type="submit">
        Add Todo
      </button>
    </form>
  )
}