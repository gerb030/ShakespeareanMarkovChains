FROM nginx
ADD ./client/autocorrect_js/ /usr/share/nginx/html
WORKDIR ./client/autocorrect_js