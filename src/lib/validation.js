
import { ConfigurationError, ValidationError } from './errors'

//ref: https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/


const validateEmail = ( message ) => {
  return ( input, allData ) => {
    if( !emailRegex.test( input.value.trim() ) )
      throw new ValidationError( FormValidator.getMessage( message, input, allData ), null, null, input )
  }
}

const validateRegex = ( message, regex ) => {
  return ( input, allData ) => {
    if( input.dataset.regex ){
      regex = new RegExp( input.dataset.regex )
    }
    else if( regex ){
      //no-op
    }
    else{
      const configError = 'Configuration Error: the input "{field}" must provide the "data-regex" attribute'
      throw new ConfigurationError( FormValidator.getMessage( configError, input, allData ), null, null, input )
    }

    //RegExp?
    throw new Error( 'Not implemented: validateRegex()' )
  }
}

const validateRequired = ( message ) => {
  return ( input, allData ) => {
    if( !input.value )
      throw new ValidationError( FormValidator.getMessage( message, input, allData ), null, null, input )
  }
}

class FormValidator{
  validators = {}

  constructor( validators ){
    this.validators = validators
  }

  static asArray( form ){
    const data = []
    for( let input of form ){
      const { id, name, value } = input
      data.push({ id, name, value })
    }
    return data
  }

  static asDict( form ){
    const data = {}
    for( let input of form ){
      if( input.name ){
      data[ input.name ] = input.value
      }
    }
    return data
  }

  static getFieldName( input ){
    if( input.name || input.id ){
      return input.name || input.id
    }
    else{
      debugger
      throw new ConfigurationError( `Configuration Error: the input "${FormValidator.getLabel( input, true )}" must provide the "name" or "id" attributes` )
    }
  }

  static getLabel( input, noWarning ){
    if( input.dataset.label ){
      return input.dataset.label
    }
    else if( noWarning ){
      return '(unknown)'
    }
    else{
      const field = FormValidator.getFieldName( input )
      console.warn( `Configuration Warning: the input "${field}" does not provide the "data-label" attribute` )
      return field
    }
  }

  static getMessage( message, input, allData ){
    const data = {
      field: FormValidator.getFieldName( input ),
      label: FormValidator.getLabel( input ),
      value: input.value
    }

    let key, value
    for( [ key, value ] of Object.entries( data ) ){
      message = message.replace( `{${key}}`, value )
    }

    return message
  }

  validate( form ){
    const errors = []
    const formData = FormValidator.asDict( form )
    let callback, fieldName, input
    for( input of form ){
      if( input.name || input.id ){
        fieldName = FormValidator.getFieldName( input )
        if( fieldName in this.validators ){
          for( callback of this.validators[ fieldName ] ){
            try{
              callback( input, formData )
            }
            catch( err ){
              if( err instanceof ValidationError ){
                errors.push( err )
                break
              }
              else
                throw err
            }
          }
        }
      }
    }

    return errors
  }
}

export default class Validate{
  static email = validateEmail
  static Form  = FormValidator
  static required = validateRequired
}
