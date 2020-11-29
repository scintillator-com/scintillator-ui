
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import History from './components/history.js'
import Moment from './components/moment.js'

import './css/core.css'

function App() {
  return (
    <div id="page">
      <BrowserRouter>
        <header>
        </header>

        <nav style={{float: 'left; width: 200px'}}>
          <h1>LOGO</h1>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li>Tools</li>
            <li>Settings</li>
          </ul>
        </nav>

        <main style={{ marginLeft: '200px' }}>
          <Switch>
            <Route exact path="/" component={History} />
            <Route path="/moment/:momentId" component={Moment} />
            <Route path="/*">404</Route>
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App
