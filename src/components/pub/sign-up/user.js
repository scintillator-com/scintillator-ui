
import React from 'react'

import CookieStorage from '../../../lib/cookie'
import config from '../../../lib/config'

import { ValidationError } from '../../../lib/errors'
import Validate from '../../../lib/validation'

import './user.css'

class UserSignUp extends React.PureComponent{
  formValidator = new Validate.Form({
    'email': [
      Validate.required( 'Please enter your {label}' ),
      Validate.email( 'Please check your {label}' )
    ],
    'first-name': [
      Validate.required( 'Please enter your {label}' )
    ],
    'last-name': [
      Validate.required( 'Please enter your {label}' )
    ],
    'password': [
      Validate.required( 'Please enter your {label}' ),
      input => {
        if( input.value.lenth < 8 )
          throw new ValidationError( "Password must be at least 8 characters" )
        
        if( !/\W/.test( input.value ) ||
          !/\d/.test( input.value ) ||
          !/A-Z/.test( input.value ) ||
          !/a-a/.test( input.value ) )
           throw new ValidationError( "Password must contain upper-case letters, lower-case letters, digits, and symbols", null, null, input )
      }
    ],
    'confirm-password': [
      Validate.required( 'Please verify your password', 'confirm-password-error' ),
      ( input, formData ) => {
        if( input.value !== formData.password )
          throw new ValidationError( "Both passwords must match", null, null, 'confirm-password-error' )
      }
    ]
  })

  constructor(){
    super()

    this.fetchCreateOrg  = this.fetchCreateOrg.bind( this )
    this.fetchCreateUser = this.fetchCreateUser.bind( this )
    //this.formValidator   = new FormFields( this.validators )
    this.handleSubmit    = this.handleSubmit.bind( this )

    this.state = {
      'fieldErrors': {}
    }
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
    const form = e.target
    if( e.cancelable )
      e.preventDefault()


    if( !this.validate( form ) )
      return


    const userArgs = {
      email:      form.email.value,
      first_name: form['first-name'].value, 
      last_name:  form['last-name'].value,
      password:   form.password.value
    }
    let result = await this.fetchCreateUser( userArgs )
    if( !result )
      return


    const orgArgs = {
      name: form.org,
      plan: form.plan
    }
    this.fetchCreateOrg( orgArgs )
  }

  validate( form ){
    const fieldErrors = {}

    try{
      for( let err of this.formValidator.validate( form ) ){
        fieldErrors[ err.input.name ] = err.message
      }
    }
    catch( err ){
      alert( String( err ) )
      return false
    }

    this.setState({ fieldErrors })
    return Object.keys( fieldErrors ).length === 0
  }

  render(){
    return (
      <form id="user-sign-up" className="form-group" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-md-5 col-lg-5 col-xl-5 d-md-block bg-light">
            <fieldset form="user-sign-up">
              <legend><h3>Create User</h3></legend>

              <div className="row">
                <label className="mt-1" htmlFor="email">E-mail:</label>
                <input id="email" className="mt-0" type="text" name="email" data-label="e-mail address" />
                <small id="email-error" className="error">{this.state.fieldErrors.email || ''}</small>
              </div>

              <div className="row">
                <label className="mt-1" htmlFor="confirm-email">Confirm E-mail:</label>
                <input id="confirm-email" className="mt-0" type="text" name="confirm-email" data-label="e-mail address" />
                <small id="confirm-email-error" className="error">{this.state.fieldErrors['confirm-email'] || ''}</small>
              </div>

              <div className="row">
                <label className="mt-1" htmlFor="first-name">First Name:</label>
                <input id="first-name" className="mt-0" type="text" name="first-name"  data-label="first name" />
                <small id="first-name-error" className="error">{this.state.fieldErrors['first-name'] || ''}</small>
              </div>

              <div className="row">
                <label className="mt-1" htmlFor="last-name">Last Name:</label>
                <input id="last-name" className="mt-0" type="text" name="last-name" data-label="last name" />
                <small id="last-name-error" className="error">{this.state.fieldErrors['last-name'] || ''}</small>
              </div>

              <div className="row">
                <label className="mt-1" htmlFor="password">Password:</label>
                <input id="password" className="mt-0" type="password" name="password" data-label="password" />
                <small id="password-error" className="error">{this.state.fieldErrors.password}</small>
              </div>

              <div className="row">
                <label className="mt-1" htmlFor="confirm-password">Confirm Password:</label>
                <input id="confirm-password" className="mt-0" type="password" name="confirm-password" />
                <small id="confirm-password-error" className="error">{this.state.fieldErrors['confirm-password']}</small>
              </div>

              <br />
              <button className="btn btn-primary float-right">Register</button>

            </fieldset>
          </div>
          <div className="col-md-5 col-lg-5 col-xl-5 d-md-block bg-light">
            <fieldset>
              <legend>My Org</legend>
            </fieldset>
          </div>
        </div>
      </form>
    )
  }
}

export default UserSignUp
