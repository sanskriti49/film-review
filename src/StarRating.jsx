import { useState, useEffect } from "react";

function StarRating({
	maxRating = 10,
	initialRating = -1,
	onRatingChange,
	starColor = "gold",
	emptyStarColor = "gray",
	size = "35px",
	resetEnabled = true,
}) {
	const [hoverRating, setHoverRating] = useState(-1);
	const [rating, setRating] = useState(initialRating);
	const stars = Array.from({ length: maxRating }, (_, index) => index);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		// Update the rating when initialRating changes
		setRating(initialRating);
	}, [initialRating]);

	const resetStars = () => {
		setIsHovered(true);
		setRating(-1);
		if (onRatingChange) {
			onRatingChange(-1); // Notify parent about the reset
		}
	};

	return (
		<div>
			<div
				className="star-rating"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => {
					setIsHovered(false);
					setHoverRating(-1);
				}}
				style={{ display: "flex", alignItems: "center" }}
			>
				{resetEnabled && isHovered && (
					<div
						className="reset-stars"
						onClick={resetStars}
						style={{
							cursor: "pointer",
							fontSize: "25px",
							display: "inline",
							marginBottom: "9px",
							marginRight: "8px",
						}}
					>
						&times;
					</div>
				)}

				{stars.map((currStar, index) => {
					const isFullStar =
						Math.floor(hoverRating) >= currStar ||
						Math.floor(rating) >= currStar;
					const isHalfStar =
						(hoverRating >= currStar - 0.5 || rating >= currStar - 0.5) &&
						rating < currStar;

					return (
						<span
							key={index}
							className="star"
							style={{
								cursor: "pointer",
								color: isFullStar || isHalfStar ? starColor : emptyStarColor,
								fontSize: size,
							}}
							onMouseOver={() => {
								if (isHalfStar) {
									setHoverRating(currStar - 0.5);
								} else {
									setHoverRating(currStar);
								}
							}}
							onMouseOut={() => setHoverRating(-1)}
							onClick={() => {
								if (isHalfStar) {
									setRating(currStar - 0.5);
								} else {
									setRating(currStar);
								}
								if (onRatingChange) {
									onRatingChange(isHalfStar ? currStar - 0.5 : currStar);
								}
							}}
						>
							{isFullStar ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill={starColor}
									stroke={starColor}
									width={size}
									height={size}
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							) : isHalfStar ? (
								// <FontAwesomeIcon icon={faStarHalfAlt} />
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill={starColor}
									stroke={starColor}
									width={size}
									height={size}
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
										fill={starColor}
										clipPath="inset(0 50% 0 0)"
									/>

									<path
										fill="none"
										stroke={starColor}
										strokeWidth="1"
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke={starColor}
									width={size}
									height={size}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="{2}"
										d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
									/>
								</svg>
							)}
						</span>
					);
				})}
				<div
					style={{
						fontSize: "18px",
						color: "gold",
						marginLeft: "12px",
						marginBottom: "6px",
					}}
				>
					{hoverRating >= 0 ? hoverRating + 1 : rating > 0 ? rating + 1 : ""}
				</div>
			</div>
		</div>
	);
}

export default StarRating;
