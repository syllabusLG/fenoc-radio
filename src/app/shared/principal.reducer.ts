import {Principal} from './principal.model';
import {SAVE_PRINCIPAL, SavePrincipalAction} from './save.principal.action';

export function principalReducer(state: Principal, action: SavePrincipalAction) {
  switch (action.type){
    case SAVE_PRINCIPAL:
      return Object.assign({}, state, action.payload);
    default:
  }
}
