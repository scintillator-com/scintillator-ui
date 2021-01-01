
import React from 'react'
import { Redirect } from "react-router-dom"

import SnippetModal from './snippet-modal'

import CookieStorage from '../lib/cookie'
import config from '../lib/config'

class Moment extends React.PureComponent{
  constructor( props ){
    super( props )

    this.state = {
      'moment': null,
      'showSnippetModal': false
    }

    this.handleModalClose = this.handleModalClose.bind( this )
    this.renderModal = this.renderModal.bind( this )
    this.renderRequest = this.renderRequest.bind( this )
    this.showSnippetModal = this.showSnippetModal.bind( this )
  }

  componentDidMount(){
    this.fetchMoment( this.props.match.params.momentId )
  }

  async fetchMoment( id ){
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
      response = await fetch( `${config.baseURL}/api/1.0/moment/${id}`, init )
    }
    catch( err ){
      console.warn( String(err) )
    }

    if( response ){
      const data = await response.json()
      if( response.status === 200 ){
        if( data ){
          this.setState({ 'moment': data })
        }
      }
    }
  }

  handleModalClose( e ){
    if( e.cancelable )
      e.preventDefault()

    this.setState({ 'showSnippetModal': false })
  }

  static isLoggedIn(){
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  render(){
    if( !Moment.isLoggedIn() )
      return <Redirect to="/" />


    if( !this.state.moment ){
      return (
        <span>Loading...</span>
      )
    }

    return (
      <>
        {this.state.showSnippetModal ?
          this.renderModal( this.state.moment ) : null}

        <table>
        {this.renderRequest( this.state.moment.request )}
        {Moment.renderResponse( this.state.moment.response )}
        </table>
      </>
    )
  }

  static renderBody( body ){
    if( body ){
      return null
    }
    else{
      return null
    }
  }

  static renderHeaders( headers ){
    if( headers && headers.length ){
      if( 'k' in headers[0] ){
        headers.sort(( l, r ) => { return l.i - r.i })
        return headers.map( h => (
          <tr key={h.k}>
            <td>{h.k}</td>
            <td>{h.v}</td>
          </tr>
        ))
      }
      else if( 'key' in headers[0] ){
        headers.sort(( l, r ) => { return l.index - r.index })
        return headers.map( h => (
          <tr key={h.key}>
            <td>{h.key}</td>
            <td>{h.value}</td>
          </tr>
        ))
      }
      else{
        return null
      }
    }
    else{
      return null
    }
  }

  renderModal( moment ){
    return <SnippetModal handleModalClose={this.handleModalClose} moment={moment} />
  }

  renderRequest( request ){
    return (
      <tbody>
      <tr>
        <td colSpan="2" style={{ background: '#ccc' }}>
          <a href="#snippet" style={{ float: 'right' }} onClick={this.showSnippetModal}>Create Snippet</a>
          <h3>Request</h3>
        </td>
      </tr>
      <tr>
        <td><strong>{request.method}</strong></td>
        <td>{request.host} <span className="icon-lock">{request.scheme}</span></td>
      </tr>
      <tr>
        <td align="right">path</td>
        <td colSpan="2">{request.path}</td>
        </tr>
      <tr>
      <td align="right">query</td>
        <td>{request.query_string}</td>
      </tr>
      {Moment.renderHeaders( request.headers )}
      {Moment.renderBody( request )}
      </tbody>
    )
  }

  static renderResponse( response ){
    return (
      <tbody>
      <tr>
        <td colSpan="2" style={{ background: '#ccc' }}><h3>Response</h3></td>
      </tr>
      <tr>
        <td><strong>Status</strong></td>
        <td>{response.status_code}</td>
      </tr>
      {Moment.renderHeaders( response.headers )}
      {Moment.renderBody( response )}
      </tbody>
    )
  }

  showSnippetModal( e ){
    if( e.cancelable )
      e.preventDefault()

    this.setState({ 'showSnippetModal': true })
  }
}

export default Moment
