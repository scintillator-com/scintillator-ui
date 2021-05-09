
export class StorageItem{
  constructor( data, expires, created ){
	if( !expires )
		throw { "message": "StorageItem must have an expires age" }

	this.created = created ? new Date( created ) : new Date()
	this.data = data
	this.expires = expires
  }

    isExpired(){
        var age = (new Date()) - this.created;
        return ( age > this.expires )
    }

    isValid(){
        var age = (new Date()) - this.created;
        return ( age < this.expires )
    }

    static load( cacheStr ){
        var cacheVal = JSON.parse( cacheStr )
        var item = new StorageItem( cacheVal.data, cacheVal.expires, cacheVal.created );
        return item;
    }

    toString(){
        var tmp = {
            'created': this.created,
            'data': this.data,
            'expires': this.expires
        };
        
        return JSON.stringify( tmp )
    }
}
