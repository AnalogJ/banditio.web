banditio.web
============

To populate the devtools folder we did the following:

	curl -L -o devtools.tar.gz https://github.com/ChromeDevTools/devtools-frontend/archive/master.tar.gz
	mkdir -p devtools && tar xvfz devtools.tar.gz -C devtools/ --strip-components 1 # && rm devtools.tar.gz
	# cp devtools_overrides/inspector.json devtools/front_end/inspector.json
	# cp devtools_overrides/SupportedCSSProperties.js devtools/front_end/SupportedCSSProperties.js
	
	
	Source code for devtools is from https://github.com/ChromeDevTools/devtools-frontend
	