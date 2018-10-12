#!/usr/bin/env bash

## codeship continuous deployment script
##
## sets up environment, compiles assets, commits them, and pushes to remote git
## repo.


### BEGIN: boilerplate bash

# get full path to current script/file
# http://stackoverflow.com/questions/4774054/reliable-way-for-a-bash-script-to-get-the-full-path-to-itself#comment15185627_4774063
SCRIPT_PATH=$( cd $(dirname $0) ; pwd -P )
SCRIPT_NAME=`basename ${BASH_SOURCE[0]}`

# stop execution if anything fails and exit with non-zero status
set -o errexit # -e
trap "{ echo -e \"\nError: Something went wrong in $SCRIPT_NAME.\">&2; exit 1; }" ERR

# allow DEBUG env variable to trigger simple bash debugging when it is set to
# anything but 'false'
if [ ${DEBUG:=false} != 'false' ] ; then
  set -o verbose # -v
  set -o xtrace  # -x
fi

# allow VERBOSE env variable to control verbosity on individual commands we run.
VERBOSE_ARG=""
DEBUG_ARG=""
if [ ${VERBOSE:=false} != 'false' ] ; then
  VERBOSE_ARG="-v"
  DEBUG_ARG="--debug"
fi

### END: boilerplate bash

# define the codebase root for all scripts. part of standard codeship setup.
#
# FIXME: codeship provides this via their 'cs p' command. the dir could in
# theory change, so it should not really be hardcoded.
export PROJECT_ROOT="$HOME/clone"

# cd clone
# git clone git@github.com:UI-Research/greaterdc-data-explorer.git
# git pull origin stg

git clone git@github.com:UI-Research/greaterdc-map-data.git
git pull origin stg

# nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get update && apt-get install -y nodejs

mv greaterdc-map-data ../data

# npm
#npm install

#yarn
#curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
#echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
# sudo apt-get update && sudo apt-get install yarn

cd ../
yarn build


### Log deployment details. Keeping one at a time, so delete previous.

if [ -f DEPLOYMENT.txt ]; then
    rm -rf DEPLOYMENT.txt
fi

touch DEPLOYMENT.txt

echo "CI Build: $CI_BUILD_NUMBER
Branch: $CI_BRANCH
Commit: $CI_COMMIT_ID
Committed by: $CI_COMMITTER_NAME
Commit msg: $CI_MESSAGE
" > DEPLOYMENT.txt

# Rsync our files to the server
# rsync -avz --exclude '.git' -e "$SETTING"  $PROJECT_ROOT/ $DESTINATION/


# $SSH 'sudo service nginx restart && sudo service uwsgi restart'
