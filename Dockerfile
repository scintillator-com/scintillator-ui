
###############################################
# TODO: tag-version from repo version
# TODO: where is the NGINX log?
#
# sudo docker build -t local/sci-nginx:1.18 .
# sudo docker run -d --name sci_nginx \
#   --expose 9000 \
#   -p 9000:9000 \
#   local/sci-nginx:1.18
###############################################

FROM nginx:1.18-alpine
COPY build/ /var/www/html/

#TODO
# base nginx file is fine?
# copy in php-fpm config

EXPOSE 80
