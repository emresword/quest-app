import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import User from './components/User/User';
import Navbar from './components/NavBar/NavBar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/users/:userId" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
