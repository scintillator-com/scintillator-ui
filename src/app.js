
import React from 'react'
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"

//public
import _404 from './components/pub/404.js'
import Default from './components/default.js'
import UserSignUp from './components/pub/sign-up/user.js'

//private
import History from './components/priv/history.js'
import Project from './components/priv/project.js'

//mixed
import Moment from './components/moment.js'


//data
import CookieStorage from './lib/cookie'
import Scintillator from './lib/api'

import {ChevronDownIcon, ChevronRightIcon} from '@primer/octicons-react'

class App extends React.PureComponent{
  constructor(){
    super()

    this.state = {
      'projects': []
    }

    this.onLogin = this.onLogin.bind( this )
    this.setProjects = this.setProjects.bind( this )
  }

  static isLoggedIn(){
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  onLogin(){
    Scintillator.fetchProjects()
      .then( projects => {
        if( projects && projects.length )
          this.setProjects( projects )
        else
          this.forceUpdate()
      })
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
      let journalClass = null
      if( window.location.pathname.indexOf( '/journal' ) === 0 )
        journalClass = 'expanded'


      let projects = null
      let projectClass = null
      if( this.state.projects?.length ){
        if( window.location.pathname.indexOf( '/project' ) === 0 )
          projectClass = 'expanded'

        //TODO: lock icon
        projects = (
          <ul>
            {this.state.projects.map( project => {
              return (
                <li key={project.host}><Link to={`/project/${project.host}`}>{project.host}</Link></li>
              )
            })}
          </ul>
        )
      }

      return (
        <nav id="left-nav" className="col-md-4 col-lg-3 col-xl-2 d-md-block bg-light sidebar">
          <ul>
            {/* <li><Link to="/"><h3>Dashboard</h3></Link></li> */}
            <li className={projectClass}>
              <Link to="/projects">
                <h3>Projects
                  <span className="collapse"><ChevronDownIcon /></span>
                  <span className="expand"><ChevronRightIcon /></span>
                </h3>
              </Link>
              {projects}
            </li>
            <li className={journalClass}>
              <Link to="/journal">
                <h3>Journal
                  <span className="collapse"><ChevronDownIcon /></span>
                  <span className="expand"><ChevronRightIcon /></span>
                </h3>
              </Link>
              <ul>
                <li>Day</li>
                <li>Week</li>
              </ul>
            </li>
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
              <Route path="/project/:project" component={History} />
              <Route path="/projects" render={props => <Project {...props} projects={this.state.projects} setProjects={this.setProjects} />} />
              <Route path="/moment/:momentId" render={props => <Moment {...props} />} />
              <Route path="/sign-up" component={UserSignUp} />
              <Route path="/*" component={_404}>404</Route>
            </Switch>
          </main>
        </div>
      </div>
    )
  }

  setProjects( projects ){
    this.setState({ projects })
  }
}

export default App
