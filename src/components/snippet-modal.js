
import React from 'react'

import config from '../lib/config'
import Scintillator from '../lib/api'

import './snippet-modal.css'

class SnippetModal extends React.PureComponent{
  constructor( props ){
    super( props )

    //TODO: props.generator from project

    this.state = {
      'generators': null,
      'themes':     [
        { name: 'default', label: 'Default' }
      ],

      //TODO: snippet model?
      'snippet': {
        'snippet_id': null,
        'moment_id': this.props.moment.moment_id,
        'generator': null,
        /*
          {
            'name':     'js-fetch',
            'language': 'javascript', //
            'library':  'fetch'
          },
        */
        'config': {
          //'method': 'async',
          //'decode': false,
          'body_params':   [],
          'header_params': [],
          'query_params':  []
        }
      }
    }

    this.handleArgsChange   = this.handleArgsChange.bind( this )
    this.handleGeneratorChange = this.handleGeneratorChange.bind( this )
    this.handleThemeChange  = this.handleThemeChange.bind( this )

    this.renderRequest = this.renderRequest.bind( this )
    this.upsertSnippet = this.upsertSnippet.bind( this )
  }

  static cloneGenerator( generator ){
    const clone = {
      language: generator.language,
      library:  generator.library,
      name:     generator.name
    }

    if( generator.label )
      clone.label = generator.label

    return clone
  }

  static cloneSnippet( snippet ){
    const clone = {
      'snippet_id': snippet.snippet_id,
      'moment_id': snippet.moment_id,
      'generator': null,
      'config': {
        'method':   snippet.config.method,
        'decode':   snippet.config.decode,
        'body_params':   snippet.config.body_params.slice(),
        'header_params': snippet.config.header_params.slice(),
        'query_params':  snippet.config.query_params.slice()
      }
    }

    if( snippet.generator ){
      clone.generator = SnippetModal.cloneGenerator( snippet.generator )
    }

    return clone
  }

  componentDidMount(){
    if( !this.state.generators ){
      Scintillator.listGenerators()
        .then( async ( response ) => {
          if( response.ok ){
            const generators = await response.json()
            generators.sort(( left, right ) => {
              if( left.label < right.label )
                return -1
              else if( left.label > right.label )
                return 1
              else return 0
            })
            
            this.setState( state => {
              const clone = SnippetModal.cloneSnippet( state.snippet )
              clone.generator = SnippetModal.cloneGenerator( generators[0] )

              return {
                'generators': generators,
                'snippet': clone
              }
            })
          }
          else{
            const text = await response.text()

            try{
              const data = JSON.parse( text )
              alert( `Oops: ${data.code} - ${data.message}` )
            }
            catch(_){
              alert( `Oops: ${text}` )
            }
          }
        })
    }
  }

  handleArgsChange( e ){
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

  handleGeneratorChange( e ){
    const generator = this.state.generators.find( g => g.name === e.target.value )

    this.setState( state => {
      const snippet = SnippetModal.cloneSnippet( state.snippet )
      snippet.generator = SnippetModal.cloneGenerator( generator )
      return { snippet }
    })
  }

  handleThemeChange( e ){

  }

  render(){
    if( !this.props.moment || !this.state.generators ){
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

          <table width="100%">
          <tbody>
          <tr>
            <td>Format: <select onChange={this.handleGeneratorChange}>
              {this.state.generators.map( g => (
                <option key={g.name} value={g.name} data={g}>{g.label}</option>
              ))}
              </select>
            </td>

            <td>Theme: <select onChange={this.handleThemeChange}>
              {this.state.themes.map( theme => (
                <option key={theme.name} value={theme.name} data={theme}>{theme.label}</option>
              ))}
              </select>
            </td>

            <td><button style={{ float: 'right' }} onClick={this.upsertSnippet}>{operation}</button></td>
          </tr>
          </tbody>
          </table>

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
        <td>path</td>
        <td className="fixed-300" title={request.path}>{request.path}</td>
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
          <td className="tac"><input type="checkbox" name="body_params" value={key} onChange={this.handleArgsChange} /></td>
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
        <td className="tac"><input type="checkbox" name="header_params" value={h[k]} onChange={this.handleArgsChange} /></td>
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
        <td className="tac"><input type="checkbox" name="query_params" value={h[k]} onChange={this.handleArgsChange} /></td>
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

    /*
    const init = {
      mode:    'cors',
      method:  'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${Scintillator.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( this.state.snippet )
    }

    let url = `${config.baseURL}/api/1.0/snippet`
    if( this.state.snippet.snippet_id ){
      init.method = 'PUT'
      url = `${config.baseURL}/api/1.0/snippet/${this.state.snippet.snippet_id}`
    }
    */

    let response
    try{
      if( this.state.snippet.snippet_id )
        response = await Scintillator.updateSnippet( this.state.snippet )
      else
        response = await Scintillator.createSnippet( this.state.snippet )
    }
    catch( err ){
      alert( `Oops please try again soon` )
      return false
    }

    if( response.ok ){
      const data = await response.json()
      this.setState( state => {
        const snippet = SnippetModal.cloneSnippet( state.snippet )
        snippet.snippet_id = data.snippet_id
        return { snippet }
      })
    }
    else{
      const data = await response.json()
      alert( `Oops: ${data.code} - ${data.message}` )
      return false
    }
  }
}

export default SnippetModal
