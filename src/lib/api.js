
import CookieStorage from './cookie'
import config from './config'

class Scintillator{
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

    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/login`, init )
    }
    catch( err ){
      debugger
    }

    const data = await response.json()
    if( response.status === 200 ){
      return data
    }
    //else if( response.status === 401 ){
    //  data = await response.json()
    //}
    else{
      throw new Error( `Oops: ${data.code} - ${data.message}` )
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

    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/project?${query}`, init )
    }
    catch( err ){
      console.warn( String(err) )
      //no response...
      return []
    }

    let data = {}
    try{
      data = await response.json()
    }
    catch( err ){
      console.warn( String(err) )
    }

    if( response.status === 200 ){
      data.forEach( project => {
        project.created = new Date( project.created )
      })
      return data
    }
    else{
      console.warn( data )
      return []
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

    let response = null
    try{
      response = await fetch( `${config.baseURL}/api/1.0/project`, init )
    }
    catch( err ){
      console.warn( String(err) )
      //no response...
      return
    }

    let data = {}
    try{
      data = await response.json()
    }
    catch( err ){
      console.warn( String(err) )
    }

    if( response.status === 201 ){
      return data
    }
    //401 Unauthorized: please login
    //402 Payment Required: please upgrade or prompt for purchase 
    //409 Conflict: please contact support
    else{
      //oops
      console.warn( data )
      throw new Error()
    }
  }
}

export default Scintillator
