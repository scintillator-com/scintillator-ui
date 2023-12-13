
import React from 'react'

import CookieStorage from '../../lib/cookie'
import Scintillator from '../../lib/api'


class LogIn extends React.PureComponent{
  constructor( props ){
    super( props )

    this.logIn = this.logIn.bind( this )
  }

  static isLoggedIn(){
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  logIn( e ){
    if( e.cancelable )
      e.preventDefault()

    Scintillator.fetchLogIn( this.state.username, this.state.password )
      .then( async ( response ) => {
        if( response.status === 200 ){
          const data = await response.json()
          const expires = new Date( data.expires )
          const maxAge = Math.floor( (expires.getTime() - Date.now()) / 1000 )
          CookieStorage.set( 'authorization', data.token, { expires, maxAge })
          this.props.onLogin()
        }
        //else if( response.status === 401 ){
        //  data = await response.json()
        //}
        else{
          const data = await response.json()
          throw new Error( `Oops: ${data.code} - ${data.message}` )
        }
      })
      .catch( err => {
        alert( `Oops please try again soon` )
      })
  }

  render(){
    return (
      <div className="col-md-4 col-lg-3 col-xl-2 d-md-block bg-light sidebar">
        <form id="log-in-form">
          <fieldset form="log-in-form">
          <legend><h3>Log In</h3></legend>

            <div className="row">
              <label className="form-label" htmlFor="username">Username <small>(E-mail)</small>:</label>
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
