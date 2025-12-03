import { useState } from 'react'
import './App.css'
import BoardPage from './pages/BoardPage.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BoardPage />
    </div>
  )
}

export default App
