
import StorageItem from './item'

class SessionStorage{
  static clear(){
    return sessionStorage.clear()
  }

  static getItem( key ){
    var cacheStr = sessionStorage.getItem( key )
    if( cacheStr )
      return StorageItem.load( cacheStr )
    else
      return undefined
  }

  static removeItem( key ){
    return sessionStorage.removeItem( key )
  }

  static setItem( key, value ){
    if( value instanceof StorageItem )
      sessionStorage.setItem( key, value )
    else
      throw new Error( "Value must be a StorageItem" )
  }
}

export default SessionStorage
