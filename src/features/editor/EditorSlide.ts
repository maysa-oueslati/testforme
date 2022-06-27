import { StoreSlice } from '../../app/store';

interface IEditor {
  activity: string;
  compiling: boolean;
  tracking: boolean;
  percentage: number;
  markerImages: any[];
  markerFile: any;

  setActivity: (activity: string) => void;
  setTracking: (tracking: boolean) => void;
  setMarkerImages: (markerImages: any[]) => void;
  setMarkerFile: (markerFile: any) => void;
}

interface IEditorSlice {
  editorSlice: IEditor;
}

const editorSlice: StoreSlice<IEditorSlice> = (set /*, get*/) => ({
  editorSlice: {
    compiling: false,
    tracking: false,
    percentage: 0,
    activity: 'Activité MIXAP',
    markerImages: [],
    markerFile: null,
    setActivity: (activity) => {
      set((state): any => ({
        editorSlice: { ...state.editorSlice, activity: activity },
      }));
    },
    setTracking: (tracking) => {
      set((state): any => ({
        editorSlice: { ...state.editorSlice, tracking: tracking },
      }));
    },
    setMarkerImages: (markerImages) => {
      set((state): any => ({
        editorSlice: { ...state.editorSlice, markerImages: markerImages },
      }));
    },
    setMarkerFile: (markerFile) => {
      set((state): any => ({
        editorSlice: { ...state.editorSlice, markerFile: markerFile },
      }));
    },
  },
});

export default editorSlice;
