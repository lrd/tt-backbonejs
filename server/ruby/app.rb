require 'rubygems'
require 'sinatra'
require 'json'
require 'memcache'

# memcached -p 11211 &
# curl -v -d @d localhost:4567
# where d is a file :
# {
# "id": 6,
# "name": "Take over the world",
# "effort": 5,
# "people": 5000,
# "reason": "Bored on a Sunday afternoon"
# }
#
cache = MemCache.new(["localhost:11211"])

get "/" do
  content_type :json
  cache.get('projects').to_json
end

get "/:id" do
  content_type :json
  proj = cache.get( 'projects' ).find{ |i| i["id"] == params[:id].to_i }
  if proj.nil?
    404
  else
    proj.to_json
  end
end

put "/:id/?" do
end

post "/?" do
  content_type :json
  request.body.rewind
  attrs = JSON.parse(request.body.read)
  proj = cache.get('projects')
  if proj.nil?
    proj = [attrs]
  else
    proj = proj + [attrs]
  end
  cache.set( 'projects', proj )
  status 201
end
