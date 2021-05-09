
import StorageItem from './storageItem'

export class LocalStorage{
    clear(){
        return localStorage.clear()
    }

    getItem( key ){
        var cacheStr = localStorage.getItem( key )
        if( cacheStr )
            return StorageItem.load( cacheStr )
        else{
            return null
        }
    }

    removeItem( key ){
        return localStorage.removeItem( key )
    }

    setItem( key, value ){
        if( value.constructor != StorageItem )
            console.warn( "Value must be a StorageItem" )

        localStorage.setItem( key, value );
    }
}
