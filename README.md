banditio.web
============

To populate the devtools folder we did the following:

	curl -o devtools.tar.gz https://chromium.googlesource.com/chromium/blink/+archive/a4b68620673f48b35b2ba34bed3ccf39032d9132/Source/devtools.tar.gz
	mkdir devtools && tar xvfz devtools.tar.gz -C devtools && rm devtools.tar.gz
	pushd devtools && python scripts/CodeGeneratorFrontend.py protocol.json --output_js_dir front_end/ && popd
	cp devtools_overrides/inspector.json devtools/front_end/inspector.json
	cp devtools_overrides/SupportedCSSProperties.js devtools/front_end/SupportedCSSProperties.js