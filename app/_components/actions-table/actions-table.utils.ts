import { useState } from 'react';

export const useActionTypes = () => {
  const [actionTypes, setActionTypes] = useState<Array<string>>([]);

  const [currentActions, setCurrentActions] = useState<Array<string>>([]);

  return {
    actionTypes,
    currentActions,
    setActionTypes,
    setCurrentActions,
  };
};
