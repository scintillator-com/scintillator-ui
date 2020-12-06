
FROM nginx:1.18-alpine
COPY build/ /var/www/html/

#TODO
# base nginx file is fine?
# copy in php-fpm config

