import { useEffect, useState } from "react"
import axios from "axios"

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
axios.defaults.url = "http://localhost:3000"
function App() {
    const [input, setInput] = useState(0)
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState("")

    const debouncedSearch = useDebounce(search, 300)

    const handleInsert = async () => {
        try {
            console.log("input", input)

            axios.post("http://localhost:3000/api", { count: input ?? 0 })
            alert("Success")
        } catch (e) {
            console.log(e)
            alert("Failed")
        }
    }

    const handleLoadData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api")
            console.log(response.data)
            setData(response.data)
            setFilteredData(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    // Lọc dữ liệu dựa trên search
    useEffect(() => {
        if (debouncedSearch) {
            const filtered = data.filter((item) => item.value.toLowerCase().includes(debouncedSearch.toLowerCase()))
            setFilteredData(filtered)
        } else {
            setFilteredData(data)
        }
    }, [debouncedSearch, data])

    return (
        <>
            <div>
                input count: <input type="number" value={input} onChange={(e) => setInput(e.target.value)} />
                <button onClick={handleInsert}>Generate</button>
            </div>

            <div>
                <button onClick={handleLoadData}>Load all data</button>{" "}
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: "10px", padding: "5px" }}
                />
                <select onChange={(e) => console.log("selected:", e.target.value)}>
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <option key={item._id} value={item.value}>
                                {item.value}
                            </option>
                        ))
                    ) : (
                        <option>No results</option>
                    )}
                </select>
            </div>
        </>
    )
}

export default App
