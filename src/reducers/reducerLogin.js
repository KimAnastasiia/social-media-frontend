const initialState = false

export default function reducerLogin (state = initialState, action) {
  switch (action.type) {
    case "loginTrue":
      return true;
    case "loginFalse":
        return false;
    default:
      return state;
  }
}
