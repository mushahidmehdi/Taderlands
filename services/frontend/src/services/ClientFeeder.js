import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { normalizeRateMessage } from "components/Positions/utils";

import { setPrice } from "actions/PriceActions";

import Config from "services/config";

// TODO: all of the comments will be removed
export default function ClientFeeder({ data }) {
	const { price } = useSelector((state) => state.price);
	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	const [authorized, setAuthorized] = useState();
	const [message, setMessage] = useState();

	const ws = useRef(null);
	const dispatch = useDispatch();

	const initWs = () => {
		ws.current = new WebSocket(Config.clientFeederRoot());

		ws.current.onopen = () => {
			if (ws.current?.readyState === WebSocket.OPEN) {
				ws.current.send(selectedJWT.accessToken);
			}
		};
		ws.current.onclose = () => console.log("Web socket is closed.");

		ws.current.onmessage = (e) => {
			console.log("Socket data received: ", e.data);
			setMessage(e.data);
		};
	};

	const send = (data) => {
		if (ws.current?.readyState !== WebSocket.OPEN) {
			console.log("Websocket error: ready state is not open: ", ws.current?.readyState);
			return;
		}

		console.log("Socket data sent: ", data);

		ws.current.send(data);
	};

	const unsubscribe = () => {
		ws.current.send(JSON.stringify({ type: "unsubscribe" }));

		ws.current.close();

		ws.current = null;

		setAuthorized();

		setMessage();
	};

	useEffect(() => {
		return () => {
			console.log("Websocket cleanup...");
			ws.current?.readyState === WebSocket.OPEN && unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (data) {
			initWs();
		}
	}, [data]);

	useEffect(() => {
		if (message === "Authorized") {
			setAuthorized(true);
			return;
		}

		try {
			if (message && authorized) {
				const data = JSON.parse(message);

				console.log("Different message received: ", data);

				dispatch(setPrice(normalizeRateMessage(price, data?.data)));
			}
		} catch (e) {
			console.log("Error while attempting json parse");
		}
	}, [message]);

	useEffect(() => {
		if (authorized && data) {
			send(data);
		}
	}, [authorized, data]);

	return <></>;
}
