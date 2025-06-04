#! /bin/bash

PEM_FILE_PATH="../Apple-Avocado.pem"
HOST_IP="54.153.128.246"

rm -rf build kronathens
npm run build
mv build kronathens

ssh -i $PEM_FILE_PATH ubuntu@$HOST_IP "sudo mkdir -p /var/www/ && sudo chown ubuntu:ubuntu /var/www/"
scp -i $PEM_FILE_PATH -r kronathens/ ubuntu@$HOST_IP:/var/www/

rm -rf kronathens