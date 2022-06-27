import React, { useState, useEffect } from 'react';
import { RxDatabase } from 'rxdb';
import { Provider } from 'rxdb-hooks';

import { getDB } from './rxdb';
import { LocalDbCollections } from './types';

export function RxProvider({ children }: any) {
  const [db, setDb] = useState<RxDatabase<LocalDbCollections, any, any>>();

  useEffect(() => {
    const initDB = async () => {
      const db = await getDB();
      setDb(db);
    };
    initDB();
  }, []);

  return <Provider db={db}>{children}</Provider>;
}
