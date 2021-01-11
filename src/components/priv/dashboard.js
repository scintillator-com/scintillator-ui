
import React from 'react'
import { Link, Redirect } from "react-router-dom"

import {LockIcon, UnlockIcon} from '@primer/octicons-react'

import CookieStorage from '../../lib/cookie'
import config from '../../lib/config'

class Dashboard extends React.PureComponent{
  constructor( props ){
    super( props )

    this.state = {
      'projects': null
    }

    this.unlockProject = this.unlockProject.bind( this )
  }

  componentDidMount(){
    this.fetchProjects() 
  }

  async fetchProjects( page, filters ){
    if( !page )
      page = 1

    const query = new URLSearchParams( `page=${page}&pageSize=5` )
    if( filters && Object.keys( filters ).length ){
      for( let [ key, value ] of Object.entries( filters ) ){
        query.append( key, value )
      }
    }

    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`
      }
    }

    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/project?${query}`, init )
    }
    catch( err ){
      console.warn( String(err) )
      //no response...
      return
    }

    let data = {}
    try{
      data = await response.json()
    }
    catch( err ){
      console.warn( String(err) )
    }

    if( response.status === 200 ){
      data.forEach( project => {
        project.created = new Date( project.created )
      })
      this.setState({ 'projects': data })
    }
    else{
      console.warn( data )
    }
  }

  //TODO: optimize
  async fetchUnlockProject( project ){
    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'PATCH',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'host': project.host
      })
    }
debugger
    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/project`, init )
    }
    catch( err ){
      console.warn( String(err) )
      //no response...
      return
    }

    let data = {}
    try{
      data = await response.json()
    }
    catch( err ){
      console.warn( String(err) )
    }

    if( response.status === 201 ){

    }
    //401 Unauthorized: please login
    //402 Payment Required: please upgrade or prompt for purchase 
    //409 Conflict: please contact support
    else{
      //oops
      console.warn( data )
      throw new Error()
    }
  }

  static isLoggedIn(){
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  render(){
    if( !Dashboard.isLoggedIn() )
      return <Redirect to="/" />


    if( !this.state.projects ){
      return (
        <span>Loading...</span>
      )
    }


    if( !this.state.projects.length ){
      return (
        <span>No projects, start coding</span>
      )
    }

    console.log( `rendering ${this.state.projects.length} project(s)` )
    return (
      <div className="projects">
        {this.state.projects.map( project => {
          if( project.is_locked ){
            return (
              <div key={project.host} className="project" onClick={e => this.unlockProject( e, project )}>
                <LockIcon className="octicon locked" />
                <span className="moments">{project.moments} Moments</span>
                <span className="host">{project.host}</span>
              </div>
            )
          }
          else{
            return (
              <Link to={`/history/${project.host}`} key={project.host} className="project">
                <UnlockIcon className="octicon unlocked"/>
                <span className="moments">{project.moments} Moments</span>
                <span className="host">{project.host}</span>
              </Link>
            )
          }
        })}
      </div>
    )
  }

  unlockProject( e, project ){
    if( e.cancelable )
      e.preventDefault()

    this.fetchUnlockProject( project )
      .then( this.fetchProjects )
      .catch( err => {
        //ignored
      })
  }
}

export default Dashboard
