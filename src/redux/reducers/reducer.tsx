import initialState from "../store/initialState";

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_MATERIALS":
      return { ...state, materials: action.payload };
    case "SAVE_MATERIAL":
      console.log('materials', ...state.materials);
      console.log('payload', action.payload);
      return { ...state, materials: [...state.materials, action.payload] };
    case "DELETE_MATERIAL":
      return {
        ...state,
        materials: state.materials.filter((t: any) => t.id !== action.payload),
      };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
