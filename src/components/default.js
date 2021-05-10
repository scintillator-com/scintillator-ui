
import React from 'react'
import { Link, Redirect } from "react-router-dom"

import LogIn from './pub/log-in'

import Scintillator from '../lib/api'

function Default( props ){
  if( Scintillator.isLoggedIn() ){
    return <Redirect to="/projects" />
  }
  else{
    return (
      <div className="row justify-content-center">
        <div className="col-md-8 col-xs-11 py-4">
          <div className="container-fluid my-4">
            <span className="fs-1 fw-bold"> Let your code luminesce </span>
            <p>Scintillator is the only platform to cultivate the entire API integration lifecycle for developers and their teams.  Our seamless gateways makes it easy to research, integrate, and test APIs.  And our machine learning architecture provides language and library specific models, high quality code, and automated testing to deliver solid results. </p>
          </div>
          <div className="container-fluid">
            <Link to="/sign-up"><button className="btn btn-primary">Sign Up</button></Link>
          </div>
          <div className="container-fluid" style={{margin: '6rem 0 0 0'}}>
            <div className="bg-dark subject-text">
              <p className="text-white fw-bold fs-2 px-2 mb-0">Ease into a new kind of API development</p>
            </div>
            <div className="container my-2">
              <p> Examples and Visuals n shit. </p>
            </div>

          </div>
        </div>
        <LogIn onLogin={props.onLogin} /> 
      </div>
    )
  }
}

export default Default
