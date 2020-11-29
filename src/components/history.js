
import React from 'react'

import '../css/history.css'

const ellipsis_200 = {
  display: 'inline-block',
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'text-bottom'
}

class History extends React.PureComponent{
  constructor( props ){
    super( props )

    this.state = {
      history: null
    }
  }

  componentDidMount(){
    this.fetchHistory() 
  }

  async fetchHistory( page, filters ){
    if( !page )
      page = 1
  
    let query = `?page=${page}&pageSize=25`
    if( filters && Object.keys( filters ).length ){
      for( let [ key, value ] of Object.entries( filters ) ){
        query += '&'+ encodeURIComponent( key ) +'='+ encodeURIComponent( value )
      }
    }
    
    const config = {
      'method': 'GET',
      'headers': {
        'Accept': 'application/json'
      }
    }

    try{
      const res = await fetch( `http://192.168.1.31/api/1.0/history${query}`, config )
      const data = await res.json()
      data.forEach( moment => {
        moment.request.created = new Date( moment.request.created )
        if( moment.response?.created ){
          moment.response.created = new Date( moment.response.created )
        }
      })
      this.setState({ 'history': data })
    }
    catch( err ){
      console.warn( String(err) )
    }
  }

  async fetchJournal( page, filters ){
    if( !page )
      page = 1
  
    let query = `?page=${page}&pageSize=25`
    if( filters && Object.keys( filters ).length ){
      for( let [ key, value ] of Object.entries( filters ) ){
        query += '&'+ encodeURIComponent( key ) +'='+ encodeURIComponent( value )
      }
    }
    
    const config = {
      'method': 'GET',
      'headers': {
        'Accept': 'application/json'
      }
    }

    try{
      const res = await fetch( `http://192.168.1.31/api/1.0/journal${query}`, config )
      const data = await res.json()
      data.forEach( moment => {
        moment.request.created = new Date( moment.request.created )
        if( moment.response?.created ){
          moment.response.created = new Date( moment.response.created )
        }
      })
      this.setState({ 'journal': data })
    }
    catch( err ){
      console.warn( String(err) )
    }
  }

  getOlder(){
    const now = new Date()
    const end = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 6 )
    const older = this.state.history.filter( moment => {
      if( moment.request.created <= end )
        return true
      else
        return false
    })
    return older
  }

  getToday(){
    const now = new Date()
    const start = new Date( now.getFullYear(), now.getMonth(), now.getDate() )
    const end = new Date( now.getFullYear(), now.getMonth(), now.getDate() + 1 )
    const todays = this.state.history.filter( moment => {
      if( start <= moment.request.created && moment.request.created <= end )
        return true
      else
        return false
    })
    return todays
  }

  getYesterday(){
    const now = new Date()
    const start = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 1 )
    const end = new Date( now.getFullYear(), now.getMonth(), now.getDate() )
    const yesterdays = this.state.history.filter( moment => {
      if( start <= moment.request.created && moment.request.created <= end )
        return true
      else
        return false
    })
    return yesterdays
  }

  getWeek(){
    const now = new Date()
    const start = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 6 )
    const end = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 1 )
    const weeks = this.state.history.filter( moment => {
      if( start <= moment.request.created && moment.request.created <= end )
        return true
      else
        return false
    })
    return weeks
  }

  static iso8601( date ){
    if( !date )
      date = new Date()

    const year = date.getFullYear()
    const month = History.pad( date.getMonth() + 1 )
    const day = History.pad( date.getDate() )
    const hour = History.pad( date.getHours() )
    const min = History.pad( date.getMinutes() )
    const sec = History.pad( date.getSeconds() )

    return `${year}-${month}-${day} ${hour}-${min}-${sec}`
  }

  static pad( num ){
    if( String( num ).length === 2 )
      return `${num}`
    else
      return `0${num}`
  }

  render(){
    if( !this.state.history ){
      return (
        <span>Loading...</span>
      )
    }

    if( !this.state.history.length ){
      return (
        <span>No data, start coding</span>
      )
    }


    const sections = []
    const todays = this.getToday()
    if( todays && todays.length ){
      sections.push( History.renderHistory( 'Today', todays ) )
    }

    const yesterdays = this.getYesterday()
    if( yesterdays && yesterdays.length ){
      sections.push( History.renderHistory( 'Yesterday', yesterdays ) )
    }

    const week = this.getWeek()
    if( week && week.length ){

      sections.push( History.renderHistory( 'This Week', week ) )
    }

    const older = this.getOlder()
    if( older && older.length ){
      sections.push( History.renderHistory( 'Older', older ) )
    }

    return (
      <table>
      <thead>
      <tr>
        <th></th>
        <th>Date</th>
        <th>Method</th>
        <th>URL</th>
        <th>Status</th>
        <th>Type</th>
        <th></th>
      </tr>
      </thead>
      {sections}
      </table>
    )
  }

  static renderHistory( label, history ){
    if( history.length ){
      return (
        <tbody key={label}>
          <tr><td align="center" colSpan="7"><h3>{label}</h3></td></tr>
          {history.map( History.renderRow )}
        </tbody>
      )
    }
    else{
      return null
    }
  }

  static renderRow( moment ){
    let response = null
    if( moment.response ){
      response = (
        <>
          <td><span className={`status-${moment.response.status_code}`}>{moment.response.status_code}</span></td>
          <td><span className="response-type">{moment.response.content_type}</span></td>
        </>
      )
    }
    else{
      response = (
        <>
          <td></td>
          <td></td>
        </>
      )
    }

    const dt = History.iso8601( moment.request.created )
    return (
      <tr key={moment._id}>
        <td><input type="checkbox" name="moment" value={moment._id} /></td>
        <td><span alt={dt} title={dt}>clock</span></td>
        <td><span className={`method-${moment.request.method}`}>{moment.request.method}</span></td>
        <td style={{ whiteSpace: 'nowrap' }}>
          <span className="scheme">{moment.request.scheme}</span>://
          <span className="host">{moment.request.host}</span>
          <span className="path"  style={ellipsis_200} title={moment.request.path}>{moment.request.path}</span>
          <span className="query" style={ellipsis_200} title={moment.request.query_string}>{moment.request.query_string ? `?${moment.request.query_string}` : ''}</span>
        </td>
        {response}
        <td>
          <a href={`/moment/${moment._id}`}>detail icon</a>
        </td>
      </tr>
    )
  }
}

export default History
