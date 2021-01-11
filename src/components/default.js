
import React from 'react'
import { Link, Redirect } from "react-router-dom";

import LogIn from './pub/log-in'

import CookieStorage from '../lib/cookie'

function Default( props ){
  const isLoggedIn = () => {
    const auth = CookieStorage.get( 'authorization' )
    return auth && auth.length ? true : false
  }

  if( isLoggedIn() ){
    return <Redirect to="/dashboard" />
  }
  else{
    return (
      <div className="row">
        <div className="col-md-8 col-lg-9 col-xl-10 ml-sm-auto pt-3 px-4">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis felis dolor, ut tempus ligula ornare consectetur. Donec ac dignissim purus. Donec id tortor lacus. Integer faucibus euismod lectus id eleifend. Aenean vestibulum nibh a felis fringilla, bibendum viverra metus cursus. Fusce metus ipsum, malesuada non porta ut, tristique vitae nisl. Mauris ac nisl quis magna placerat tempor non sed nisi. In hac habitasse platea dictumst. Cras lectus ex, efficitur id mauris vitae, rutrum molestie ipsum. Etiam hendrerit lacus sit amet ullamcorper fermentum. Donec pellentesque nisl diam, quis pellentesque orci pulvinar volutpat. Integer vulputate sed purus eu feugiat. Maecenas mauris nulla, sagittis sed pellentesque non, consequat nec sem. Aenean a libero non sem molestie congue quis vel tortor.</p>
          <p>Nam in condimentum purus. Proin molestie ex sit amet nisi pulvinar rutrum. Praesent porta nisl a justo volutpat suscipit. Fusce eu libero facilisis, commodo turpis ut, mattis dolor. Donec turpis felis, auctor ut nisl vel, porttitor fringilla mauris. Nam eget rhoncus orci. Vestibulum ullamcorper semper ligula, vel cursus quam dignissim at. Ut eget tellus orci. In ut cursus lorem. Cras a feugiat mi. Etiam quis quam vitae augue auctor lobortis.</p>
          <Link to="/href"><button className="btn btn-primary">Sign Up</button></Link>
        </div>

        <LogIn onLogin={props.onLogin} />
      </div>
    )
  }
}

export default Default
