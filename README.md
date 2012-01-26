Backbone.js and Coffee Script example
=====================================

To run this example you'll need:

* Ruby (>= 1.8.7)
* Ruby gems:
 * activerecord (`gem install activerecord`)
 * sinatra (`gem install sinatra`)
 * json (`gem install json`)
 * sqlite3 (`gem install sqlite3`)

If you want to compile the .coffee files yourself, you'll need

* NodeJS and npm
 * coffee-script (`npm install -g coffee-script`)

Then you can use `coffee -wc app.coffee` to watch and compile the coffee file into javascript whenever it changes.

The Ruby server is in /server/ruby. You'll need to create a symlink in here that links ./public to /client/, e.g. `ln -s ./public ../../client` from the /server/ruby directory. This will let sinatra serve up the static files.

Once you've got the ruby server running, just go to `http://localhost:4567/complete/index.html`

If you have any trouble getting it running, feel free to ask!