import React from 'react';

import { AText } from './AText';
import { AImage } from './AImage';

export function Aura({ document, onChange, onDelete }: any) {
  let aura;

  switch (document.type) {
    case 'AText':
      aura = (
        <AText
          document={document}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
      break;
    case 'AImage':
      aura = (
        <AImage
          document={document}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
      break;
    default:
      break;
  }
  return aura;
}
