import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Home from './pages/Home.jsx'
import useWindowSize from "./hooks/useWindowSize";
import Hospital from "./pages/Hospital";
import Disease from "./pages/Disease";
import Treatment from "./pages/Treatment";
import Symptom from "./pages/Symptom";
import DiseaseList from "./pages/DiseaseList";


function App() {
  const { height: winHeight, width: winWidth } = useWindowSize();

  return (
    
      <div className="App" style={{minHeight: winHeight, minWidth: winWidth, backgroundColor: "#ffeedd",}}>
        <BrowserRouter>
          <Routes>
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/hospital/:key" element={<Hospital/>}/>
              <Route exact path="/disease/:key" element={<Disease/>}/>
              <Route exact path="/diseaseList" element={<DiseaseList/>}/>
              <Route exact path="/symptom/:key" element={<Symptom/>}/>
              <Route exact path="/treatment/:key" element={<Treatment/>}/>

          </Routes>
        </BrowserRouter>
      </div>
    
  );
}

export default App;
