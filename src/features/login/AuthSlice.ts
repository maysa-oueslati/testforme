import { StoreSlice } from '../../app/store';

interface IAuth {
  userEmail: string | null,
  setAuth: (id: string | null) => void,
}

interface IActivitySlice {
  authSlice: IAuth;
}

const authSlice: StoreSlice<IActivitySlice> = (set /* , get*/) => ({
  authSlice: {
    userEmail: null,
    setAuth: (email: string | null) => {
      set((state): any => ({
        authSlice: {
          ...state.authSlice,
          userEmail: email,
        }
      }))
    }
  },
});

export default authSlice;
