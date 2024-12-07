import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import DrugDetail from './components/DrugDetail';

function App() {
  return (
   <Router>
     <div>
       <h1>XOGENE LOGO</h1>
       <h1>Search for Drug</h1>
       <SearchBar />
       <Routes>
         <Route path="/drugs/:drug_name" element={<DrugDetail />}/>
       </Routes>
     </div>
   </Router>
  );
}

export default App;