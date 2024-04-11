import Header from  "./components/Header";
import Toolbar from "./components/Toolbar"
import WorkSpace from "./components/WorkSpace";
import { useState } from "react";

function App() {

  const [tool, setTool] = useState('hand')
  const [form, setForm] = useState('none')

  const handleChange = (tool) => {
    setTool(tool)
  }

  const handleFormChange = (form) => {
    setForm(form)
  }

  return (
    <div className="App">
      <Header handleFormChange={handleFormChange}/>
      <div className="workspace__wrapper">
        <Toolbar onChange={handleChange}/>
        <WorkSpace tool={tool} form={form} handleFormChange={handleFormChange}/>  
      </div>
    </div>
  );
}

export default App;
