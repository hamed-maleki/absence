

angular.module('finance3', [])
.factory('currencyConverter', ['$http','$rootScope', function($http,$rootScope) {
  return {
      call:function() {
        setTimeout(function(){
          $rootScope.$broadcast('loadPersonnel', {
            data: ''
          });
        },100)
      },
      setSearch:function(data) {
        // console.log(data);
        setTimeout(function(){
          $rootScope.$broadcast('searchPersonnel', {
            data: data
          });
        },100)
      }
  };
}]);

