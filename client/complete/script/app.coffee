window.app = {}

app.models = {}
app.collections = {}
app.views = {}
app.routers = {}

class app.models.Project extends Backbone.Model

	defaults:
		name: ''
		effort: 0
		people: 0
		reason: ''

	urlRoot: '/projects'

	validate: (attrs) ->
		errors = []
		
		errors.push('name') if attrs.name.length < 1

		errors.push('effort') if attrs.effort > 10 or attrs.effort < 0

		errors.push('people') if attrs.people < 0

		errors.push('reason') if attrs.reason.length < 1

		return errors unless _.isEmpty(errors)


class app.collections.Projects extends Backbone.Collection

	model: app.models.Project
	url: '/projects'



class app.views.ProjectList extends Backbone.View

	el: '#project-list'

	initialize: ->
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

	initialize: ->
		@model.bind 'change', @render

	render: =>
		$(@el).html $("<a href='#view/#{@model.id}'>#{@model.get('name')}</a>")
		return @



class app.views.ProjectDisplay extends Backbone.View

	id: 'project-display'

	render: ->
		template = ich.project_display(@model.toJSON())
		$(@el).html template
		return @



class app.views.ProjectCreate extends Backbone.View

	id: 'project-create'

	events:
		'submit form': 'create'

	render: ->
		template = ich.project_form _.extend(@model.toJSON(), {submit_text: 'Create'})
		$(@el).html template
		return @

	create: (e) ->
		# stop the form from submitting
		e.preventDefault()

		# save the new values in the model, which will
		# trigger the model validation
		@model.save {
			name: @$('#name').val(),
			effort: @$('#effort').val(),
			people: @$('#people').val(),
			reason: @$('#reason').val()
		}, {
			error: (model, errors) =>
				@$('input').removeClass('error')
				_.each errors, (field) -> @$('#' + field).addClass('error')

			success: (model) ->
				# saved to the server OK, so add it to the collection and view it
				app.projects.add model
				app.router.navigate "view/#{model.id}", true
		}


class app.views.ProjectEdit extends Backbone.View

	id: 'project-edit'

	events:
		'submit form': 'edit'

	render: ->
		template = ich.project_form _.extend(@model.toJSON(), {submit_text: 'Edit'})
		$(@el).html template
		return @

	edit: (e) ->
		e.preventDefault()

		@model.save {
			name: @$('#name').val(),
			effort: @$('#effort').val(),
			people: @$('#people').val(),
			reason: @$('#reason').val()
		}, {
			error: (model, errors) =>
				@$('input').removeClass('error')
				_.each errors, (field) -> @$('#' + field).addClass('error')

			success: (model) ->
				# saved to the server OK, so add it to the collection and view it
				app.router.navigate "view/#{model.id}", true
		}



class app.routers.Main extends Backbone.Router

	routes:
		'projects': 'projects'
		'view/:id': 'view'
		'create': 'create'
		'edit/:id': 'edit'

	projects: ->
		# do whatever

	view: (id) ->
		# show a project
		projectDisplay = new app.views.ProjectDisplay model: app.projects.get(id)
		$('.content').html projectDisplay.render().el

	create: ->
		project = new app.models.Project()
		projectCreate = new app.views.ProjectCreate model: project
		$('.content').html projectCreate.render().el

	edit: (id) ->
		project = app.projects.get(id)
		projectEdit = new app.views.ProjectEdit model: project
		$('.content').html projectEdit.render().el



$(document).ready ->

	app.projects = new app.collections.Projects()

	app.projectListView = new app.views.ProjectList()

	app.router = new app.routers.Main()
	
	app.projects.fetch
		success: (coll, response) ->
			Backbone.history.start()
		error: ->
			console.error 'Could not load projects... sorry!'