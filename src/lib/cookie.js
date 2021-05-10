import StorageItem from "./storage/item"

//re: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
class CookieStorage{
  static clear(){
    debugger
  }

  static delete( name ){
    //The cookie name and value can use encodeURIComponent() to ensure that the string does not contain any commas, semicolons, or whitespace (which are disallowed in cookie values).
    const cookie = encodeURIComponent( name ) +'=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = cookie
  }

  static getItem( key ){
    const cacheStr = CookieStorage.getValue( key )
    if( cacheStr )
      return StorageItem.load( cacheStr )
    else
      return undefined
  }

  static getValue( name ){
    const find = `${name}=`
    for( let cookie of document.cookie.split( /; / )){
      //TODO:  get string before = and decodeURIComponent?
      if( cookie.startsWith( find ) )
        return decodeURIComponent( cookie.substring( find.length ) )
    }

    return undefined
  }

  static removeItem( key ){
    debugger
    return CookieStorage.delete( key )
  }

  static setItem( key, value, options ){
    const item = new StorageItem( value, options.expires )
    return CookieStorage.setValue( key, item.toString(), options )
  }

  static setValue( name, value, options ){
    options = options || {}

    //The cookie name and value can use encodeURIComponent() to ensure that the string does not contain any commas, semicolons, or whitespace (which are disallowed in cookie values).
    let cookie = encodeURIComponent( name ) +'='+ encodeURIComponent( value )

    //If not specified, this defaults to the host portion of the current document location.
    if( options.domain && options.domain.length ){
      cookie += `;domain=${options.domain}`
    }

    //If not specified, defaults to the current path of the current document location.
    const path = options.path || '/'
    cookie += `;path=${path}`

    
    if( options.maxAge ){
      if( typeof options.maxAge === 'number' ){
        //;max-age=max-age-in-seconds
        cookie += `;max-age=${options.maxAge}` //7 days = 7*24*60*60
      }
      else{
        //If neither expires nor max-age specified it will expire at the end of session.
        console.warn( 'Cookie might expire when browser or tab closes' )
      }
    }

    
    if( options.expires ){
      if( options.expires instanceof Date ){
        //;expires=date-in-GMTString-format
        cookie += ';expires='+ options.expires.toUTCString()
      }
      else if( typeof options.expires === 'string' ){
        //;expires=date-in-GMTString-format
        console.warn( `Setting cookie expires to ${options.expires}` )
        cookie += ';expires='+ options.expires
      }
      else{
        //If neither expires nor max-age specified it will expire at the end of session.
        console.warn( 'Cookie might expire when browser or tab closes' )
      }
    }
    else if( options.maxAge ){
      const expires = new Date(Date.now() + ( options.maxAge * 1000 ))
      cookie += ';expires='+ expires.toUTCString()
    }

    //cannot be set by browser, invalidates the whole cookie
    if( options.HttpOnly ){
      cookie += `;HttpOnly`
    }

    if( options.sameSite && options.sameSite.length ){
      cookie += `;samesite=${options.sameSite}`
    }

    if( options.secure ){
      cookie += `;secure`
    }

    document.cookie = cookie
    return cookie
  }
}

export default CookieStorage
