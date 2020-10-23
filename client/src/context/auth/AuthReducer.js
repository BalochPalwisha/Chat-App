import * as TYPES from '../types';

export default (state, action) => {
  switch (action.type) {
    case TYPES.START_LOADING:
      return {...state, loading: true};
    case TYPES.STOP_LOADING:
      return {...state, loading: false};
    case TYPES.SET_STEPPER_INDEX:
      return {...state, stepperIndex: action.payload};
    case TYPES.ZINGER_INFO_UPDATED:
      return {...state, stepperIndex: 1, loading: false};
    case TYPES.ZINGER_LOCATION_UPDATED:
      return {...state, stepperIndex: 2, loading: false};
    case TYPES.LOGIN_USER:
    case TYPES.SET_USER:
      return {...state, user: action.payload, loading: false};
      case TYPES.LOGOUT:
        return {...state, user: action.payload, loading: false};
    default:
      return state;
  }
};
