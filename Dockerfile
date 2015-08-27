FROM node

WORKDIR /srv/banditio.web
#older(current chrome version)
#ADD https://chromium.googlesource.com/chromium/blink/+archive/9c1f3db8fdeaaf3e74f5dc0f6e71cba556569ad2/Source/devtools.tar.gz /srv/banditio.web/devtools.tar.gz

#latest
ADD https://chromium.googlesource.com/chromium/blink/+archive/a4b68620673f48b35b2ba34bed3ccf39032d9132/Source/devtools.tar.gz /srv/banditio.web/devtools.tar.gz
RUN mkdir devtools && tar xvfz devtools.tar.gz -C devtools && rm devtools.tar.gz

WORKDIR /srv/banditio.web/devtools
RUN python scripts/CodeGeneratorFrontend.py protocol.json --output_js_dir front_end/
ADD ./devtools_overrides/inspector.json front_end/inspector.json
ADD ./devtools_overrides/SupportedCSSProperties.js front_end/SupportedCSSProperties.js

WORKDIR /srv/banditio.web/
ADD . /srv/banditio.web
RUN npm install

EXPOSE 4000

# Default command
CMD ["node", "app.js"]
#CMD ["/usr/bin/supervisord"]
#CMD ["bash"]