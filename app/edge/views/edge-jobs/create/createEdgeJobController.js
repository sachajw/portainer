function CreateEdgeJobController($q, $scope, $state, Notifications, EndpointService, GroupService, EdgeJobService, TagService) {
  $scope.state = {
    actionInProgress: false,
  };

  $scope.create = create;

  function create(method) {
    const model = $scope.model;

    $scope.state.actionInProgress = true;
    createEdgeJob(method, model)
      .then(function success() {
        Notifications.success('Edge job successfully created');
        $state.go('edge.jobs', {}, { reload: true });
      })
      .catch(function error(err) {
        Notifications.error('Failure', err, 'Unable to create Edge job');
      })
      .finally(function final() {
        $scope.state.actionInProgress = false;
      });
  }

  function createEdgeJob(method, model) {
    if (method === 'editor') {
      return EdgeJobService.createEdgeJobFromFileContent(model);
    }
    return EdgeJobService.createEdgeJobFromFileUpload(model);
  }

  function initView() {
    $scope.model = {
      Name: '',
      Recurring: false,
      CronExpression: '',
      Endpoints: [],
      FileContent: '',
      File: null,
    };

    $q.all({
      groups: GroupService.groups(),
      tags: TagService.tags(),
    })
      .then(function success(data) {
        $scope.groups = data.groups;
        $scope.tags = data.tags;
      })
      .catch(function error(err) {
        Notifications.error('Failure', err, 'Unable to retrieve endpoint list');
      });
  }

  initView();
}

angular.module('portainer.edge').controller('CreateEdgeJobController', CreateEdgeJobController);
