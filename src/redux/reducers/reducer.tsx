import initialState from '../store/initialState'

const rootReducer = (state = initialState, action: any) => {	
	switch(action.type) {
		case 'SET_MATERIALS':
			return { ...state, materials: action.payload }
		default:
			return state;
	}
}

export default rootReducer;
