import { BaseActionsRow } from '../../../_models/actions.model';

addEventListener('message', (e: MessageEvent<Array<BaseActionsRow>>) => {
  const types = new Set();

  e.data.forEach(({ typeId }) => {
    types.add(typeId);
  });

  postMessage(Array.from(types));
});
