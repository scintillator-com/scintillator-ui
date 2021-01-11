
import React from 'react'
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"

//public
import _404 from './components/pub/404.js'
import Default from './components/default.js'

//private
import Dashboard from './components/priv/dashboard.js'
import History from './components/priv/history.js'

//mixed
import Moment from './components/moment.js'

//data
import CookieStorage from './lib/cookie'


class App extends React.PureComponent{
  constructor(){
    super()

    this.onLogin = this.onLogin.bind( this )
  }

  static isLoggedIn(){
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  onLogin(){
    this.forceUpdate()
  }

  render(){
    return (
      <div id="page">
        <BrowserRouter>
          {this.renderHeader()}
          {this.renderMain()}
        </BrowserRouter>
      </div>
    )
  }

  renderHeader(){
    return (
      <header>
        <h1><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Scintillator</Link></h1>
      </header>
    )
  }

  renderLeftNav(){
    if( App.isLoggedIn() ){
      return (
        <nav id="left-nav" className="col-md-4 col-lg-3 col-xl-2 d-md-block bg-light sidebar">
          <h1>LOGO</h1>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li>Tools</li>
            <li>Settings</li>
          </ul>
        </nav>
      )
    }
    else{
      return (
        <nav id="left-nav" className="col-md-4 col-lg-3 col-xl-2 d-md-block bg-light sidebar" />
      )
    }
  }

  renderMain(){
    return (
      <div className="container-fluid">
        <div className="row">
          {this.renderLeftNav()}

          <main id="main" className="col-md-8 col-lg-9 col-xl-10 ml-sm-auto pt-3 px-4">
            <Switch>
              <Route exact path="/">
                <Default onLogin={this.onLogin} />
              </Route>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/history/:project" component={History} />
              <Route path="/moment/:momentId" render={props => <Moment {...props} />} />
              <Route path="/*" component={_404}>404</Route>
            </Switch>
          </main>
        </div>
      </div>
    )
  }
}

export default App
