
import React from 'react'
import { Redirect } from "react-router-dom"

import {ClockIcon, EllipsisIcon, LockIcon, UnlockIcon} from '@primer/octicons-react'

import CookieStorage from '../../lib/cookie'
import Scintillator from '../../lib/api'

import './history.css';

class History extends React.PureComponent{
  constructor( props ){
    super( props )

    this.hasMore = true
    this.page = 0
    this.pageSize = 25
    this.state = {
      'history': null,
      'page': -1
    }

    this.loadMore = this.loadMore.bind( this )
  }

  componentDidMount(){
    this.loadMore( true )
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if( prevProps.match.params.project !== this.props.match.params.project ){
      this.loadMore( true )
    }
  }

  async fetchMoments( filters ){
    if( !this.hasMore )
      return


    const query = new URLSearchParams( '' )

    /*
    if( this.momentDefaults && Object.keys( this.momentDefaults ).length ){
      for( let [ key, value ] of Object.entries( this.momentDefaults ) ){
        query.append( key, value )
      }
    }
    */

    if( filters && Object.keys( filters ).length ){
      for( let [ key, value ] of Object.entries( filters ) ){
        query.append( key, value )
      }
    }

    let response
    try{
      response = await Scintillator.listMoments( query )
    }
    catch( err ){
      alert( `Oops please try again soon` )
      return false
    }

    if( response.ok ){
    //if( response.status === 200 ){
      const moments = await response.json() || []
      if( moments && moments.length ){
        moments.forEach( moment => {
          moment.request.created = new Date( moment.request.created )
          if( moment.response?.created ){
            moment.response.created = new Date( moment.response.created )
          }
        })

        this.hasMore = moments.length === filters.pageSize
        if( this.state.history ){
          this.setState({
            'history': [ ...this.state.history, ...moments ],
            'page':    filters.page
          })
        }
        else{
          this.setState({
            'history': moments,
            'page':    filters.page
          })
        }
      }
      else{
        this.hasMore = false
      }
    }
    else{
      const data = await response.json()
      alert( `Oops: ${data.code} - ${data.message}` )

      this.hasMore = false
      this.setState({
        'history': [],
        'page':    filters.page
      })
    }
  }

  async fetchJournal( page, filters ){
    if( !page )
      page = 1
  
    const query = new URLSearchParams( `page=${page}&pageSize=25` )
    if( filters && Object.keys( filters ).length ){
      for( let [ key, value ] of Object.entries( filters ) ){
        query.append( key, value )
      }
    }

    let response
    try{
      response = await Scintillator.listJournals( query )
    }
    catch( err ){
      alert( `Oops please try again soon` )
      return false
    }

    if( response.ok ){
      const data = await response.json()
      data.forEach( moment => {
        moment.request.created = new Date( moment.request.created )
        if( moment.response?.created ){
          moment.response.created = new Date( moment.response.created )
        }
      })
      this.setState({ 'journal': data })
    }
    else{
      const data = await response.json()
      alert( `Oops: ${data.code} - ${data.message}` )
    }
  }

  getHost(){
    return this.props.match.params.project
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

  loadMore( reset ){
    if( reset ){
      this.hasMore = true
      this.page = 1
    }
    else{
      ++this.page;
    }

    this.fetchMoments({
      'host': this.getHost(),
      'page': this.page,
      'pageSize': this.pageSize
    })
  }

  static pad( num ){
    if( String( num ).length === 2 )
      return `${num}`
    else
      return `0${num}`
  }

  render(){
    if( !Scintillator.isLoggedIn() )
      return <Redirect to="/" />


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
    let moreButton = null
    if( this.hasMore ){
      moreButton = [
        <br key="br" />,
        <button key="more-button" onClick={this.loadMore}>More...</button>
      ]
    }

    return (
      <div>
        <div className="list-group">
          <div className="list-group-item list-group-item-action disabled list-header">            
            <i class="fa fa-folder-open-o" aria-hidden="true"></i>
            <div>[</div>
            <div className="tac" style={{ color: '#222', marginLeft: 5  }}>{this.getHost()}</div>
          </div>
          {sections}
        </div>
        {moreButton}
      </div>
    )
  }

  static renderHistory( label, history ){
    if( history.length ){
      return (
        <div key={label}>
          {history.map( History.renderRow )}
        </div>
      )
    }
    else{
      return null
    }
  }

  static renderRow( moment ){
    let response = null
    if( moment.response ){
      let label = ''
      let square = ''

      //ref: https://github.com/collections/programming-languages
      switch( moment.response.content_type ){
        case 'application/json':
          label  = <span itemProp="programmingLanguage">JSON</span>
          square = <div className="repo-language-color" style={{ backgroundColor: '#f1e05a' }}></div>
          break

        default:
          label  = <span itemProp="programmingLanguage">{moment.response.content_type}</span>
          square = <div className="repo-language-color" style={{ backgroundColor: 'gray' }}></div>
          break
      }

      response = (
        <>
          <div className={`code text-center status-${moment.response.status_code}`}>{moment.response.status_code}</div>
          <div className="miss text-center d-flex align-items-center px-0">
            <div className={`flag ${moment.response.status_code}`} title={moment.response.status_code}>{square}</div>
            <div className="content-type ms-1" title={moment.response.content_type}>{label}</div>  
          </div>
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

    let scheme = (
      <span title={moment.request.scheme}>{
        moment.request.scheme === 'https' ?
          <LockIcon size="small" /> :
          <UnlockIcon size="small" />
      }</span>
    )

    const dt = History.iso8601( moment.request.created )
    return (
      <div key={moment.moment_id} className="list-group-item list-group-item-action method-wrapper py-0">
        <div className="row">
          <div className="col-1 p-1 d-flex align-items-center method px-1 border-dark border-end justify-content-center">
          <i class="fa fa-lock" aria-hidden="true"></i>
            <div className="name red">{moment.request.method}</div>
          </div>
          <div className="col p-1 d-flex align-items-center path px-1 border-dark border-end">
            <div>{moment.request.path}</div>
          </div>
          <div className="col-1 align-items-center status justify-content-center d-flex flex-column">
            {response}
          </div>
        </div>
      </div>
    )
  }
}

export default History
