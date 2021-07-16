
class StorageItem{
  constructor( data, expires, created ){
	if( !expires )
		throw new Error( "StorageItem must have an expiration" )

	this.created = created ? new Date( created ) : new Date()
	this.data    = data
	this.expires = expires
  }

    isExpired(){
        const age = (new Date()) - this.created;
        return ( age > this.expires )
    }

    isValid(){
        const age = (new Date()) - this.created;
        return ( age < this.expires )
    }

    static load( cacheStr ){
        const cacheVal = JSON.parse( cacheStr )
        return new StorageItem( cacheVal.data, cacheVal.expires, cacheVal.created )
    }

    toString(){
        return JSON.stringify({
            'created': this.created,
            'data':    this.data,
            'expires': this.expires
        })
    }
}

export default StorageItem
