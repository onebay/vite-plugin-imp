import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Button } from 'antd'
import { Image } from '@arco-design/web-react'
import { Checkbox } from 'antd-mobile';
import { Avatar } from '@mui/material';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <Image src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <Button type="primary" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </Button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p> <Checkbox onChange={checked => console.log(checked)}>antd mobile</Checkbox></p>
        <p>
          <Image
            width={200}
            src='//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'
          />
        </p>
        <p><Avatar alt="Remy Sharp" src={logo} />
</p>
      </header>
    </div>
  )
}

export default App
