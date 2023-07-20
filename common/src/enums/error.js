// https://docs.google.com/document/d/1Qd88X8GWPu046RSB2Gffl6VLDipybVdJ/

module.exports = {
	PASSWORD_REQUIRED: {
		code: "002",
		detail: "password required for endpoint",
	},
	WRONG_PASSWORD: {
		code: "002",
		detail: "password is wrong",
	},
	INVALID_CREDENTIALS: {
		code: "002",
		detail: "invalid credentials",
	},
	TRANSACTION_REQUIRED: {
		code: "006",
		detail: "transaction required for endpoint",
	},
	VALIDATION_EXPIRED: {
		code: "010",
		detail: "Forgot link is not valid anymore. Please request another link from forgot password.",
	},
	EMAILCODE_REQUIRED: {
		code: "004",
		detail: "emailCode required for endpoint",
	},
	SMSCODE_REQUIRED: {
		code: "005",
		detail: "smsCode required for endpoint",
	},
	TWOFACODE_REQUIRED: {
		code: "003",
		detail: "twofaCode required for endpoint",
	},
	OPERATION_NOT_MATCH: {
		code: "007",
		detail: "operation not match",
	},
	PASSWORD_DOES_NOT_MATCH: {
		code: "008",
		detail: "passwords now match",
	},
	CAPTCHA_INVALID: {
		code: "009",
		detail: "captcha invalid",
	},
	DELETED_USER: {
		code: "010",
		detail: "deleted user",
	},
	IS_ALREADY_EXIST: {
		detail: "phoneNumber or email is already using by another user",
		code: "104",
	},
	SHOULD_LOGIN: {
		code: "101",
		detail: "should login",
	},
	USER_NOT_FOUND: {
		code: "105",
		detail: "User not found.",
	},
	USER_NOT_VERIFIED: {
		code: "106",
		detail: "User not verified.",
	},
	TOKEN_EXPIRED: {
		detail: "token expired",
		code: "107",
	},
	REFERENCE_CODE_NOT_FOUND: {
		code: "108",
		detail: "Reference code is not valid.",
	},
	ERROR_RECEIVED_DURING_REGISTER: {
		detail: "error received during register",
		code: "111",
	},
	INVALID_NOTIFICATION_REASON: {
		code: "109",
		detail: "invalid notification reason",
	},
	ERROR_RECEIVED_DURING_UPDATE: {
		detail: "Error received during update",
		code: "110",
	},
	INVALID_NOTIFICATION_TITLE: {
		code: "110",
		detail: "invalid notification title",
	},
	NO_USER_NOTIFICATION_OR_USER_NOTIFICATION_SETTING_EXISTS: {
		code: "111",
		detail: "no userNotification or userNotificationSetting exists",
	},
	KYC_VALIDATION_REQUIRED: {
		code: "112",
		detail: "kyc validation required",
	},
	REFERENCE_CODE_REGISTRATION_LIMIT_EXCEEDED: {
		code: "113",
		detail: "Maximum sign-up for this reference code has been reached!",
	},
	REFERENCE_CODE_REQUIRED: {
		code: "114",
		detail: "Please use a reference code to register",
	},
	INVALID_TRANSACTION_CODE: {
		code: "115",
		detail: "Invalid transaction code",
	},
	REFERENCE_CODE_ALREADY_USED: {
		code: "116",
		detail: "Reference code already used",
	},
	OWN_REFERENCE_CODE_CANNOT_BE_USED: {
		code: "117",
		detail: "Own reference code cannot be used",
	},
	INVALID_OPERATION: {
		code: "118",
		detail: "Invalid operation",
	},
	MAXIMUM_NOTIFICATION_LIMIT_REACHED: {
		code: "119",
		detail: "Maximum notification limit reached",
	},
	WRONG_EXCHANGE: {
		code: "201",
		detail: "Wrong exchange",
	},
	CONNECTIONS_NOT_EXIST: {
		code: "202",
		detail: "Connections not exist",
	},
	ERROR_FROM_CEX: {
		code: "203",
		detail: "Error from cex",
	},
	NO_OLD_CONNECTIONS: {
		code: "204",
		detail: "No old connections",
	},
	INVALID_API_CREDENTIALS: {
		code: "205",
		detail: "Invalid api credentials",
	},
	MARKET_STRATEGY_NOT_FOUND: {
		code: "401",
		detail: "Market strategy not found",
	},
	STRATEGY_NOT_FOUND: {
		code: "402",
		detail: "Strategy not found",
	},
	MERCHANT_NOT_FOUND: {
		code: "403",
		detail: "Merchant not found",
	},
	PRICE_MUST_BE_IN_RANGE: {
		code: "404",
		detail: "price must be in range",
	},
	MAX_PARITY_COUNT_REACHED: {
		code: "405",
		detail: "max parity count reached",
	},
	MARKET_STRATEGY_NAME_ALREADY_EXISTS: {
		code: "406",
		detail: "market strategy name already exists",
	},
	MARKET_STRATEGY_CREATION_FAILED: {
		code: "407",
		detail: "market strategy creation failed",
	},
	FOLLOWED_STRATEGY_NOT_FOUND: {
		code: "501",
		detail: " followed strategy not found",
	},
	MAX_FOLLOWER_COUNT_REACHED: {
		detail: "max follower count reached",
		code: "502",
	},
	MAX_FOLLOWING_COUNT_BY_PLATFORM_REACHED: {
		detail: "max following count by platform reached",
		code: "503",
	},
	EMAIL_SECURITY_NOT_ACTIVE: {
		code: "601",
		detail: "email security not active",
	},
	SMS_SECURITY_NOT_ACTIVE: {
		code: "602",
		detail: "sms security not active",
	},
	OTP_CODE_FALSE: {
		detail: "otp code false",
		code: "603",
	},
	TOWFA_NOT_SET: {
		detail: "twofa not set",
		code: "604",
	},
	PHONE_NUMBER_NOT_VERIFIED: {
		detail: "Phone number not verified",
		code: "605",
	},
	EMAIL_NOT_VERIFIED: {
		detail: "Email not verified",
		code: "606",
	},
	DEFAULT_COINS_NOT_SET: {
		detail: "default coins not set",
		code: "607",
	},
	CONTACT_INFO_KEY_NOT_FOUND: {
		detail: "contactInfoKey not found",
		code: "608",
	},
	CAMPAIGN_NOT_FOUND: {
		code: "609",
		detail: "campaign not found",
	},
	MAX_CAMPAIGN_ATTENDANCE_COUNT_REACHED: {
		code: "610",
		detail: "max campaign attendance count reached",
	},
	USER_CAMPAIGN_ATTENDANCE_NOT_FOUND: {
		code: "611",
		detail: "user campaign attendance not found",
	},
	USER_CAMPAIGN_ATTENDANCE_CONTROL_ERROR: {
		code: "612",
		detail: "user campaign attendance control error",
	},
	USER_CAMPAIGN_ATTENDANCE_ALREADY_EXISTS: {
		code: "613",
		detail: "user campaign already exists",
	},
	CAMPAIGN_ITERATION_NO_NOT_FOUND: {
		code: "614",
		detail: "campaign iteration no not found",
	},
	USER_NOT_FOUND_IN_LEADERBOARD: {
		code: "615",
		detail: "user not found in leaderboard",
	},
	CONVERSATION_ID_NOT_FOUND: {
		detail: "conversationId not found",
		code: "701",
	},
	INVALID_TOKEN: {
		detail: "invalid token",
		code: "702",
	},
	INVALID_SIGNATURE_OR_KEY: {
		detail: "Invalid signature or key",
		code: "703",
	},
	INSUFFICIENT_BALANCE: {
		detail: "insufficient balance",
		code: "704",
	},
	UNCOMPLETED_WITHDRAWAL_REQUEST: {
		detail: "uncompleted withdrawal request exists",
		code: "705",
	},
	NO_PENDING_WITHDRAWAL_REQUEST: {
		detail: "no pending withdrawal request exists",
		code: "706",
	},
	INVALID_WITHDRAW_AMOUNT: {
		code: "707",
		detail: "invalid withdraw amount",
	},
	COUNTRY_INFORMATION_NOT_FOUND: {
		code: "708",
		detail: "country information not found",
	},
	COUNTRY_IP_REQUIRED: {
		code: "709",
		detail: "country ip required",
	},
	CALLBACK_STATUS_REQUIRED: {
		code: "710",
		detail: "callback status required",
	},
	CALLBACK_TYPE_REQUIRED: {
		code: "711",
		detail: "callback type required",
	},
	CALLBACK_FOREIGN_ID_REQUIRED: {
		code: "712",
		detail: "callback foreignId required",
	},
	BACKTEST_NOT_FOUND: {
		detail: "Backtest not found.",
		code: "801",
	},
	UNCOMPLETED_EXCHANGE_REQUEST: {
		detail: "uncompleted exchange request exists",
		code: "901",
	},
};
