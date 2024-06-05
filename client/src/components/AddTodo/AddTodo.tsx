import { useForm } from "react-hook-form"
import styles from './styles.module.css'
// import { ENDPOINT } from "../../api/fetchData.ts";
// import {KeyedMutator} from "swr";
import ky from "ky";
import { ENDPOINT } from "../../api/fetchData";

type IFormInput = {
  title: string
  body: string
}

type Props = {
  fetchTodos: () => void
}

export function AddTodo({ fetchTodos }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      body: "",
    }
  })

  async function onSubmit(values: IFormInput) {
    try {
      await ky.post(`${ENDPOINT}/api/todos`, { json: values });
      reset();
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addTodoForm}>
      <input placeholder="Title" {...register("title")} />

      <input placeholder="Body" {...register("body", { required: false })} />
      {errors?.body?.type === "required" && <span>This field is required</span>}

      <button type="submit">
        Add Todo
      </button>
    </form>
  )
}