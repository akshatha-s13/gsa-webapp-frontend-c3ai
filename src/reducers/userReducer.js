export const userDefaultState = {
  signedIn: false,
  email: null,
  userId: null,
  authorId: null,
  isAdmin: false,
  isModerator: false
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN': {
      //console.log(action.type)
      return {
        ...state,
        signedIn: true,
        userId: action.payload.userId,
        authorId: action.payload.authorId,
        isAdmin: action.payload.isAdmin,
        isModerator: action.payload.isModerator
      }
    }
    case 'SIGN_OUT': {
      return {
        ...state,
        signedIn: false,
        userId: null,
        authorId: null,
        isAdmin: false,
        isModerator: false
      }
    }
    default: {
      throw new Error('No matching type.')
    }
  }
}
export default userReducer