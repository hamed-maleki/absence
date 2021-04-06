var app = angular.module('customService', []);
app.factory('requests', ['$http', function ($http) {
    return {
        postingData: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            var header = {
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    'Content-Type': "application/json; charset = utf-8"
                }
            }
            $http.post(path + url, data, header)
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (xhr) {
                    if (xhr.status == 401) {
                        // $scope.Refresh(url, data, 3, callback)
                    }
                    else if (xhr.status == 404) {
                        callback(xhr.statusText);
                    }
                    else if (xhr.status == 500) {
                        xhr.statusText = "Not Found";
                        callback(xhr.statusText)
                    }
                    else {
                        callback("Error")
                    }
                })
        },
        puttingData: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            var header = {
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    'Content-Type': "application/json; charset = utf-8"
                }
            }
            $http.put(path + url, data, header)
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (xhr) {
                    if (xhr.status == 401) {
                        // $scope.Refresh(url, data, 3, callback)
                    }
                    else if (xhr.status == 404) {
                        callback(xhr.statusText);
                    }
                    else if (xhr.status == 500) {
                        xhr.statusText = "Not Found";
                        callback(xhr.statusText)
                    }
                    else {
                        callback("Error")
                    }
                })
        },
        gettingData: function (url, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            var header = {
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    'Content-Type': "application/json; charset = utf-8"
                }
            }
            $http.get(path + url, header)
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (xhr) {
                    if (xhr.status == 401) {
                        // $scope.Refresh(url, data, 3, callback)
                    }
                    else if (xhr.status == 404) {
                        callback(xhr.statusText);
                    }
                    else if (xhr.status == 500) {
                        xhr.statusText = "Not Found";
                        callback(xhr.statusText)
                    }
                    else {
                        callback("Error")
                    }
                })
        },
        deleteing: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            var header = {
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    'Content-Type': "application/json; charset = utf-8"
                }
            }
            $http.delete(path + url, { data: data, headers: header })
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (xhr) {
                    if (xhr.status == 401) {
                        $scope.Refresh(url, data, 4, callback)
                    }
                })
        },

        deleteingJson: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            var header = {
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    'Accept': 'application/vnd.hal+json',
                    'Content-Type': "application/json;"
                }
            }
            $http.delete(path + url, { data: data, headers: header })
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (xhr) {
                    if (xhr.status == 401) {
                        $scope.Refresh(url, data, 4, callback)
                    }
                })
        },
        updating: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            var header = {
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    'Content-Type': "application/json; charset = utf-8"
                }
            }
            $http.put(path + url, data, header)
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (xhr) {
                    if (xhr.status == 401) {
                        $scope.Refresh(url, data, 4, callback)
                    }
                })
        },

        //create by reza salamani because of getting error with other method
        delete: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            $http({
                method: 'delete',
                url: path + url,
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    "Content-Type": "application/json"
                },
                data: data
            }).then(function (response) {
                callback(response.data);
            }).catch(function (xhr) {
                if (xhr.status == 401) {
                    $scope.Refresh(url, data, 4, callback)
                }
            })
        },
        post: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            $http({
                method: 'post',
                url: path + url,
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    "Accept": "text/plain",
                    "Content-Type": "application/json"
                },
                data: data
            }).then(function (response) {
                callback(response.data);
            }).catch(function (xhr) {
                if (xhr.status == 401) {
                    $scope.Refresh(url, data, 4, callback)
                }
            })
        },
        update: function (url, data, callback) {
            var path = "http://192.168.200.2/rcapi/"
            var authHeaders = {};
            var accesstoken = localStorage.getItem('jwtToken');
            var refreshtoken = localStorage.getItem('refreshToken');
            if (accesstoken) {
                authHeaders.Authorization = 'Bearer ' + accesstoken;
            }
            $http({
                method: 'post',
                url: path + url,
                headers: {
                    "Authorization": 'Bearer ' + accesstoken,
                    "Content-Type": "application/json"
                },
                data: data
            }).then(function (response) {
                callback(response.data);
            }).catch(function (xhr) {
                if (xhr.status == 401) {
                    $scope.Refresh(url, data, 4, callback)
                }
            })
        },
    }
}]);