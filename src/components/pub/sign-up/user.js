

function UserSignUp(){
  return (
    <form id="user-sign-up" className="form-group">
      <fieldset form="user-sign-up">
        <fieldset><h3>Create User</h3></fieldset>
        
        <label className="mt-1" for="first-name">First Name:</label>
        <input id="first-name" className="mt-0" type="text" name="first-name" />

        <label className="mt-1" for="last-name">Last Name:</label>
        <input id="last-name" className="mt-0" type="text" name="last-name" />

        <label className="mt-1" for="email">E-mail:</label>
        <input id="email" className="mt-0" type="text"  name="email" />
      </fieldset>
    </form>
  )
}

export default UserSignUp
