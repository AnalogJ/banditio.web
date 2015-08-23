# Web Basic Design
- www.bandit.io
- static?
- By default, debug sessions will only last 15 minutes max.  (cloud code?)
- By default, session data will only be stored for 24 hours. (cloud code?)
- Session is started on the banditio web site (cloud code?)
- Container is spun up in Trition  (cloud code?)
- DNS entry is added? (cloud code?)

# Inspector Backend Design
- AYE1UK3S3K7XMG11S3922-inspector.bandit.io
- Must be chrome remote debugger protocol compatible
- /json page for listing the currently inspected pages
- websocket server for communicating over the Chrome Remote Debugger Protocol
- will retrieve data from Database (Parse.com)


# Proxy/Socks Server
- AYE1UK3S3K7XMG11S3922-proxy.bandit.io
- AYE1UK3S3K7XMG11S3922-socks.bandit.io
- Each Banditio session gets its own dedicated proxy server (on startup can choose socks or http proxy)
- Will upload data to Database(Parse.com) in a HAR compatible format (can be easily converted to HAR if needed)
