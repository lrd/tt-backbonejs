(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.app = {};

  app.models = {};

  app.collections = {};

  app.views = {};

  app.routers = {};

  app.models.Project = (function(_super) {

    __extends(Project, _super);

    function Project() {
      Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.defaults = {
      name: 'Untitled',
      effort: 0,
      people: 0,
      reason: 'No reason'
    };

    return Project;

  })(Backbone.Model);

  app.collections.Projects = (function(_super) {

    __extends(Projects, _super);

    function Projects() {
      Projects.__super__.constructor.apply(this, arguments);
    }

    Projects.prototype.model = app.models.Project;

    Projects.prototype.url = '/projects';

    return Projects;

  })(Backbone.Collection);

  app.views.ProjectList = (function(_super) {

    __extends(ProjectList, _super);

    function ProjectList() {
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      ProjectList.__super__.constructor.apply(this, arguments);
    }

    ProjectList.prototype.el = '#project-list';

    ProjectList.prototype.initialize = function() {
      console.log(app.projects);
      app.projects.bind('add', this.addOne);
      return app.projects.bind('reset', this.addAll);
    };

    ProjectList.prototype.addOne = function(project) {
      var view;
      view = new app.views.ProjectListItem({
        model: project
      });
      return $(this.el).append(view.render().el);
    };

    ProjectList.prototype.addAll = function(collection) {
      return collection.each(this.addOne);
    };

    ProjectList.prototype.render = function() {
      return this;
    };

    return ProjectList;

  })(Backbone.View);

  app.views.ProjectListItem = (function(_super) {

    __extends(ProjectListItem, _super);

    function ProjectListItem() {
      ProjectListItem.__super__.constructor.apply(this, arguments);
    }

    ProjectListItem.prototype.tagName = 'li';

    ProjectListItem.prototype.render = function() {
      $(this.el).html($("<a href='#view/" + this.model.id + "'>" + (this.model.get('name')) + "</a>"));
      return this;
    };

    return ProjectListItem;

  })(Backbone.View);

  app.views.ProjectDisplay = (function(_super) {

    __extends(ProjectDisplay, _super);

    function ProjectDisplay() {
      ProjectDisplay.__super__.constructor.apply(this, arguments);
    }

    ProjectDisplay.prototype.id = 'project-display';

    ProjectDisplay.prototype.render = function() {
      var template;
      template = ich.project_display(this.model.toJSON());
      $(this.el).html(template);
      return this;
    };

    return ProjectDisplay;

  })(Backbone.View);

  app.routers.Main = (function(_super) {

    __extends(Main, _super);

    function Main() {
      Main.__super__.constructor.apply(this, arguments);
    }

    Main.prototype.routes = {
      'projects': 'projects',
      'view/:id': 'view_project'
    };

    Main.prototype.projects = function() {};

    Main.prototype.view_project = function(id) {
      var projectDisplay;
      projectDisplay = new app.views.ProjectDisplay({
        model: app.projects.get(id)
      });
      return $('.content').html(projectDisplay.render().el);
    };

    return Main;

  })(Backbone.Router);

  $(document).ready(function() {
    app.projects = new app.collections.Projects();
    app.projectListView = new app.views.ProjectList();
    app.router = new app.routers.Main();
    return app.projects.fetch({
      success: function() {
        return Backbone.history.start();
      },
      error: function() {
        return alert('Could not load projects... sorry!');
      }
    });
  });

}).call(this);
