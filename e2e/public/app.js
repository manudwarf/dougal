(function () {
  'use strict';

  angular.module('dougal.e2e', ['dougal', 'ngRoute'])
    .config(setupRoutes)
    .filter('gender', genderFilter)
    .factory('Employee', employeeFactory)
    .controller('EmployeeController', EmployeeController)
    .controller('ListController', ListController)
    .component('employeeList', {
      templateUrl: 'list.html',
      controller: 'ListController',
      controllerAs: '$ctrl'
    })
    .component('employeeDetails', {
      templateUrl: 'form.html',
      controller: 'EmployeeController',
      controllerAs: '$ctrl'
    });

  function setupRoutes($routeProvider) {
    $routeProvider.when('/', {
      template: '<employee-list></employee-list>'
    });
    $routeProvider.when('/create', {
      template: '<employee-details></employee-details>'
    });
    $routeProvider.when('/:id', {
      template: '<employee-details></employee-details>'
    });
  }

  function employeeFactory(Dougal) {
    function Employee() {
      this.urlRoot = '/api/employees';

      this.attribute('id');
      this.attribute('name');
      this.attribute('gender');
      this.attribute('createdAt', 'date');
      this.attribute('updatedAt', 'date');

      this.validates('name', {presence: true, message: 'Name is required'});
      this.validates('gender', {presence: true, message: 'Gender is required'});
    }

    return Dougal.Model.extends(Employee);
  }

  function ListController(Employee) {
    this.filters = {};

    this.delete = function (employee) {
      employee.delete()
        .then(() => this.load());
    };

    this.load = function () {
      Employee.where(_.omitBy(this.filters, _.isEmpty))
        .then(employees => {
          this.employees = employees
        });
    };

    this.load();
  }

  function EmployeeController($routeParams, Employee) {
    this.employee = new Employee();
    if ($routeParams.id) {
      this.employee.id = $routeParams.id;
      this.employee.fetch();
    }

    this.canSubmit = () => {
      return this.employee.isValid() && this.employee.hasChanged();
    };

    this.hasError = (field) => {
      return this.employee.hasChanged(field) && _.some(this.employee.errors[field]);
    };

    this.save = () => {
      this.employee.save();
    };
  }

  function genderFilter() {
    return function (gender) {
      switch (gender) {
        case 'F': return 'Female';
        case 'M': return 'Male';
        default: return '';
      }
    };
  }

})();
