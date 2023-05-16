const initialState = ""

export default function reducerEmail (state = initialState, action) {
  switch (action.type) {
    case "modifyEmail":
        return action.payload;
    default:
      return state;
  }
}
