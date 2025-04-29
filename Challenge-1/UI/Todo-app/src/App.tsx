import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="flex items-center justify-center space-x-4">
            <a href="https://vite.dev" target="_blank" rel="noopener">
              <img src={viteLogo} className="h-12 w-12" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener">
              <img src={reactLogo} className="h-12 w-12 animate-spin" alt="React logo" />
            </a>
          </div>
          <div className="mt-5">
            <h1 className="text-4xl font-bold text-center text-gray-900">Vite + React + Tailwind</h1>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setCount((count) => count + 1)}
                className="px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              >
                count is {count}
              </button>
            </div>
            <p className="mt-4 text-center text-gray-600">
              Edit <code className="bg-gray-100 p-1 rounded text-sm">src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
