import { Navigation } from './Components/Navigation/Navigation';
import { Home } from './Components/Home/Home';

import { Routes, Route } from 'react-router-dom';
import Portfolio from './Components/Portfolio/Portfolio';
import './App.css';
import './GlobalStyles.scss'
import { HashRouter as Router } from 'react-router-dom';
function App() {
  return (
    <Router basename='/'>
      <div className="App">
        <Navigation />
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path='/portfolio' element={<Portfolio />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
