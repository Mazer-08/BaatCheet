import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ChatPage from './pages/ChatPage.jsx'
import './index.css'

// importing react-router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// chakra ui
import { ChakraProvider } from '@chakra-ui/react'

// redux
import { store } from './app/store'
import { Provider } from 'react-redux'

// mapping path to components
const router  = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
  },
  {
    path:'/chats',
    element:<ChatPage/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <RouterProvider router = {router}/>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
)
