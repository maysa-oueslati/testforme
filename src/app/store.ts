import create, { GetState, SetState } from 'zustand';
import { devtools } from 'zustand/middleware';

import auth from '../features/login/AuthSlice';
import activity from '../features/activity/ActivitySlide';
import editor from '../features/editor/EditorSlide';
import player from '../features/player/PlayerSlide';
import mkUpload from '../features/markerUpload/mkUploadSlice';

export type StoreSlice<T extends object, E extends object = T> = (
  set: SetState<E extends T ? E : E & T>,
  get: GetState<E extends T ? E : E & T>,
) => T;

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
  ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
  : unknown;

type State = StateFromFunctions<
  [typeof auth, typeof activity, typeof editor, typeof player, typeof mkUpload]
>;

const useStore = create<State>(
  devtools((set: SetState<any>, get: GetState<any>) => ({
    ...auth(set, get),
    ...activity(set, get),
    ...editor(set, get),
    ...player(set, get),
    ...mkUpload(set, get),
  })) as any,
);

export default useStore;
