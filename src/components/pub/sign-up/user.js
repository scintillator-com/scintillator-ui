
import React from 'react'

import CookieStorage from '../../../lib/cookie'
import config from '../../../lib/config'

class UserSignUp extends React.PureComponent{
  constructor(){
    super()
    //TODO: if password and confirm-password, compare

    this.fetchCreateOrg  = this.fetchCreateOrg.bind( this )
    this.fetchCreateUser = this.fetchCreateUser.bind( this )
    this.handleSubmit    = this.handleSubmit.bind( this )
  }

  async fetchCreateOrg( args ){
    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( args )
    }

    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/org`, init )
    }
    catch( err ){
      debugger
    }

    const data = await response.json()
    if( response.status === 201 ){
      const authorization = data.authorization
      const expires = new Date( authorization.expires )
      const maxAge = Math.floor( (expires.getTime() - Date.now()) / 1000 )
      CookieStorage.set( 'authorization', authorization.token, { expires, maxAge })
      return true
    }
    //else if( response.status === 401 ){
    //  data = await response.json()
    //}
    else{
      alert( `Oops: ${data.code} - ${data.message}` )
      return false
    }
  }

  async fetchCreateUser( args ){
    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( args )
    }

    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/user`, init )
    }
    catch( err ){
      debugger
    }

    const data = await response.json()
    if( response.status === 201 ){
      const authorization = data.authorization
      const expires = new Date( authorization.expires )
      const maxAge = Math.floor( (expires.getTime() - Date.now()) / 1000 )
      CookieStorage.set( 'authorization', authorization.token, { expires, maxAge })
      return true
    }
    //else if( response.status === 401 ){
    //  data = await response.json()
    //}
    else{
      alert( `Oops: ${data.code} - ${data.message}` )
      return false
    }
  }

  async handleSubmit( e ){
    if( e.cancelable )
      e.preventDefault()

    if( !this.validatePasswords() )
      return


    const userArgs = {
      email:      "c.esquibel5@scintillator.com",
      first_name: "Chris", 
      last_name:  "Esquibel",
      password:   "password1234"
    }
    let result = await this.fetchCreateUser( userArgs )
    if( !result )
      return


    const orgArgs = {
      name: "Scintillator",
      plan: "free"
    }
    result = this.fetchCreateOrg( orgArgs )
    if( !result )
      return
  }

  render(){
    return (
      <div className="col-md-4 col-lg-3 col-xl-2 d-md-block bg-light">
        <form id="user-sign-up" className="form-group">
          <fieldset form="user-sign-up">
            <fieldset><h3>Create User</h3></fieldset>

            <div className="row">
              <label className="mt-1" for="email">E-mail:</label>
              <input id="email" className="mt-0" type="text"  name="email" />
            </div>

            <div className="row">
              <label className="mt-1" for="first-name">First Name:</label>
              <input id="first-name" className="mt-0" type="text" name="first-name" />
            </div>

            <div className="row">
              <label className="mt-1" for="last-name">Last Name:</label>
              <input id="last-name" className="mt-0" type="text" name="last-name" />
            </div>

            <div className="row">
              <label className="mt-1" for="password">Password:</label>
              <input id="password" className="mt-0" type="password" name="password" />
            </div>

            <div className="row">
              <label className="mt-1" for="confirm-password">Password:</label>
              <input id="confirm-password" className="mt-0" type="password" name="confirm-password" />
            </div>

            <br />
            <button className="btn btn-primary float-right">Register</button>

          </fieldset>
        </form>
      </div>
    )
  }
}

export default UserSignUp
