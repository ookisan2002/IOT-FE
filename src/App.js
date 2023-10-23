import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './Component/Sidebar';
import History from './pages/History';
import Profile from './pages/Profile';
import SensorData from './pages/SensorData';


function App() {
  return (
    <div className="App  w-full h-full flex">
      <Sidebar/>
      <Routes>
        <Route path="/sensor" element={<SensorData />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
