import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { forEach } from 'lodash'

forEach([1,2], console.log)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
