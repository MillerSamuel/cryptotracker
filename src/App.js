import logo from './logo.svg';
import './App.css';
import MainPage from './Components/Mainpage';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Search from './Components/Search';

function App() {
  return (
    <div className="App">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous"></link>
      <h1>Crypto Tracker</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage></MainPage>}></Route>
          <Route path="/:searchTerm" element={<Search></Search>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
