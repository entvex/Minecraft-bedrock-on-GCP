#!/bin/bash

#mount /dev/disk/by-id/google-mc-bedrock-disk /home/minecraft


#Get GCP instance IP
IP=$(curl -H "Metadata-Flavor: Google" http://metadata/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip)

#dir which contains the server directory
#basedir=/home/minecraft/bedrock-server
basedir=/home/entvex/bedrock-server
CLOUDFLARE_ZONE_ID=x
CLOUDFLARE_DNS_RECORD_ID=x

#Update ClouldFlare mcd.davidjensen.dev
curl --location --request PUT 'https://api.cloudflare.com/client/v4/zones/'$CLOUDFLARE_ZONE_ID'/dns_records/'$CLOUDFLARE_DNS_RECORD_ID'' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: __cfduid=de73c7e08a3753ac6b2fc84a838098dd91524036568' \
--data-raw '{"type":"A","name":"mcb.example.com","content":"'$IP'","ttl":120,"proxied":false}'

#tmux session name (`basename \"$basedir\"` -> basedir's name)
session="`basename \"$basedir\"`"

if [[ basedir != */ ]]
then
   basedir+="/"
fi

echo "Starting bedrock server"
tmux new-session -d -s $session

tmux send-keys -t $session:0 "cd $basedir" C-m
tmux send-keys -t $session:0 "LD_LIBRARY_PATH=." C-m
tmux send-keys -t $session:0 "./bedrock_server" C-m

#echo "Server started. Attaching session..."
#
#tmux attach-session -t $session:0