
import CookieStorage from './cookie'
import config from './config'

class Scintillator{
  static async fetchCreateOrg( args ){
    const auth = CookieStorage.get( 'authorization' )

    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( args )
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/org`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async fetchCreateSnippet( snippet ){
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

    try{
      return await fetch( `${config.baseURL}/api/1.0/snippet`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async fetchCreateUser( args ){
    const init = {
      mode:   'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( args )
    }

    const auth = CookieStorage.get( 'authorization' )
    if( auth ){
      init.headers.Authorization = `Bearer ${auth}`
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/user`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async fetchJournal( query ){
    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`
      }
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/journal?${query}`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async fetchLogIn( username, password ){
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

  static async fetchMoment( id ){
    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`
      }
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/moment/${id}`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async fetchMoments( query ){
    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`
      }
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/history?${query}`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async fetchProjects( page, filters ){
    if( !page )
      page = 1

    const query = new URLSearchParams( `page=1&pageSize=10` )
    if( filters && Object.keys( filters ).length ){
      for( let [ key, value ] of Object.entries( filters ) ){
        query.append( key, value )
      }
    }

    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`
      }
    }

    try{
      return await fetch( `${config.baseURL}/api/1.0/project?${query}`, init )
    }
    catch( err ){
      console.error( `${err}` )
      throw err
    }
  }

  static async fetchUpdateSnippet( snippet ){
    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`,
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

  static async fetchUnlockProject( project ){
    const authorization = CookieStorage.get( 'authorization' )
    const init = {
      mode:    'cors',
      method:  'PATCH',
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${authorization}`,
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
}

export default Scintillator
