
import React from 'react'
import { Redirect } from "react-router-dom"

import CookieStorage from '../../lib/cookie'
import config from '../../lib/config'

class LogIn extends React.PureComponent{
  constructor( props ){
    super( props )

    this.logIn = this.logIn.bind( this )
    this.state = {
      isLoggedIn: LogIn.isLoggedIn()
    }
  }

  async fetchLogIn( username, password ){
    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }

    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/login`, init )
    }
    catch( err ){
      debugger
    }

    const data = await response.json()
    if( response.status === 200 ){
      const expires = new Date( data.expires )
      const maxAge = Math.floor( (expires.getTime() - Date.now()) / 1000 )
      CookieStorage.set( 'authorization', data.token, { expires, maxAge })
      this.setState({ isLoggedIn: true })
    }
    //else if( response.status === 401 ){
    //  data = await response.json()
    //}
    else{
      alert( `Oops: ${data.code} - ${data.message}` )
    }
  }

  static isLoggedIn(){
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  logIn( e ){
    if( e.cancelable )
      e.preventDefault()

    this.fetchLogIn( this.state.username, this.state.password )
  }

  render(){
    if( this.state.isLoggedIn )
      return <Redirect to="/history" />


    return (
      <div className="col-md-4 col-lg-3 col-xl-2 d-md-block bg-light sidebar">
        <form id="log-in-form">
          <fieldset form="log-in-form">
          <legend><h3>Log In</h3></legend>

            <div className="row">              
              <label className="form-label" htmlFor="username">Username:</label>
              <input id="username" name="username" autoComplete="username" type="text" onChange={e => this.setState({ 'username': e.target.value })} />
            </div>

            <div className="row">
              <label htmlFor="password">Password:</label>
              <input id="password" name="password" autoComplete="current-password" type="password" onChange={e => this.setState({ 'password': e.target.value })} />
            </div>

            <br />
            <button className="btn btn-primary float-right" onClick={this.logIn}>Log In</button>

          </fieldset>
        </form>
      </div>
    )
  }
}

export default LogIn
