import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Make sure the path is correct
import "./index.css"; // Import your CSS file if you have one
// import "./star.css";
// import StarRating from "./StarRating";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
