import { useEffect } from "react";

const useKey = (key, action, ignoreInputs = true) => {
	useEffect(
		function () {
			function callback(e) {
				if (e.key === key || e.code === key) {
					e.preventDefault();
					if (ignoreInputs && document.activeElement.tagName === "INPUT")
						return;

					action(e);
				}
			}

			document.addEventListener("keydown", callback);

			return () => document.removeEventListener("keydown", callback);
		},
		[key, action, ignoreInputs]
	);
};

export default useKey;
