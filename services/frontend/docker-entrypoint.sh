#!/bin/sh
set -e

CONFIG_FILE="/src/config.js"

file_env() 
{
    local var="$1"
	eval local argvar=\"\$$1\"
	local def="${2:-}"
	local val="$def"
    if [ -f "$argvar" ]; then
        val=`cat "$argvar"`
		val=${val//$'\r'/}
	elif [ "$var" ]; then
        val="$argvar"
	fi
    
	export "$var"="$val"
	# unset "$fileVar"
}

append_to_file()
{
	file_env $1

	mkdir -p `dirname "$2"`

	eval local argvar=\"\$$1\"
	echo -e "window.env.$1=\"$argvar\";" >> $2

	unset "$1"
}

append_to_file "REACT_APP_API_ROOT" $CONFIG_FILE
append_to_file "REACT_APP_WS_ROOT" $CONFIG_FILE
append_to_file "REACT_APP_CDN_ROOT" $CONFIG_FILE
append_to_file "REACT_APP_LANDING_ROOT" $CONFIG_FILE
append_to_file "REACT_APP_INTERCOM_APP_ID" $CONFIG_FILE
append_to_file "REACT_APP_NODE_ENV" $CONFIG_FILE
append_to_file "REACT_APP_GTAG_ID" $CONFIG_FILE
append_to_file "REACT_APP_CAPTCHA_KEY" $CONFIG_FILE

exec "$@"