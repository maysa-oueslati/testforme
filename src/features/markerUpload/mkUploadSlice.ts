import { StoreSlice } from '../../app/store';

interface IMkUpload {
  compiling: boolean;
  percentage: number;
  markerImages: any[];
  markerFile: any;
  setCompiling: (compiling: boolean) => void;
  setMarkerImages: (markerImages: any[]) => void;
  setMarkerFile: (markerFile: any) => void;
}

interface IMkUploadSlice {
  mkUploadSlice: IMkUpload;
}

const mkUploadSlice: StoreSlice<IMkUploadSlice> = (set /*, get*/) => ({
  mkUploadSlice: {
    compiling: false,
    percentage: 0,
    markerImages: [],
    markerFile: null,
    setCompiling: (compiling) => {
      set((state): any => ({
        mkUploadSlice: { ...state.mkUploadSlice, compiling },
      }));
    },
    setMarkerImages: (markerImages) => {
      set((state): any => ({
        mkUploadSlice: { ...state.mkUploadSlice, markerImages: markerImages },
      }));
    },
    setMarkerFile: (markerFile) => {
      set((state): any => ({
        mkUploadSlice: { ...state.mkUploadSlice, markerFile: markerFile },
      }));
    },
  },
});

export default mkUploadSlice;
