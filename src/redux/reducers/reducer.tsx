import initialState from "../store/initialState";

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, logged: true };
    case "LOGOUT":
      return { ...state, logged: false };
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
        applicationAreas: state.applicationAreas.filter(
          (t: any) => t.id !== action.payload
        ),
      };
    case "SET_SYSTEM":
      return { ...state, systems: action.payload };
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
      // OS = Optimal Standard
      // obtengo el sistema recibido
      const dispatchedOSSystem: any = state.systems.find(
        (system: any) => system.id === action.payload
      );
      //busco si existe otro sistema que sea EO y que tenga el mismo campo de aplicación
      const existingOSSystem: any = state.systems.find(
        (system: any) =>
          system.systemCategory === "OPTIMAL_STANDARD" &&
          system.applicationArea.id === dispatchedOSSystem?.applicationArea?.id
      );
      //Si existe otro que coincida, le quito el systemCategory y le seteo al recibido en el dispatch
      const updatedSystems = state.systems.map((system: any) => {
        if (existingOSSystem && system.id === existingOSSystem?.id) {
          return { ...system, systemCategory: "" };
        }
        if (system.id === action.payload) {
          return { ...system, systemCategory: "OPTIMAL_STANDARD" };
        }
        return system;
      });

      return { ...state, systems: updatedSystems };
    case "SET_ALTERNATIVE_OPTIMAL_STANDARD":
      // AOS = Alternative Optimal Standard
      // obtengo el sistema recibido
      const dispatchedAOSystem: any = state.systems.find(
        (system: any) => system.id === action.payload
      );

      //busco si existe otro sistema que sea EOA y que tenga el mismo campo de aplicación
      const existingAOSystem: any = state.systems.find(
        (system: any) =>
          system.systemCategory === "ALTERNATIVE_OPTIMAL_STANDARD" &&
          system.applicationArea.id === dispatchedAOSystem?.applicationArea?.id
      );
      //Si existe otro que coincida, le quito el systemCategory y le seteo al recibido en el dispatch
      const updatedSystemsAOS = state.systems.map((system: any) => {
        if (existingAOSystem && system.id === existingAOSystem?.id) {
          return { ...system, systemCategory: "" };
        }
        if (system.id === action.payload) {
          return { ...system, systemCategory: "ALTERNATIVE_OPTIMAL_STANDARD" };
        }
        return system;
      });

      return { ...state, systems: updatedSystemsAOS };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
