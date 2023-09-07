import initialState from "../store/initialState";

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // --------------- SESIÓN ---------------
    case "LOGIN":
      return { ...state, logged: true };
    case "LOGOUT":
      return { ...state, logged: false };
    // --------------- MATERIAL ---------------
    case "SET_MATERIALS":
      return { ...state, materials: action.payload };
    case "SAVE_MATERIAL":
      return { ...state, materials: [...state.materials, action.payload] };
    case "DELETE_MATERIAL":
      return {
        ...state,
        materials: state.materials.filter((t: any) => t.id !== action.payload),
      };
    // --------------- AREA DE APLICACIÓN ---------------
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
        applicationAreas: state.applicationAreas.filter(
          (t: any) => t.id !== action.payload
        ),
      };
    // --------------- SISTEMA ---------------
    case "SET_SYSTEM":
      return { ...state, systems: action.payload };
    case "DELETE_SYSTEM":
      return {
        ...state,
        systems: state.systems.filter((t: any) => t.id !== action.payload),
      };
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "SAVE_COMMENTS":
      return { ...state, comments: [...state.comments, action.payload] };
    case "DELETE_COMMENT":
      return {
        ...state,
        comments: state.comments.filter((t: any) => t.id !== action.payload),
      };
    case "SET_OPTIMAL_STANDARD":
      return {
        ...state,
        systems: updateSystemCategory(
          state.systems,
          action.payload,
          "OPTIMAL_STANDARD"
        ),
      };
    case "SET_ALTERNATIVE_OPTIMAL_STANDARD":
      return {
        ...state,
        systems: updateSystemCategory(
          state.systems,
          action.payload,
          "ALTERNATIVE_OPTIMAL_STANDARD"
        ),
      };
    case "SET_REMOVE":
      return {
        ...state,
        systems: updateSystemCategory(state.systems, action.payload, "REMOVE"),
      };
    // --------------- VARIABLES GLOBALES ---------------
    case "SET_DOLLAR_RATE":
      return { ...state, dollarRate: action.payload };
    case "SET_LABOR_COST":
      return { ...state, laborCost: action.payload };
    default:
      return state;
  }
};

const updateSystemCategory = (
  systems: any[],
  payload: any,
  newCategory: string
) => {
  return systems.map((system: any) => ({
    ...system,
    systemCategory: system.id === payload ? newCategory : system.systemCategory,
  }));
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
