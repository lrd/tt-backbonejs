window.app = {}

app.models = {}
app.collections = {}
app.views = {}
app.routers = {}

class app.models.Project extends Backbone.Model

	defaults:
		name: 'Untitled'
		effort: 0
		people: 0
		reason: 'No reason'



class app.collections.Projects extends Backbone.Collection

	model: app.models.Project
	url: '/projects'



class app.views.ProjectList extends Backbone.View

	el: '#project-list'

	initialize: ->
		console.log app.projects
		app.projects.bind 'add', @addOne
		app.projects.bind 'reset', @addAll

	addOne: (project) =>
		view = new app.views.ProjectListItem model: project
		$(@el).append view.render().el

	addAll: (collection) =>
		collection.each @addOne

	render: ->
		return @



class app.views.ProjectListItem extends Backbone.View

	tagName: 'li'

	render: ->
		$(@el).html $("<a href='#view/#{@model.id}'>#{@model.get('name')}</a>")
		return @



class app.views.ProjectDisplay extends Backbone.View

	id: 'project-display'

	render: ->
		template = ich.project_display(@model.toJSON())
		$(@el).html template
		return @



class app.routers.Main extends Backbone.Router

	routes:
		'projects': 'projects'
		'view/:id': 'view_project'

	projects: ->
		# do whatever

	view_project: (id) ->
		# show a project
		projectDisplay = new app.views.ProjectDisplay model: app.projects.get(id)
		$('.content').html projectDisplay.render().el



$(document).ready ->

	app.projects = new app.collections.Projects()

	app.projectListView = new app.views.ProjectList()

	app.router = new app.routers.Main()

	app.projects.fetch
		success: ->
			Backbone.history.start()
		error: ->
			alert 'Could not load projects... sorry!'