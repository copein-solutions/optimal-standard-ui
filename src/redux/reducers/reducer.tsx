import initialState from "../store/initialState";

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'LOGIN':
			return { ...state, logged: true }
    case "SET_MATERIALS":
      return { ...state, materials: action.payload };
    case "SAVE_MATERIAL":
      return { ...state, materials: [...state.materials, action.payload] };
    case "DELETE_MATERIAL":
      return {
        ...state,
        materials: state.materials.filter((t: any) => t.id !== action.payload),
      };
    case "SET_APPLICATION_AREA":
      return { ...state, applicationAreas: action.payload };
    case "SAVE_APPLICATION_AREA":
      return {
        ...state,
        applicationAreas: [...state.applicationAreas, action.payload],
      };
    case "DELETE_APPLICATION_AREA":
      return {
        ...state,
        materials: state.applicationAreas.filter(
          (t: any) => t.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
