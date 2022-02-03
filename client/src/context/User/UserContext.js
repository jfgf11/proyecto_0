import React, { useState, useEffect, useReducer } from "react";

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);


const UserContext = PassedComponent => {
	const initialState = {
		user: {},
		token : ''
	}
	//const [state, setState] = useReducer(reducer, initi)


};

export default UserContext;