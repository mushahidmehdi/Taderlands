import React, { useEffect, useRef } from "react";

const SuccessRatio = ({ degrees, ...rest }) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		const bgColor = "#0F20E8";
		//Our first draw
		ctx.beginPath();
		ctx.strokeStyle = bgColor;
		ctx.lineWidth = 10;
		ctx.arc(100, 75, 50, 0.5 * Math.PI, 1.6 * Math.PI);
		ctx.stroke();

		const radians = (degrees * Math.PI) / 180;
	}, []);

	return <canvas width={200} height={100} ref={canvasRef} {...rest} />;
};

export default SuccessRatio;
