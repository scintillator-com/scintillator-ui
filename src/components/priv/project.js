
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
    Scintillator.fetchProjects()
      .then( this.props.setProjects )
  }

  static isLoggedIn(){
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  render(){
    if( !Project.isLoggedIn() )
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

  unlockProject( e, project ){
    if( e.cancelable )
      e.preventDefault()

    Scintillator.fetchUnlockProject( project )
      .then( Scintillator.fetchProjects )
      .catch( err => {
        //ignored
      })
  }
}

export default Project
