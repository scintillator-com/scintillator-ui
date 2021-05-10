
import config        from './config'
import CookieStorage from './cookie'
import LocalStorage  from './storage/local'
import StorageItem   from './storage/item'

class Scintillator{
  static getAuthToken(){
    const authItem = CookieStorage.getItem( 'authorization' ) || {}
    return authItem.data
  }

  static isLoggedIn(){
    const authItem = CookieStorage.getItem( 'authorization' )
    return !!authItem
  }



  static async createOrg( args ){
    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( args )
    }

    try{
      const response = await fetch( `${config.baseURL}/api/1.0/org`, init )
      return response
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async createSnippet( snippet ){
    const init = {
      mode:    'cors',
      method:  'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( this.state.snippet )
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/snippet`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async createUser( args ){
    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( args )
    }

    if( Scintillator.isLoggedIn() ){
      //this is optional:  are we adding a user to the org or creating a new user for a new org?
      init.headers.Authorization = `Bearer ${Scintillator.getAuthToken()}`
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/user`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async doLogIn( username, password ){
    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/login`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async getMoment( id ){
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`
      }
    }

    try{
      const response = await fetch( `${config.baseURL}/api/1.0/moment/${id}`, init )
      Scintillator.setCache( `/api/1.0/moment/${id}`, init, response )
      return response
    }
    catch( err ){
      if( this.isOffline( err ) ){
        const response = Scintillator.getCache( `/api/1.0/moment/${id}`, init )
        if( response )
          return response
      }

      console.error( `${err}` )
      throw err
    }
  }

  static async listGenerators(){
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`
      }
    }

    try{
      const response = await fetch( `${config.baseURL}/api/1.0/generators`, init )
      Scintillator.setCache( `/api/1.0/generators`, init, response )
      return response
    }
    catch( err ){
      if( this.isOffline( err ) ){
        const response = Scintillator.getCache( `/api/1.0/generators`, init )
        if( response )
          return response
      }

      console.error( `${err}` )
      throw err
    }
  }

  static async listJournals( query ){
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`
      }
    }

    try{
      const response = await fetch( `${config.baseURL}/api/1.0/journal?${query}`, init )
      Scintillator.setCache( `/api/1.0/journal?${query}`, init, response )
      return response
    }
    catch( err ){
      if( this.isOffline( err ) ){
        const response = Scintillator.getCache( `/api/1.0/journal?${query}`, init )
        if( response )
          return response
      }

      console.error( `${err}` )
      throw err
    }
  }

  static async listMoments( query ){
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`
      }
    }

    try{
      const response = await fetch( `${config.baseURL}/api/1.0/history?${query}`, init )
      Scintillator.setCache( `/api/1.0/history?${query}`, init, response )
      return response
    }
    catch( err ){
      if( this.isOffline( err ) ){
        const response = Scintillator.getCache( `/api/1.0/history?${query}`, init )
        if( response )
          return response
      }

      console.error( `${err}` )
      throw err
    }
  }

  static async listProjects( page, filters ){
    if( !page )
      page = 1

    const query = new URLSearchParams( `page=1&pageSize=10` )
    if( filters && Object.keys( filters ).length ){
      for( let [ key, value ] of Object.entries( filters ) ){
        query.append( key, value )
      }
    }

    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`
      }
    }

    try{
      const response = await fetch( `${config.baseURL}/api/1.0/project?${query}`, init )
      Scintillator.setCache( `/api/1.0/project?${query}`, init, response )
      return response
    }
    catch( err ){
      if( this.isOffline( err ) ){
        const response = Scintillator.getCache( `/api/1.0/project?${query}`, init )
        if( response )
          return response
      }

      console.error( `${err}` )
      throw err
    }
  }

  static async updateSnippet( snippet ){
    const init = {
      mode:    'cors',
      method:  'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( snippet )
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/snippet/${snippet.snippet_id}`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async unlockProject( project ){
    const init = {
      mode:    'cors',
      method:  'PATCH',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Scintillator.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'host': project.host
      })
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/project`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static getCache( url, init ){
    const key = Scintillator.getCacheKey( url, init )
    const item = LocalStorage.getItem( key )
    if( item ){
      return new Response( item.data.body, item.data.init )
    }
    else
      return undefined
  }

  static getCacheKey( url, init ){
    return `${init.method || 'GET'} ${url}`
  }

  static isOffline( err ){
    return `${err}` === 'TypeError: Failed to fetch'
  }

  static async setCache( url, init, response ){
    if( response.ok ){
      //1 week
      const expiration = new Date(Date.now() + ( 7 * 24 * 60 * 60 * 1000 ))

      const value = {
        body: await response.clone().text(),
        init: {
          status: response.status,
          statusText: response.statusText,
          headers: []
        }
      }

      for( const header of response.headers.entries() ){
        value.init.headers.push( header )
      }

      const item = new StorageItem( value, expiration )
      const key = Scintillator.getCacheKey( url, init )

      try{
        LocalStorage.setItem( key, item )
      }
      catch( err ){
        console.info( `${err}` )
      }
    }
  }
}

export default Scintillator
