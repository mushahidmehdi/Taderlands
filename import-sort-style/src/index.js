"use strict";

function isReact(imported) {
	return imported.moduleName.startsWith("react");
}

function isInternalModule(imported) {
	return imported.moduleName.startsWith("@paratica");
}

function isExclusiveGroup(index, groups) {
	const groupArray = Array.isArray(groups[index]) ? groups[index] : [groups[index]];

	return (name) => {
		if (!groupArray.some((g) => name.includes(g))) {
			return false;
		}

		for (let i = index + 1; i < groups.length; ++i) {
			const groupArray = Array.isArray(groups[i]) ? groups[i] : [groups[i]];
			if (groupArray.some((g) => name.includes(g))) {
				return false;
			}
		}

		return true;
	};
}

function materialUiGroups({ alias, and, hasMember, moduleName, naturally, startsWith, unicode }) {
	const groups = ["core", ["core/styles", "core/colors"], "icons"];

	let groupMatches = groups.reduce(
		(acc, name, ix) =>
			acc.concat([
				{
					match: and(
						hasMember,
						moduleName(startsWith("@material-ui")),
						moduleName(isExclusiveGroup(ix, groups))
					),
					sort: moduleName(naturally),
					sortNamedMembers: alias(unicode),
				},
				{ separator: true },
			]),
		[]
	);

	groupMatches.push(
		{
			match: and(hasMember, moduleName(startsWith("@material-ui"))),
			sort: moduleName(naturally),
			sortNamedMembers: alias(unicode),
		},
		{ separator: true }
	);

	return groupMatches;
}

function isSourcePackage(options) {
	const internal = options.internal || [];
	return (imported) => {
		return internal.some((path) => imported.moduleName.startsWith(path));
	};
}

function notMaterialUi(styleApi, options) {
	const { or, not, moduleName, startsWith } = styleApi;
	return (imported) => {
		return not(or(isInternalModule, isSourcePackage(options), moduleName(startsWith(["@material-ui"]))))(imported);
	};
}

module.exports = function sortImports(styleApi, file, options) {
	const {
		alias,
		and,
		dotSegmentCount,
		not,
		hasMember,
		hasNoMember,
		isAbsoluteModule,
		isRelativeModule,
		isScopedModule,
		moduleName,
		naturally,
		unicode,
	} = styleApi;

	return [
		// import … from "react...";
		{
			match: and(hasMember, isReact),
			sort: moduleName(naturally),
			sortNamedMembers: alias(unicode),
		},
		{ separator: true },

		// import … from "foo";
		{
			match: and(hasMember, isAbsoluteModule, notMaterialUi(styleApi, options), not(isScopedModule)),
			sort: moduleName(naturally),
			sortNamedMembers: alias(unicode),
		},
		{ separator: true },

		// import … from "@foo";
		{
			match: and(hasMember, isAbsoluteModule, notMaterialUi(styleApi, options)),
			sort: moduleName(naturally),
			sortNamedMembers: alias(unicode),
		},
		{ separator: true },

		// import … from "@material-ui/...";
		...materialUiGroups(styleApi, options),

		// import … from "@paratica/...";
		{
			match: and(hasMember, isInternalModule),
			sort: moduleName(naturally),
			sortNamedMembers: alias(unicode),
		},
		{ separator: true },

		// import … from "utils/helper";
		{
			match: and(hasMember, isAbsoluteModule),
			sort: moduleName(naturally),
			sortNamedMembers: alias(unicode),
		},
		{ separator: true },

		// import … from "./foo";
		// import … from "../foo";
		{
			match: and(hasMember, isRelativeModule),
			sort: [dotSegmentCount, moduleName(naturally)],
			sortNamedMembers: alias(unicode),
		},
		{ separator: true },

		// import "foo"
		{ match: and(hasNoMember, isAbsoluteModule) },
		{ separator: true },

		// import "./foo"
		{ match: and(hasNoMember, isRelativeModule), sort: [dotSegmentCount, moduleName(naturally)] },
		{ separator: true },
	];
};
