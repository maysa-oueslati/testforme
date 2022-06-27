import { StoreSlice } from '../../app/store';
import { ActivityDocType, AuraDocType } from '../../app/db/types';
import { nanoid } from 'nanoid';

interface IActivity {
  visible: boolean;
  activities: ActivityDocType[];
  showMenu: () => void;
  hideMenu: () => void;
  addActivity: (activity: Partial<ActivityDocType>) => void;
  removeActivity: (id: string | number) => void;
  updateActivity: (
    activity: Pick<ActivityDocType, 'id' | 'title' | 'description'>,
  ) => void;
  getActivity: (id: string | number) => void;

  //
  // Auras
  //
  auras: AuraDocType[];
  addAura: (aura: Partial<AuraDocType>) => void;
  removeAura: (id: string | number) => void;
  updateAura: (aura: Pick<AuraDocType, 'id' | 'cfg' | 'content'>) => void;
  retriveAuras: (id: string | number) => void;
}

interface IActivitySlice {
  activitySlice: IActivity;
}

const activitySlice: StoreSlice<IActivitySlice> = (set /* , get*/) => ({
  activitySlice: {
    activities: [
      // {
      //   id: nanoid(),
      //   title: 'Augmenter la carte',
      //   type: 'type',
      //   description: 'Donner vie à la carte...',
      //   cover:
      //     'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      // },
      // {
      //   id: nanoid(),
      //   title: 'Activité à la cool',
      //   type: 'type',
      //   description: 'Donner vie .....',
      //   cover:
      //     'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      // },
    ],
    visible: false,
    showMenu: () => {
      set((state): any => ({
        activitySlice: { ...state.activitySlice, visible: true },
      }));
    },
    hideMenu: () => {
      set((state): any => ({
        activitySlice: { ...state.activitySlice, visible: false },
      }));
    },
    addActivity: async (doc: Partial<ActivityDocType>) => {
      console.log('activity before', doc);

      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          activities: [
            {
              id: nanoid(),
              title: 'title',
              type: 'type',
              description: 'Donner vie à une image',
              cover:
                'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
              ...doc,
            },
            ...state.activitySlice.activities,
          ],
        },
      }));
    },
    getActivity: (id) => {
      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          activities: state.activitySlice.activities.filter(
            (activity) => activity.id == id,
          ),
        },
      }));
    },
    updateActivity: (activity) => {
      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          activities: state.activitySlice.activities.map((item) => {
            if (item.id === activity.id) {
              return {
                ...item,
                ...activity,
              };
            } else {
              return item;
            }
          }),
        },
      }));
    },

    removeActivity: (id) => {
      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          activities: state.activitySlice.activities.filter(
            (activity) => activity.id !== id,
          ),
        },
      }));
    },

    //
    // Auras
    //
    auras: [
      {
        id: 1,
        activityId: 2,
        type: 'AText',
        content: 'HElLo Editable!!',
        cfg: {
          style: {
            fontFamily: 'Arial',
            fontSize: 64,
            color: 'hotpink',
            background: 'transparent',
            textAlign: 'center',
            fontVariant: 'normal',
            fontStyle: 'italic',
            fontWeight: 400,
            width: 220.984375,
            height: 178.984375,
          },
          position: [-0.17292702022058784, -0.2514455380758439, 1],
          scale: [1, 1, 1],
          rotation: [0, 0, 0],
        },
      },
      {
        id: 2,
        activityId: 2,
        type: 'AText',
        content: 'Hello MIXAP..!!',
        cfg: {
          style: {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#000',
            background: 'transparent',
            textAlign: 'center',
            fontVariant: 'normal',
            fontStyle: 'italic',
            fontWeight: 400,
            width: 350.984375,
            height: 85.984375,
          },
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          position: [-0.17292702022058784, -0.2514455380758439, 1],
        },
      },
    ],
    addAura: (aura) => {
      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          auras: [
            { id: nanoid(), cfg: {}, ...aura },
            ...state.activitySlice.auras,
          ],
        },
      }));
    },
    retriveAuras: (id) => {
      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          auras: state.activitySlice.auras.filter(
            (aura) => aura.activityId == id,
          ),
        },
      }));
    },
    updateAura: (aura) => {
      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          auras: state.activitySlice.auras.map((item) => {
            if (item.id === aura.id) {
              return {
                ...item,
                ...aura,
              };
            } else {
              return item;
            }
          }),
        },
      }));
    },
    /*retrieveAuraById: (id) => {
      get((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          auras: state.activitySlice.auras.filter((aura) => aura.id == id),
          ),
        },
      }));
    },*/
    removeAura: (id) => {
      set((state): any => ({
        activitySlice: {
          ...state.activitySlice,
          auras: state.activitySlice.auras.filter((aura) => aura.id !== id),
        },
      }));
    },
  },
});

export default activitySlice;
