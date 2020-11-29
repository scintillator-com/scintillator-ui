
import React from 'react'

import './snippet-modal.css'

class SnippetModal extends React.PureComponent{
  constructor( props ){
    super( props )

    this.state = {
      'snippet': {
        '_id': null,
        'formatter': {
          'name':     'js-fetch',
          'language': 'js',
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
    this.upsetSnippet = this.upsetSnippet.bind( this )
  }

  handleChange( e ){
    this.setState( state => {
      //clone
      const snippet = {
        '_id': state.snippet._id,
        'formatter': {
          'name':     state.snippet.formatter.name,
          'language': state.snippet.formatter.language,
          'library':  state.snippet.formatter.library
        },
        'config': {
          'method':   state.snippet.config.method,
          'decode':   state.snippet.config.decode,
          'body_params':   state.snippet.config.body_params.slice(),
          'header_params': state.snippet.config.header_params.slice(),
          'query_params':  state.snippet.config.query_params.slice()
        }
      }

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

    return (
      <div id="snippet-wrapper">
        <div id="snippet">
          <a className="close" href="#close" onClick={this.props.handleModalClose}>×</a>
          <p>Select the arguments to use in your Snippet</p>
          <table style={{ marginLeft: 'auto', marginRight: 'auto', overflowX: 'hidden' }}>
          {this.renderRequest( this.props.moment.request, true )}
          </table>
          <br />
          <button style={{ float: 'right' }} onClick={this.upsetSnippet}>Create Snippet</button>
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
        <td><input type="checkbox" checked disabled /></td>
        <td><strong>{request.method}</strong></td>
        <td>{request.host} <span className="icon-lock">{request.scheme}</span></td>
      </tr>
      <tr>
        <td><input type="checkbox" checked disabled /></td>
        <td align="right">path</td>
        <td colSpan="2">{request.path}</td>
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
          <td><input type="checkbox" name="body_params" value={key} onChange={this.handleChange} /></td>
          <td>{key}</td>
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
        <td><input type="checkbox" name="header_params" value={h[k]} onChange={this.handleChange} /></td>
        <td>{h[k]}</td>
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
        <td><input type="checkbox" name="query_params" value={h[k]} onChange={this.handleChange} /></td>
        <td>{h[k]}</td>
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

  async upsetSnippet( e ){
    debugger

    const config = {
      'headers': {
        'Accept': 'application/json'
      }
    }

    let url
    if( this.state.snippet._id ){
      config.method = 'PUT'
      url = `http://192.168.1.31/api/1.0/snippet/${this.state.snippet._id}`
    }
    else{
      config.method = 'POST'
      url = 'http://192.168.1.31/api/1.0/snippet'
    }

    try{
      const res = await fetch( url, config )
      const data = await res.json()
      debugger
    }
    catch( err ){
      console.warn( String(err) )
    }
  }
}

export default SnippetModal
