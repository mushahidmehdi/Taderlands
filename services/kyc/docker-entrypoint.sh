#!/bin/sh
set -e

CONFIG_FILE_0="/build/config.js"
CONFIG_FILE_1="/build/techsign-web-card-detection/assets/js/window.js"
CONFIG_FILE_2="/build/techsign-web-face-api/assets/js/window.js"

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

append_to_file "REACT_APP_FRONTEND_ROOT" $CONFIG_FILE_0
append_to_file "REACT_APP_FRONTEND_ROOT" $CONFIG_FILE_1
append_to_file "REACT_APP_FRONTEND_ROOT" $CONFIG_FILE_2
append_to_file "REACT_APP_API_ROOT" $CONFIG_FILE_0
append_to_file "REACT_APP_API_ROOT" $CONFIG_FILE_1
append_to_file "REACT_APP_API_ROOT" $CONFIG_FILE_2

exec "$@"