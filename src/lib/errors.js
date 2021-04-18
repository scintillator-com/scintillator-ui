
export class ConfigurationError extends Error{}

export class ValidationError extends Error{
    input = null

  constructor( msg, code, prev, input ){
    super( msg, code, prev )
    this.input = input
  }
}
