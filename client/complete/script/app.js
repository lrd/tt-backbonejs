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
      name: '',
      effort: 0,
      people: 0,
      reason: ''
    };

    Project.prototype.urlRoot = '/projects';

    Project.prototype.validate = function(attrs) {
      var errors;
      errors = [];
      if (attrs.name.length < 1) errors.push('name');
      if (attrs.effort > 10 || attrs.effort < 0) errors.push('effort');
      if (attrs.people < 0) errors.push('people');
      if (attrs.reason.length < 1) errors.push('reason');
      if (!_.isEmpty(errors)) return errors;
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
      this.render = __bind(this.render, this);
      ProjectListItem.__super__.constructor.apply(this, arguments);
    }

    ProjectListItem.prototype.tagName = 'li';

    ProjectListItem.prototype.initialize = function() {
      return this.model.bind('change', this.render);
    };

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

  app.views.ProjectCreate = (function(_super) {

    __extends(ProjectCreate, _super);

    function ProjectCreate() {
      ProjectCreate.__super__.constructor.apply(this, arguments);
    }

    ProjectCreate.prototype.id = 'project-create';

    ProjectCreate.prototype.events = {
      'submit form': 'create'
    };

    ProjectCreate.prototype.render = function() {
      var template;
      template = ich.project_form(_.extend(this.model.toJSON(), {
        submit_text: 'Create'
      }));
      $(this.el).html(template);
      return this;
    };

    ProjectCreate.prototype.create = function(e) {
      var _this = this;
      e.preventDefault();
      return this.model.save({
        name: this.$('#name').val(),
        effort: this.$('#effort').val(),
        people: this.$('#people').val(),
        reason: this.$('#reason').val()
      }, {
        error: function(model, errors) {
          _this.$('input').removeClass('error');
          return _.each(errors, function(field) {
            return this.$('#' + field).addClass('error');
          });
        },
        success: function(model) {
          app.projects.add(model);
          return app.router.navigate("view/" + model.id, true);
        }
      });
    };

    return ProjectCreate;

  })(Backbone.View);

  app.views.ProjectEdit = (function(_super) {

    __extends(ProjectEdit, _super);

    function ProjectEdit() {
      ProjectEdit.__super__.constructor.apply(this, arguments);
    }

    ProjectEdit.prototype.id = 'project-edit';

    ProjectEdit.prototype.events = {
      'submit form': 'edit'
    };

    ProjectEdit.prototype.render = function() {
      var template;
      template = ich.project_form(_.extend(this.model.toJSON(), {
        submit_text: 'Edit'
      }));
      $(this.el).html(template);
      return this;
    };

    ProjectEdit.prototype.edit = function(e) {
      var _this = this;
      e.preventDefault();
      return this.model.save({
        name: this.$('#name').val(),
        effort: this.$('#effort').val(),
        people: this.$('#people').val(),
        reason: this.$('#reason').val()
      }, {
        error: function(model, errors) {
          _this.$('input').removeClass('error');
          return _.each(errors, function(field) {
            return this.$('#' + field).addClass('error');
          });
        },
        success: function(model) {
          return app.router.navigate("view/" + model.id, true);
        }
      });
    };

    return ProjectEdit;

  })(Backbone.View);

  app.routers.Main = (function(_super) {

    __extends(Main, _super);

    function Main() {
      Main.__super__.constructor.apply(this, arguments);
    }

    Main.prototype.routes = {
      'projects': 'projects',
      'view/:id': 'view',
      'create': 'create',
      'edit/:id': 'edit'
    };

    Main.prototype.projects = function() {};

    Main.prototype.view = function(id) {
      var projectDisplay;
      projectDisplay = new app.views.ProjectDisplay({
        model: app.projects.get(id)
      });
      return $('.content').html(projectDisplay.render().el);
    };

    Main.prototype.create = function() {
      var project, projectCreate;
      project = new app.models.Project();
      projectCreate = new app.views.ProjectCreate({
        model: project
      });
      return $('.content').html(projectCreate.render().el);
    };

    Main.prototype.edit = function(id) {
      var project, projectEdit;
      project = app.projects.get(id);
      projectEdit = new app.views.ProjectEdit({
        model: project
      });
      return $('.content').html(projectEdit.render().el);
    };

    return Main;

  })(Backbone.Router);

  $(document).ready(function() {
    app.projects = new app.collections.Projects();
    app.projectListView = new app.views.ProjectList();
    app.router = new app.routers.Main();
    return app.projects.fetch({
      success: function(coll, response) {
        return Backbone.history.start();
      },
      error: function() {
        return console.error('Could not load projects... sorry!');
      }
    });
  });

}).call(this);
