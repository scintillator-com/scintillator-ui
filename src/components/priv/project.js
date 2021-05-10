
import React from 'react'
import { Link, Redirect } from "react-router-dom"

import {LockIcon, UnlockIcon} from '@primer/octicons-react'

import CookieStorage from '../../lib/cookie'
import Scintillator from '../../lib/api'

class Project extends React.PureComponent{
  constructor( props ){
    super( props )

    this.unlockProject = this.unlockProject.bind( this )
  }

  componentDidMount(){
    Scintillator.listProjects()
      .then( async ( response ) => {
        const projects = await response.json() || []
        this.props.setProjects( projects )
      })
  }

  render(){
    if( !Scintillator.isLoggedIn() )
      return <Redirect to="/" />


    if( !this.props.projects ){
      return (
        <span>No data yet...</span>
      )
    }


    if( !this.props.projects.length ){
      return (
        <span>No projects, start coding</span>
      )
    }

    console.log( `rendering ${this.props.projects.length} project(s)` )
    return (
      <div className="projects">
        {this.props.projects.map( project => {
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
              <Link to={`/project/${project.host}`} key={project.host} className="project">
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

  async unlockProject( e, project ){
    if( e.cancelable )
      e.preventDefault()

    let response
    try{
      response = await Scintillator.unlockProject( project )
    }
    catch( err ){
      alert( `Oops please try again soon` )
      return false
    }

    if( response.ok ){
    //if( response.status === 201 ){
      let data = await response.json()
      console.debug( data )

      response = await Scintillator.listProjects()
      const projects = await response.json() || []
      this.props.setProjects( projects )
    }
    //401 Unauthorized: please login
    //402 Payment Required: please upgrade or prompt for purchase
    else if( response.status === 402 ){
      //TODO: this.promptPurchaseProject = project
      //const data = await response.json()
      alert( "Payment Required: please upgrade or purchase more projects... (not implemented)" )
      //return data
    }
    //409 Conflict: please contact support
    else{
      const data = await response.json()
      throw new Error( `Oops: ${data.code} - ${data.message}` )
    }
  }
}

export default Project
