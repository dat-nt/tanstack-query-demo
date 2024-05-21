import "./App.css";
import PostsTable from "./components/PostsTable";

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Posts Table</h1>
            <PostsTable />
        </div>
    );
};

export default App;
