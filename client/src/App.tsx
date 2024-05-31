import './App.css'
import useSWR from "swr";
import {fetcher} from "./api/fetchData.ts";

function App() {
    const {data} = useSWR("api/todos", fetcher)
    return (
        <div>{JSON.stringify(data)}</div>
    )
}

export default App
