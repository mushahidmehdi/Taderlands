const REGEXP_PASSWORD = "^(?=.*[A-Za-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}";
const REGEXP_EMAIL = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}";
const REGEXP_PHONE_NUMBER = "^[+]";

const EXCHANGE_TEXT_MAP = {
	bitmex: "Bitmex",
	binanceTr: "Binance TR",
	huobi: "Huobi",
	ftxTr: "FTX TR",
	dYdX: "dYdX",
	binance: "Binance",
	coinbasePro: "Coinbase Pro",
	ftx: "FTX",
	okx: "OKX",
};

export { EXCHANGE_TEXT_MAP, REGEXP_EMAIL, REGEXP_PASSWORD, REGEXP_PHONE_NUMBER };
