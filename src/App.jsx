
import './App.css'
import Contact from './components/forms';
import Menu from './components/Menu'
import {database} from "./config/firebase"; // initialize FB connection

function App() {

  return (
    <>
      {/* <Menu /> */}


      <Contact />
    </>
  )
}

export default App
