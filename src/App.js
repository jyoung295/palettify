import './App.scss';
import logo from './images/my-palette-logo.png'

//fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'

import Upload from './upload/Upload'


library.add(faFileUpload)

const App = () => {

  const collectFile = (file) => {
    console.log(file)
  }
  
  return (
    <>
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
      <div className="section is-medium">
        <div className="container">
          <Upload collectFile={collectFile}/>
        </div>
      </div>
    </>
  );
}

export default App;
