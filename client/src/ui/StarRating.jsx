import { useState, useEffect } from "react";

function StarRating({
	maxRating = 10,
	initialRating = 0, // Default to 0 instead of -1 for clarity
	onRatingChange,
	starColor = "gold",
	emptyStarColor = "gray",
	size = "35px",
}) {
	const [rating, setRating] = useState(initialRating);
	const [hoverRating, setHoverRating] = useState(0);

	// Sync internal rating when the prop from the parent changes
	useEffect(() => {
		setRating(initialRating);
	}, [initialRating]);

	function handleSetRating(newRating) {
		setRating(newRating);
		if (onRatingChange) {
			onRatingChange(newRating);
		}
	}

	const displayRating = hoverRating || rating;

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
			<div
				style={{ display: "flex" }}
				onMouseLeave={() => setHoverRating(0)} // Reset hover on leave
			>
				{Array.from({ length: maxRating }, (_, i) => (
					<Star
						key={i}
						isFull={displayRating >= i + 1}
						onRate={() => handleSetRating(i + 1)}
						onHoverIn={() => setHoverRating(i + 1)}
						starColor={starColor}
						emptyStarColor={emptyStarColor}
						size={size}
					/>
				))}
			</div>
			<p
				style={{
					fontSize: "18px",
					color: "gold",
					lineHeight: 1,
					margin: 0,
					minWidth: "30px", // Prevents layout shift
				}}
			>
				{displayRating > 0 ? displayRating : ""}
			</p>
		</div>
	);
}

// A helper component to keep the mapping logic clean
function Star({ isFull, onRate, onHoverIn, starColor, size }) {
	return (
		<span
			role="button"
			style={{ cursor: "pointer", display: "block" }}
			onClick={onRate}
			onMouseEnter={onHoverIn}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill={isFull ? starColor : "none"}
				stroke={starColor}
				width={size}
				height={size}
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		</span>
	);
}

export default StarRating;
