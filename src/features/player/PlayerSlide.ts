import { StoreSlice } from '../../app/store';

interface IPlayer {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

interface IPlayerSlice {
  playerSlice: IPlayer;
}

const playerSlice: StoreSlice<IPlayerSlice> = (set /*, get*/) => ({
  playerSlice: {
    visible: false,
    show: () => {
      set((state): any => ({
        playerSlice: { ...state.playerSlice, visible: true },
      }));
    },
    hide: () => {
      set((state): any => ({
        playerSlice: { ...state.playerSlice, visible: false },
      }));
    },
  },
});

export default playerSlice;
