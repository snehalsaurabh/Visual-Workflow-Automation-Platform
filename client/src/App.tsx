import CreateWorkflow from './components/CreateWorkflow'
import '@xyflow/react/dist/style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CreateWorkflow />} />
                <Route path="/create-workflow" element={<CreateWorkflow />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
