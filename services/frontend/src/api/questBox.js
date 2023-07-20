import { Config, useFetchAuthorized } from "services";

import queryBuilder from "utils/queryBuilder";

import { errorHandler } from "./errorHandler";

export const useQuestBoxApi = () => {
	const fetchAuthorized = useFetchAuthorized();
	const getCampaigns = () =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaigns`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const getCampaign = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaign/${id}`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const getCampaignAttendances = () =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaigns/attended`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const updateCampaign = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaign/${id}/status`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PUT",
		})
			.then(errorHandler)
			.then((res) => res);

	const createCampaign = () =>
		fetchAuthorized(`${Config.apiRoot()}/campaigns`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
		}).then(errorHandler);

	const getEligibilityUserStatus = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaign/${id}/eligibility`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	const createCampaingAttendance = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaign/${id}/attendance`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
		}).then(errorHandler);

	const checkCampaignUserStatus = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaign/${id}/status`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PATCH",
		}).then(errorHandler);

	const claimRewards = (id) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/campaign/${id}/claim`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "PATCH",
		}).then(errorHandler);

	const getLeaderboard = ({ campaignId, pageNumber = 0, pageSize = 10 }) =>
		fetchAuthorized(
			`${Config.apiRoot()}/dashboard/leaderboard/${campaignId}?${queryBuilder({
				pageNumber,
				pageSize,
			})}`,
			{
				headers: {
					"Content-type": "application/json",
				},
				method: "GET",
			}
		).then(errorHandler);

	const getSelfLeaderboard = (campaignId) =>
		fetchAuthorized(`${Config.apiRoot()}/dashboard/leaderboard/${campaignId}/self`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "GET",
		}).then(errorHandler);

	return {
		getCampaigns,
		getCampaignAttendances,
		getCampaign,
		updateCampaign,
		createCampaign,
		getEligibilityUserStatus,
		createCampaingAttendance,
		checkCampaignUserStatus,
		claimRewards,
		getLeaderboard,
		getSelfLeaderboard,
	};
};
