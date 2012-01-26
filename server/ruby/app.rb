require 'rubygems'
require 'sinatra'
require 'json'
require 'active_record'

ActiveRecord::Base.establish_connection(
  :adapter => 'sqlite3',
  :database => 'app.db'
)

ActiveRecord::Base.include_root_in_json = false

class Project < ActiveRecord::Base
end

puts Project.all.to_json

get '/' do
  File.read File.join('public', 'basic/index.html')
end

get "/projects" do
  content_type :json
  Project.all.to_json
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
