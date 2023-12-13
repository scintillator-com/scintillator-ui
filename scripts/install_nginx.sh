#!/bin/bash

# Infrastructure
sudo yum update -y
sudo amazon-linux-extras enable nginx1
sudo yum clean metadata
sudo yum install -y git nginx


## Configure NGINX
# This section intentionally left blank


# NGINX: Enable
echo "Enable nginx.service..."
sudo systemctl enable nginx.service


# NGINX: permissions
echo "Securing /usr/share/nginx/html/..."
sudo chown -R nginx:nginx /usr/share/nginx/html/
sudo chmod -R ug=rX /usr/share/nginx/html/
sudo chmod -R o=-rwx /usr/share/nginx/html/
