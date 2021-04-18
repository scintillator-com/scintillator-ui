
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

function _404(){
  //TODO: smart-lookup for related content
  const loc = useLocation()
  console.log( loc )

  return (
    <div>
      <h1>Oops!</h1>
      <p>Not found...</p>
      <div>{JSON.stringify( loc )}</div>
    </div>
  )
}

export default _404
