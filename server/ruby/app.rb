require 'rubygems'
require 'sinatra'
require 'json'
require 'memcache'
require 'active_record'

ActiveRecord::Base.establish_connection(
  :adapter => 'sqlite3',
  :database => 'app.db'
)

ActiveRecord::Base.include_root_in_json = false

class Project < ActiveRecord::Base
end

puts Project.all.to_json

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
# curl -v -X DELETE localhost:4567/6
# curl -v localhost:4567/6
# curl -v localhost:4567/
cache = MemCache.new(["localhost:11211"])

get '/' do
  File.read File.join('public', 'basic/index.html')
end

get "/projects" do
  content_type :json
  Project.all.to_json
end

get "/projects/:id" do
  content_type :json
  proj = cache.get( 'projects' ).find{ |i| i["id"] == params[:id].to_i }
  if proj.nil?
    404
  else
    proj.to_json
  end
end

delete "/projects/:id" do
  content_type :json
  proj = cache.get('projects')
  proj.delete_if{ |i| i["id"] == params[:id].to_i }
  cache.set( 'projects', proj )
  200
end

put "/projects/:id/?" do
  content_type :json
  request.body.rewind
  data = JSON.parse(request.body.read)
  p = Project.find(params[:id])
  if p.update_attributes(data)
    p.to_json
  else
    400
  end
end

post "/projects/?" do
  content_type :json
  request.body.rewind
  data = JSON.parse(request.body.read)
  p = Project.new(data)
  if p.save
    p.to_json
  else
    400
  end
end
