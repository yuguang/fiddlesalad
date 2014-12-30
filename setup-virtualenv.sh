#!/usr/bin/env bash

VERSION=1.9.1
VIRTUALENV="virtualenv-${VERSION}.tar.gz"

read -r -d '' HELP <<EOF
Usage: setup-virtualenv.sh [options]
Setup a local python environment with virtualenv, and install all
DataMill dependencies. Optionally install only the dependencies with
the existing virtualenv.

    Options:
    -h,--help         Print this help documentation.
    -d,--only-deps    Only install dependencies, not virtualenv.
EOF

# Execute getopt
ARGS=`getopt -o "dh" -l "only-deps,help" \
      -n "setup-virtualenv.sh" -- "$@"`
 
#Bad arguments
if [ $? -ne 0 ];
then
  exit 1
fi
 
eval set -- "$ARGS"
 
while true;
do
  case "$1" in
    -h|--help)
      echo "$HELP"
      exit 0
      shift;;
 
    -d|--only-deps)
      echo "Only installing deps, assuming working virtualenv"
      ONLYDEPS=true
      shift;;

    --)
      shift
      break;;
  esac
done

# Non PYPI install functions
function install_cloud_ide() {

    git clone git://github.com/yuguang/django-cloud-ide.git
    pushd django-cloud-ide > /dev/null
    ../dev-python/bin/python setup.py install
    popd > /dev/null
    rm -rf django-cloud-ide
}

# Install Virtualenv in local directory

if [ -z "$ONLYDEPS" ]; then

    echo "Installing virtualenv in $(pwd)"

    curl -O https://pypi.python.org/packages/source/v/virtualenv/"$VIRTUALENV"
    tar xavf "$VIRTUALENV"
    pushd "${VIRTUALENV%%.tar.gz}" > /dev/null
    python2 virtualenv.py --no-site-packages ../dev-python
    popd > /dev/null

    rm -r "${VIRTUALENV%%.tar.gz}"
    rm "${VIRTUALENV}"

fi

# Install all pypi dependencies
echo "Installing PYPI packages"

if ! dev-python/bin/pip install -r requirements.txt; then
    echo "Pip command failed." 1>&2
    exit 1
fi

# Install dependencies not in pypi
echo "Installing packages not in PYPI"

install_cloud_ide;
