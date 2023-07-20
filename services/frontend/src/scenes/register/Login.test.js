import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import { Route, Router, Routes } from "react-router-dom";

import { CircularProgress } from "@mui/material";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import i18n from "test-utils/i18nForTests";
import setupTestStore from "test-utils/setupTestStore";

import Login from "./Login";

let mockLogin = jest.fn();
let mockEnqueue = jest.fn();

jest.mock("api/register", () => ({
	useRegisterApi: () => ({
		login: mockLogin,
	}),
}));

jest.mock("notistack", () => ({
	...jest.requireActual("notistack"),
	useSnackbar: () => {
		return {
			enqueueSnackbar: mockEnqueue,
		};
	},
}));

describe("Login Component", () => {
	describe("Jwt already exists", () => {
		const storeRef = setupTestStore({
			jwt: {
				jwt: {
					accessToken: "test token",
				},
			},
		});

		it("should redirect to dashboard if there is jwt already", async () => {
			const history = createMemoryHistory();

			history.push("/login");

			await act(async () => {
				await render(
					<I18nextProvider i18n={i18n}>
						<Suspense fallback={<CircularProgress />}>
							<Router location={history.location} navigator={history}>
								<Routes>
									<Route path="/login" element={<Login test />} />
									<Route path="/" element={<></>} />
								</Routes>
							</Router>
						</Suspense>
					</I18nextProvider>,
					{ wrapper: storeRef.Wrapper }
				);
			});

			await waitFor(async () => {
				expect(history.location.pathname).toBe("/dashboard");
			});
		});
	});

	describe("No jwt exists", () => {
		const storeRef = setupTestStore({
			jwt: {
				jwt: {
					accessToken: null,
				},
			},
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		it("should render successfully", async () => {
			const history = createMemoryHistory();

			history.push("/login");

			await act(async () => {
				await render(
					<I18nextProvider i18n={i18n}>
						<Suspense fallback={<CircularProgress />}>
							<Router location={history.location} navigator={history}>
								<Routes>
									<Route path="/login" element={<Login test />} />
									<Route path="/" element={<></>} />
								</Routes>
							</Router>
						</Suspense>
					</I18nextProvider>,
					{ wrapper: storeRef.Wrapper }
				);
			});

			await waitFor(async () => {
				await expect(true).toBe(true);
			});
		});

		it("should render email & password fields", async () => {
			const history = createMemoryHistory();

			history.push("/login");

			await act(async () => {
				await render(
					<I18nextProvider i18n={i18n}>
						<Suspense fallback={<CircularProgress />}>
							<Router location={history.location} navigator={history}>
								<Routes>
									<Route path="/login" element={<Login test />} />
									<Route path="/" element={<></>} />
								</Routes>
							</Router>
						</Suspense>
					</I18nextProvider>,
					{ wrapper: storeRef.Wrapper }
				);
			});

			await waitFor(async () => {
				await expect(screen.getByTestId("login-email")).toBeDefined();
				await expect(screen.getByTestId("login-password")).toBeDefined();
				await expect(screen.getByTestId("login-submit")).toBeDefined();
			});
		});

		it("should fail to submit when email is not valid", async () => {
			const history = createMemoryHistory();

			history.push("/login");

			await act(async () => {
				await render(
					<I18nextProvider i18n={i18n}>
						<Suspense fallback={<CircularProgress />}>
							<Router location={history.location} navigator={history}>
								<Routes>
									<Route path="/login" element={<Login test />} />
									<Route path="/" element={<></>} />
								</Routes>
							</Router>
						</Suspense>
					</I18nextProvider>,
					{ wrapper: storeRef.Wrapper }
				);
			});

			fireEvent.change(screen.getByTestId("login-email"), {
				target: { value: "invalid_mail_address" },
			});

			fireEvent.change(screen.getByTestId("login-password"), {
				target: { value: "sometestpass123" },
			});

			fireEvent.click(screen.getByTestId("login-submit"));

			await waitFor(async () => {
				await expect(mockEnqueue).toBeCalledWith("login_email_invalid", { variant: "error" });
			});
		});

		it("should submit successfully then show legacy user message", async () => {
			const history = createMemoryHistory();

			const email = "valid_mail_address@mail.com";
			const password = "iyDW7ZeQq*&T";

			mockLogin = jest.fn(() =>
				Promise.resolve({
					data: {
						legacyUser: true,
					},
				})
			);

			history.push("/login");

			await act(async () => {
				await render(
					<I18nextProvider i18n={i18n}>
						<Suspense fallback={<CircularProgress />}>
							<Router location={history.location} navigator={history}>
								<Routes>
									<Route path="/login" element={<Login test />} />
									<Route path="/" element={<></>} />
								</Routes>
							</Router>
						</Suspense>
					</I18nextProvider>,
					{ wrapper: storeRef.Wrapper }
				);
			});

			fireEvent.change(screen.getByTestId("login-email"), {
				target: { value: "valid_mail_address@mail.com" },
			});

			fireEvent.change(screen.getByTestId("login-password"), {
				target: { value: "iyDW7ZeQq*&T" },
			});

			fireEvent.click(screen.getByTestId("login-submit"));

			await waitFor(async () => {
				expect(mockLogin).toHaveBeenCalledWith({ email, password });
				await expect(screen.getByTestId("legacy-user-message")).toBeDefined();
			});
		});

		it("should submit successfully then redirect to login verification", async () => {
			const history = createMemoryHistory();

			const email = "valid_mail_address@mail.com";
			const password = "iyDW7ZeQq*&T";

			mockLogin = jest.fn(() =>
				Promise.resolve({
					data: {
						transactionId: "test-transaction-id",
					},
				})
			);

			history.push("/login");

			await act(async () => {
				await render(
					<I18nextProvider i18n={i18n}>
						<Suspense fallback={<CircularProgress />}>
							<Router location={history.location} navigator={history}>
								<Routes>
									<Route path="/login" element={<Login test />} />
									<Route path="/dashboard" element={<></>} />
								</Routes>
							</Router>
						</Suspense>
					</I18nextProvider>,
					{ wrapper: storeRef.Wrapper }
				);
			});

			fireEvent.change(screen.getByTestId("login-email"), {
				target: { value: "valid_mail_address@mail.com" },
			});

			fireEvent.change(screen.getByTestId("login-password"), {
				target: { value: "iyDW7ZeQq*&T" },
			});

			fireEvent.click(screen.getByTestId("login-submit"));

			await waitFor(async () => {
				expect(mockLogin).toHaveBeenCalledWith({ email, password });
				expect(history.location.pathname).toBe("/login-verification");
			});
		});

		it("should submit successfully then redirect to dashboard", async () => {
			const history = createMemoryHistory();

			const email = "valid_mail_address@mail.com";
			const password = "iyDW7ZeQq*&T";

			mockLogin = jest.fn(() =>
				Promise.resolve({
					data: {
						accessToken: "test-access-token",
					},
				})
			);

			history.push("/login");

			await act(async () => {
				await render(
					<I18nextProvider i18n={i18n}>
						<Suspense fallback={<CircularProgress />}>
							<Router location={history.location} navigator={history}>
								<Routes>
									<Route path="/login" element={<Login test />} />
									<Route path="/dashboard" element={<></>} />
								</Routes>
							</Router>
						</Suspense>
					</I18nextProvider>,
					{ wrapper: storeRef.Wrapper }
				);
			});

			fireEvent.change(screen.getByTestId("login-email"), {
				target: { value: email },
			});

			fireEvent.change(screen.getByTestId("login-password"), {
				target: { value: password },
			});

			fireEvent.click(screen.getByTestId("login-submit"));

			await waitFor(async () => {
				expect(mockLogin).toHaveBeenCalledWith({ email, password });
				expect(history.location.pathname).toBe("/dashboard");
			});
		});
	});
});
