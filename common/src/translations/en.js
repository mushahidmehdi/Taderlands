module.exports = {
	register: {
		subject: `Traderlands || Verification Code {{otpCode}}`,
		body: `Hi,<br>
        <br>
        There is only one step left to complete your sign-up. We need you to copy the 6 digits code given below and submit them on Traderlands page.
        <br>
        <br>
        Please use this code to complete your sign-up
        <br>
        {{otpCode}}
        <br>
        <br>
        your verification code will be expired after 2 hours
        <br>
        <br>
        Thank you,
        <br>
        Traderlands
    `,
		smsBody: `
Hi,
There is only one step left to complete your sign-up. We need you to copy the 6 digits code given below and submit them on Traderlands page.
Please use this code to complete your sign-up {{otpCode}} .Your verification code will be expired after 2 hours
Thank you
Traderlands`,
	},

	login: {
		subject: `Traderlands || Verification Code {{otpCode}}`,
		body: `Hi,
        <br>
        <br>
        Please use this code to login:
        <br>
        {{otpCode}}
        <br>
        <br>
        Your verification code will be expired in 120 minutes.
        <br>
        <br>
        Thank you,
        <br>
        Traderlands
        `,
		smsBody: `
Hi,
Please use this code to login: {{otpCode}}
Your verification code will be expired in 120 minutes.
Thank you,
Traderlands
        `,
	},

	operation: {
		subject: `Traderlands || Verification Code {{otpCode}}`,
		body: `Hi,
        <br>
        <br>
        Please use this code to proceed:
        <br>
        {{otpCode}}
        <br>
        <br>
        your verification code will be expired in 120 minutes
        <br>
        <br>
        Thank you,
        <br>
        Traderlands
        `,
		smsBody: `Hi, 
        Please use this code to proceed: {{otpCode}}.Your verification code will be expired in 120 minutes
        Thank you,
        Traderlands `,
	},

	resetPassword: {
		subject: `Traderlands || Reset Your Password {{otpCode}}`,
		body: `Hi,
        <br>
        <br>
        Please use this code to reset your password:
        <br>
        {{otpCode}}
        <br>
        <br>
        your verification code will be expired in 120 minutes
        <br>
        <br>
        Thank you,
        <br>
        Traderlands
        `,
		smsBody: `
Hi, 
Please use this code to reset your password: {{otpCode}} .Your verification code will be expired in 120 minutes.

Thank you,
Traderlands`,
	},

	contactInfoKey: {
		subject: `Traderlands || Verification Code {{otpCode}}`,
		body: `Hi,
        <br>
        <br>
        Please use this code to proceed:
        <br>
        {{otpCode}}
        <br>
        <br>
        your verification code will be expired in 120 minutes
        <br>
        <br>
        Thank you,
        <br>
        Traderlands
        `,
		smsBody: `
Hi, 
Please use this code to proceed: {{otpCode}} .Your verification code will be expired in 120 minutes.

Thank you,
Traderlands
    `,
	},

	otpDeposit: {
		subject: `Traderlands || Verification Code {{otpCode}}`,
		body: `Hi,
        <br>
        <br>
        Please use this code to proceed:
        <br>
        {{otpCode}}
        <br>
        <br>
        your verification code will be expired in 120 minutes
        <br>
        <br>
        Thank you,
        <br>
        Traderlands
        `,
		smsBody: `
Hi, 
Please use this code to proceed: {{otpCode}}.Your verification code will be expired in 120 minutes
Thank you,
Traderlands`,
	},

	tradingServicesErrorLog: {
		reason: {
			"500": "Unknown Error",
			"500x": "Unknown Error",
			"5000": "Invalid API",
			"5001": "Insufficient Balance",
			"5002": "Insufficient Position Balance",
			"5003": "Minimum Position Size Error",
			"5004": "User Doesn't Exist on the Exchange",
			"5005": "Order Doesn't Exist on the Exchange",
			"5006": "No Position on Parity",
			"5007": "There is an Open Position on the Exchange Already",
			"5008": "Order Couldn't Fetch",
			"5009": "Invalid Passphrase",
			"5010": "Unauthorized",
			"5011": "Invalid Symbol",
			"5012": "Invalid Side",
			"5013": "Invalid Position Side",
			"5014": "",
			"5015": "Invalid Signature",
			"5016": "Order Status Error",
			"5017": "Wrong Order",
			"5018": "Insufficient Credits",
			"5019": "Open Orders Already",
			"5999": "Exchange Not Available",
			"6000": "Concurrent Positions Limit Exceeded",
			"6001": "Pair Doesn't Exist On Portfolio",
			"6002": "Robot is Tracking Status",
			"6003": "Robot is Stopped",
			"6004": "Position Settings are Wrong",
			"6005": "Account's Position Limit Exceeded",
			"6006": "",
			"6007": "There is an Open Position on Traderlands Already",
			"6008": "There is not any Open Positions on Pair",
			"6009": "API Connection Error",
			"6010": "You have unsubscribed the strategy",
		},
		comment: {
			"500": "",
			"500x": "",
			"5000": "Edit API Restrictions",
			"5001": "Edit Exchange Balances",
			"5002": "Adjust Your Position Size",
			"5003": "Adjust Your Budget Settings",
			"5004": "Edit Your API Information",
			"5005": "",
			"5006": "",
			"5007": "Control Your Positions",
			"5008": "",
			"5009": "Edit Your API Information",
			"5010": "Edit API Restrictions",
			"5011": "",
			"5012": "",
			"5013": "",
			"5014": "",
			"5015": "",
			"5016": "",
			"5017": "",
			"5018": "Please Deposit Credits",
			"5019": "Please Control Your Open Orders",
			"5999": "",
			"6000": "Control Your Budget Settings",
			"6001": "Control Your Portfolio Settings",
			"6002": "",
			"6003": "",
			"6004": "Control Your Position Settings",
			"6005": "",
			"6006": "",
			"6007": "",
			"6008": "",
			"6009": "Control Your API Connection",
			"6010": "",
		},
	},
};
