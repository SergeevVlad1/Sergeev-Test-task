import { BrowserRouter, Route, Routes, } from 'react-router-dom'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from './routes/routes'
import { Menu } from './components/header/header.component'
function App() {
  const client = new QueryClient

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Menu />
        <Routes >
          {routes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
