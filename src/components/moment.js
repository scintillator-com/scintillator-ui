
import React from 'react'
import { Link, Redirect } from "react-router-dom"

import SnippetModal from './snippet-modal'

import CookieStorage from '../lib/cookie'
import Scintillator from '../lib/api'

import {LockIcon, UnlockIcon} from '@primer/octicons-react'


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
    let response = null
    try{
      response = await Scintillator.fetchMoment( id )
    }
    catch( err ){
      alert( `Oops please try again soon` )
      return false
    }

    if( response.ok ){
    //if( response.status === 200 ){
      const data = await response.json()
      if( data ){
        this.setState({ 'moment': data })
      }
    }
    else{
      const data = await response.json()
      alert( `Oops: ${data.code} - ${data.message}` )
      return false
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

        <Link to="/projects">Projects</Link> &gt;&nbsp;
        <Link to={`/project/${this.state.moment.request.host}`}>{this.state.moment.request.host}</Link>

        <table id="moment">
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
            <td className="key no-wrap">{h.k}</td>
            <td className="value">{h.v}</td>
          </tr>
        ))
      }
      else if( 'key' in headers[0] ){
        headers.sort(( l, r ) => { return l.index - r.index })
        return headers.map( h => (
          <tr key={h.key}>
            <td className="key no-wrap">{h.key}</td>
            <td className="value">{h.value}</td>
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
    let query = null
    if( request.query_string ){
      query = (
        <tr>
          <td>query</td>
          <td align="right" colSpan="2">?{request.query_string}</td>
        </tr>
      )
    }


    let schemeIcon
    if( request.scheme === 'https' ){
      schemeIcon = <LockIcon className="green" />
    }
    else{
      schemeIcon = <UnlockIcon />
    }


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
        <td>{schemeIcon} {request.host}</td>
      </tr>
      <tr>
        <td>path</td>
        <td colSpan="2">{request.path}</td>
        </tr>
      {query}
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
