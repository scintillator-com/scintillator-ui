
import StorageItem from './item'

class LocalStorage{
  static clear(){
    return localStorage.clear()
  }

  static getItem( key ){
    const cacheStr = localStorage.getItem( key )
    if( cacheStr )
      return StorageItem.load( cacheStr )
    else
      return undefined
  }

  static removeItem( key ){
    return localStorage.removeItem( key )
  }

  static setItem( key, value ){
    if( value instanceof StorageItem )
      localStorage.setItem( key, value )
    else
      throw new Error( "Value must be a StorageItem" )
  }
}

export default LocalStorage
