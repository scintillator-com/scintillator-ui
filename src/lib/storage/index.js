
import CookieStorage from '../cookie'
import LocalStorage from './local'
import SessionStorage from './session'

class Storage{
  static cookie(){
    return CookieStorage
  }

  static local(){
    return LocalStorage
  }

  static session(){
    return SessionStorage
  }
}

export default Storage
