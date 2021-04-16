import './App.scss';
import logo from './images/my-palette-logo.png'

function App() {
  return (
    <div className="container">
      <div className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/#">
            <img alt="my palette logo" src={logo}/>
            <p className="logo">&nbsp;My Palette</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
