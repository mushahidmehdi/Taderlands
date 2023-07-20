import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useSnackbar } from "notistack";

import { PageCenteredProgress } from "components";

import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import OtpDialog from "./OtpDialog";
import PasswordDialog from "./PasswordDialog";
import SuccessDialog from "./SuccessDialog";

export default function Protection({
	children,
	open: initialOpen,
	title,
	explanation,
	operation,
	onComplete,
	onPasswordNext: onPasswordNextInitial,
	onClose,
	sendOtp,
	otpAction,
	success,
}) {
	const { profile } = useSelector((state) => state.user);

	const [processing, setProcessing] = useState(false);
	const [open, setOpen] = useState({ password: initialOpen, otp: false, success: false });
	const [transactionId, setTransactionId] = useState();

	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("common");

	const { startTransaction } = useUserApi();
	const catchError = useCatchError();

	const onPasswordNext = (password) => {
		(onPasswordNextInitial ? onPasswordNextInitial(operation, password) : startTransaction(operation, password))
			.then((data) => {
				if (!data.data?.transactionId) {
					enqueueSnackbar(t("Bir hata ile karşılaşıldı"), { variant: "error" });
					return;
				}

				setTransactionId(data.data?.transactionId);

				setOpen({ password: false, otp: true });
			})
			.catch(catchError);
	};

	const onOtpNext = ({ emailCode, twofaCode, smsCode }) => {
		const { emailSecurityActive, twofaSecurityActive, smsSecurityActive } = profile?.userSecuritySetting;

		if (emailSecurityActive && !emailCode) {
			enqueueSnackbar(t("otp_email_empty"), { variant: "error" });
			return;
		}

		if (twofaSecurityActive && !twofaCode) {
			enqueueSnackbar(t("otp_2fa_empty"), { variant: "error" });
			return;
		}

		if (smsSecurityActive && !smsCode) {
			enqueueSnackbar(t("otp_sms_empty"), { variant: "error" });
			return;
		}

		setProcessing(true);

		otpAction(
			operation,
			{
				...operation?.body,
				...(emailSecurityActive && { emailCode }),
				...(twofaSecurityActive && { twofaCode }),
				...(smsSecurityActive && { smsCode }),
			},
			transactionId
		)
			.then((_) => {
				setOpen({ success: true });
			})
			.catch(catchError)
			.finally(() => {
				setProcessing(false);
			});
	};

	return (
		<>
			{processing && <PageCenteredProgress />}
			<PasswordDialog
				open={open?.password}
				onClose={() => {
					setOpen();
					onClose();
				}}
				onNext={onPasswordNext}
			/>
			<OtpDialog
				transactionId={transactionId}
				open={open?.otp}
				onClose={() => {
					setOpen();
					onClose();
				}}
				settings={{
					...profile?.userSecuritySetting,
					...(operation?.path === "/security-settings" && operation?.body?.smsSecurityActive
						? {
								smsSecurityActive: true,
						  }
						: {}),
					...(operation?.path === "/security-settings" && operation?.body?.emailSecurityActive
						? { emailSecurityActive: true }
						: {}),
				}}
				sendOtp={sendOtp}
				title={title}
				explanation={explanation}
				otpAction={otpAction}
				onNext={onOtpNext}
			/>
			{open?.success && (
				<SuccessDialog
					open={open?.success}
					onClose={() => {
						setOpen();
						onComplete();
					}}
					icon={success?.icon}
					title={success?.title}
					content={success?.content}
				/>
			)}
			{children}
		</>
	);
}
