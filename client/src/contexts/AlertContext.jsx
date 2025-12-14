// src/contexts/AlertContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import Alerts from "../ui/Alerts"; // Make sure this path is correct

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
	const [alert, setAlert] = useState(null);

	const showAlert = useCallback((message, type = "success") => {
		setAlert({ message, type });
		// Auto-hide handled by the Alerts component itself,
		// but we clear state here to allow re-triggering
		setTimeout(() => setAlert(null), 2500);
	}, []);

	const closeAlert = () => setAlert(null);

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			{alert && (
				<Alerts
					message={alert.message}
					type={alert.type}
					onClose={closeAlert}
				/>
			)}
		</AlertContext.Provider>
	);
};
