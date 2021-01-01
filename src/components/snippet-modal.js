
import React from 'react'

import CookieStorage from '../lib/cookie'
import config from '../lib/config'

import './snippet-modal.css'

class SnippetModal extends React.PureComponent{
  constructor( props ){
    super( props )

    this.state = {
      'snippet': {
        'snippet_id': null,
        'moment_id': this.props.moment.moment_id,
        'formatter': {
          'name':     'js-fetch',
          'language': 'javascript', //
          'library':  'fetch'
        },
        'config': {
          'method': 'async',
          'decode': false,
          'body_params':   [],
          'header_params': [],
          'query_params':  []
        }
      }
    }

    this.handleChange = this.handleChange.bind( this )
    this.renderRequest = this.renderRequest.bind( this )
    this.upsertSnippet = this.upsertSnippet.bind( this )
  }

  static cloneSnippet( snippet ){
    return {
      'snippet_id': snippet.snippet_id,
      'moment_id': snippet.moment_id,
      'formatter': {
        'name':     snippet.formatter.name,
        'language': snippet.formatter.language,
        'library':  snippet.formatter.library
      },
      'config': {
        'method':   snippet.config.method,
        'decode':   snippet.config.decode,
        'body_params':   snippet.config.body_params.slice(),
        'header_params': snippet.config.header_params.slice(),
        'query_params':  snippet.config.query_params.slice()
      }
    }
  }

  handleChange( e ){
    this.setState( state => {
      const snippet = SnippetModal.cloneSnippet( state.snippet )

      //update
      let any = false
      const at = snippet.config[ e.target.name ].indexOf( e.target.value )
      if( e.target.checked ){
        if( at === -1 ){
          any = true
          snippet.config[ e.target.name ].push( e.target.value )
        }
      }
      else{
        if( at > -1 ){
          any = true
          snippet.config[ e.target.name ].splice( at, 1 )
        }
      }

      if( any ){
        return { snippet }
      }
    })
  }

  render(){
    if( !this.props.moment ){
      return (
        <span>Loading...</span>
      )
    }

    //TODO: if _id, provide preview...
    let operation = 'Create Snippet', preview = null
    if( this.state.snippet.snippet_id ){
      operation = 'Update Snippet'

      preview = (
        <>
          <hr style={{clear: 'both'}} />
          <iframe title="Snippet Preview" src={`${config.baseURL}/snippet.php?id=${this.state.snippet.snippet_id}`} height="500" width="100%"></iframe>
        </>
      )
    }

    return (
      <div id="snippet-wrapper" style={{ height: document.body.offsetHeight }}>
        <div id="snippet">
          <a className="close" href="#close" onClick={this.props.handleModalClose}>×</a>
          <p>Select the arguments to use in your Snippet</p>
          <table width="100%" style={{ marginLeft: 'auto', marginRight: 'auto', overflowX: 'hidden', tableLayout: 'fixed' }}>
          <colgroup>
            <col width="30" />
            <col width="150" />
            <col />
          </colgroup>
          {this.renderRequest( this.props.moment.request, true )}
          </table>
          <br />
          <button style={{ float: 'right' }} onClick={this.upsertSnippet}>{operation}</button>

          {preview}
        </div>
      </div>
    )
  }

  renderRequest( request ){
    return (
      <tbody>
      <tr>
        <td colSpan="3" style={{ background: '#ccc' }}>
          <h3>Request</h3>
        </td>
      </tr>
      <tr>
        <td className="tac"><input type="checkbox" checked disabled /></td>
        <td><strong>{request.method}</strong></td>
        <td>{request.host} <span className="icon-lock">{request.scheme}</span></td>
      </tr>
      <tr>
        <td className="tac"><input type="checkbox" checked disabled /></td>
        <td align="right">path</td>
        <td>{request.path}</td>
      </tr>

      {this.renderQuery( request )}
      {this.renderHeaders( request.headers )}
      {this.renderBody( request.body )}

      </tbody>
    )
  }

  renderBody( body ){
    if( !body || !Object.keys( body ).length )
      return null


    const rows = []
    for( let [ key, value ] of Object.entries( body ) ){
      rows.push(
        <tr key={`body-${key}`}>
          <td className="tac"><input type="checkbox" name="body_params" value={key} onChange={this.handleChange} /></td>
          <td className="no-wrap">{key}</td>
          <td className="fixed-300">{JSON.stringify(value)}</td>
        </tr>
      )
    }

    rows.unshift(
      <tr key="header">
        <td colSpan="3" style={{ background: '#ccc' }}>Body</td>
      </tr>
    )

    return rows
  }

  renderHeaders( headers ){
    if( !headers || !headers.length )
      return null

    let k, v
    if( 'k' in headers[0] ){
      //i = 'i'
      k = 'k'
      v = 'v'
    }
    else if( 'key' in headers[0] ){
      //i = 'index'
      k = 'key'
      v = 'value'
    }
    else{
      return null
    }

    headers.sort(( l, r ) => { return l[k] < r[k] ? -1 : 1 })
    const rows = headers.map( h => (
      <tr key={`header-${h[k]}`}>
        <td className="tac"><input type="checkbox" name="header_params" value={h[k]} onChange={this.handleChange} /></td>
        <td className="no-wrap">{h[k]}</td>
        <td className="fixed-300">{h[v]}</td>
      </tr>
    ))

    rows.unshift(
      <tr key="header">
        <td colSpan="3" style={{ background: '#ccc' }}>Headers</td>
      </tr>
    )

    return rows
  }

  renderQuery( request ){
    if( !request.query_data || !request.query_data.length )
      return null


    let k, v
    if( 'k' in request.query_data[0] ){
      //i = 'i'
      k = 'k'
      v = 'v'
    }
    else if( 'key' in request.query_data[0] ){
      //i = 'index'
      k = 'key'
      v = 'value'
    }
    else{
      return null
    }

    request.query_data.sort(( l, r ) => { return l[k] < r[k] ? -1 : 1 })
    const rows = request.query_data.map( h => (
      <tr key={`query-${h[k]}`}>
        <td className="tac"><input type="checkbox" name="query_params" value={h[k]} onChange={this.handleChange} /></td>
        <td className="no-wrap">{h[k]}</td>
        <td className="fixed-300">{h[v]}</td>
      </tr>
    ))


    rows.unshift(
      <tr key="header">
        <td colSpan="2" style={{ background: '#ccc' }}>Query</td>
        <td style={{ background: '#ccc' }}>?{request.query_string}</td>
      </tr>
    )

    return rows
  }

  async upsertSnippet( e ){
    if( e && e.cancelable )
      e.preventDefault()

    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( this.state.snippet )
    }

    let url = `${config.baseURL}/api/1.0/snippet`
    if( this.state.snippet.snippet_id ){
      init.method = 'PUT'
      url = `${config.baseURL}/api/1.0/snippet/${this.state.snippet.snippet_id}`
    }

    try{
      const res = await fetch( url, init )
      if( 200 <= res.status && res.status < 300 ){
        const data = await res.json()
        if( init.method === 'POST' ){
          this.setState( state => {
            const snippet = SnippetModal.cloneSnippet( state.snippet )
            snippet.snippet_id = data.snippet_id
            return { snippet }
          })
        }
        else{
          //NA
        }
      }
      else{
        //TODO
      }
    }
    catch( err ){
      console.error( String(err) )
    }
  }
}

export default SnippetModal
