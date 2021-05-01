
import React from 'react'

import CookieStorage from '../../../lib/cookie'
import { ValidationError } from '../../../lib/errors'
import Validate from '../../../lib/validation'

import './user.css'
import Scintillator from '../../../lib/api'

class UserSignUp extends React.PureComponent{
  formValidator = new Validate.Form({
    'organization': [
      Validate.required( 'Please enter your {label}' )
    ],
    'plan': [
      Validate.required( 'Please enter your {label}' )
    ],
    'email': [
      Validate.required( 'Please enter your {label}' ),
      Validate.email( 'Please check your {label}' )
    ],
    'confirm-email': [
      Validate.required( 'Please verify your e-mail address' ),
      Validate.email( 'Please verify your e-mail address' )
    ],
    'first-name': [
      Validate.required( 'Please enter your {label}' )
    ],
    'last-name': [
      Validate.required( 'Please enter your {label}' )
    ],
    'password': [
      Validate.required( 'Please enter your {label}' ),
      (input, allData) => {
        if( input.value.length < 12 ){
          const message = Validate.Form.getMessage( "Your {label} must be at least 12 characters", input, allData )
          throw new ValidationError( message, null, null, input )
        }
        
        if( !/\d/.test( input.value ) ||
          !/[A-Z]/.test( input.value ) ||
          !/[a-z]/.test( input.value ) ||
          !/[^\dA-Z]/i.test( input.value )){
            const message = Validate.Form.getMessage( "Your {label} must contain upper-case letters, lower-case letters, digits, and symbols", input, allData )
            throw new ValidationError( message, null, null, input )
          }
      }
    ],
    'confirm-password': [
      Validate.required( 'Please verify your password' ),
      ( input, formData ) => {
        if( input.value !== formData.password )
          throw new ValidationError( "Both passwords must match", null, null, input )
      }
    ]
  })

  constructor(){
    super()

    this.postOrg  = this.postOrg.bind( this )
    this.postUser = this.postUser.bind( this )
    //this.formValidator   = new FormFields( this.validators )
    this.handleSubmit    = this.handleSubmit.bind( this )

    this.state = {
      'fieldErrors': {}
    }
  }

  async postOrg( args ){
    debugger

    let response
    try{
      response = await Scintillator.fetchCreateOrg( args )
    }
    catch( err ){
      alert( `Oops please try again soon` )
      return false
    }

    if( response.ok ){
    //if( response.status === 201 ){
      const data = await response.json()
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
      const data = await response.json()
      alert( `Oops: ${data.code} - ${data.message}` )
      return false
    }
  }

  async postUser( args ){
    let response
    try{
      response = await Scintillator.fetchCreateUser( args )
    }
    catch( err ){
      alert( `Oops please try again soon` )
      return false
    }

    if( response.ok ){
    //if( response.status === 201 ){
      const data = await response.json()
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
      const data = await response.json()
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
    let result = await this.postUser( userArgs )
    if( !result )
      return


    const orgArgs = {
      name: form.organization.value,
      plan: form.plan.value
    }
    result = this.postOrg( orgArgs )
    if( result ){
      //redirect to dashboard
    }
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
        <div className="row justify-content-center">
          <div className="col-4 d-md-block bg-light">
            <fieldset style={{ marginBottom: '2em' }}>
              <legend><h3>My Org</h3></legend>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="organization">Organization:</label>
                  <input id="organization" className="mt-0 form-control" type="text" name="organization" autoComplete="organization" data-label="organization" />
                  <small id="organization-error" className="error">{this.state.fieldErrors.organization}&nbsp;</small>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="plan">Plan:</label>
                  <select id="plan" className="mt-0 form-control" name="plan" data-label="plan">
                    <option value="free">free</option>
                  </select>
                  <small id="plan-error" className="error">{this.state.fieldErrors.plan}&nbsp;</small>
                </div>
              </div>
            </fieldset>

            <fieldset form="user-sign-up input-group">
              <legend><h3>Create User</h3></legend>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="email">E-mail:</label>
                  <input id="email" className="mt-0 form-control" type="text" name="email" autoComplete="email" data-label="e-mail address" />
                  <small id="email-error" className="error">{this.state.fieldErrors.email}&nbsp;</small>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="confirm-email">Confirm E-mail:</label>
                  <input id="confirm-email" className="mt-0 form-control" type="text" name="confirm-email" autoComplete="email" data-label="e-mail address" />
                  <small id="confirm-email-error" className="error">{this.state.fieldErrors['confirm-email']}&nbsp;</small>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="first-name">First Name:</label>
                  <input id="first-name" className="mt-0 form-control" type="text" name="first-name" autoComplete="given-name" data-label="first name" />
                  <small id="first-name-error" className="error">{this.state.fieldErrors['first-name']}&nbsp;</small>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="last-name">Last Name:</label>
                  <input id="last-name" className="mt-0 form-control" type="text" name="last-name" autoComplete="family-name" data-label="last name" />
                  <small id="last-name-error" className="error">{this.state.fieldErrors['last-name']}&nbsp;</small>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="password">Password:</label>
                  <input id="password" className="mt-0 form-control" type="password" name="password" autoComplete="new-password" data-label="password" />
                  <small id="password-error" className="error">{this.state.fieldErrors.password}&nbsp;</small>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="mt-1 form-label" htmlFor="confirm-password">Confirm Password:</label>
                  <input id="confirm-password" className="mt-0 form-control" type="password" name="confirm-password" autoComplete="new-password" data-label="confirmation password" />
                  <small id="confirm-password-error" className="error">{this.state.fieldErrors['confirm-password']}&nbsp;</small>
                </div>
              </div>

            </fieldset>

            <br />
            <button className="btn btn-primary float-right">Register</button>
          </div>
        </div>
      </form>
    )
  }
}

export default UserSignUp
