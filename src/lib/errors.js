
export class ConfigurationError extends Error{}

export class ValidationError extends Error{
    input = null

  constructor( msg, code, prev, input ){
    super( msg, code, prev )

    if( input ){
      this.input = input
    }
    else{
      console.error( 'ValidationError requires the invalid input' )
    }
  }
}
