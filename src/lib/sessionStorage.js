
import StorageItem from './storageItem'

export class SessionStorage{
    clear(){
        return sessionStorage.clear()
    }

    getItem( key ){
        var cacheStr = sessionStorage.getItem( key )
        if( cacheStr )
            return StorageItem.load( cacheStr )
        else{
            return null
        }
    }

    removeItem( key ){
        return sessionStorage.removeItem( key )
    }

    setItem( key, value ){
        if( value.constructor != StorageItem )
            console.warn( "Value must be a StorageItem" )

        sessionStorage.setItem( key, value );
    }
}
