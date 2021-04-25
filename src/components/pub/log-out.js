
import { Redirect } from 'react-router'
import CookieStorage from '../../lib/cookie'

function LogOut(){
  CookieStorage.delete( 'authorization' )

  return (
    <Redirect to="/" />
  )
}

export default LogOut
