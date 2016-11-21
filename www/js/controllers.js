angular.module('starter.controllers', [])


//login controller
    .controller('loginController', function ($scope, $http, $ionicLoading,toastr,$state) {
        $scope.loginRetailer = function (user) {
            if(user == undefined || user.username == undefined || user.pin == undefined){
                toastr.error('Please enter login details');
                return;
            }
            $ionicLoading.show();
            $http({
                url:url + 'loginRetailer',
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data:user
            }).success(function (data) {
                $ionicLoading.hide();
                toastr.info(data.msg,data.status);
                if(data.status == 'success'){
                    //save session data..
                    sessionStorage.user_id = data.user.id;
                    sessionStorage.email = data.user.email;
                    sessionStorage.name = data.waiter.first_name +' '+ data.waiter.last_name;
                    sessionStorage.user_id = data.user.id;
                    $state.go('app.dashboard');
                }
            }).error(function () {
                toastr.error('Check your internet connection and try again.');
                $ionicLoading.hide();
            })
        }
    })
    .controller('dashboardController', function ($scope, $http, $ionicLoading,toastr,$ionicModal,$ionicPopup) {

        //get the device location.

        // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //
        var onSuccess = function(position) {
            //display the location of the device to the user
            //$scope.sale.lat = position.coords.latitude;
            $scope.sale.longi = position.coords.longitude;
            geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
            $http({
                url:geoUrl+ '?latlng='+position.coords.latitude+','+position.coords.longitude+'&key=AIzaSyDQEUIYxOHoGQA2QInEw4fRr6Fhuw8Ekwo',
                method:'GET'
            }).success(function (data) {
                console.info(data);
                $scope.sale.locationName = data['results'][0]['formatted_address'] ;
            })
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);



        $scope.sale = [];
        $scope.getItems = function () {
            var item_count = 0;
            var item_item_count = 0;
            for(var i=0; i<$scope.shoppingList.length; i++){
                item_count += 1;
                item_item_count += $scope.shoppingList[i].quantity;
            }return ' '+item_count+'('+item_item_count+')';
        };
        $scope.sale.user_id = sessionStorage.user_id;
        $scope.getTotal = function () {
            var total = 0;
            for(var i=0; i<$scope.shoppingList.length; i++){
                total += $scope.shoppingList[i].product_price * $scope.shoppingList[i].quantity;
            }return total;
        };

        $scope.getDueAmount = function () {
            if($scope.sale.TotalAmount == undefined){
                $scope.sale.TotalAmount = '';
            }
            return   $scope.getTotal()-$scope.sale.TotalAmount;
        };

        $scope.getBalance = function () {
            if($scope.sale.TotalAmount == undefined){
                $scope.sale.TotalAmount = '';
            }
            return  $scope.sale.TotalAmount - $scope.getTotal();
        };
        $scope.shoppingList = [];
        $scope.url = url;
        /*modal for listing inventory*/
        $ionicModal.fromTemplateUrl('templates/productslist.html',{
            scope: $scope,
            animation:'slide-in-right'
        }).then(function (proList) {
            $scope.proListModal = proList;
        });

        /*modal for making payment starts here..*/
        //$ionicModal.fromTemplateUrl('template')
        $ionicModal.fromTemplateUrl('templates/payment.html',{
            scope:$scope,
            animation: 'slide-in-right'
        }).then(function (payModal) {
            $scope.paymentModal = payModal;
        });
        /*modal for making payment ends here..*/

        /*modal for changing customer..*/
        $ionicModal.fromTemplateUrl('templates/customer.html',{
            scope:$scope,
            animation:'slide-in-right'
        }).then(function (customerModal) {
            $scope.customerModal = customerModal;
        });



        $ionicLoading.show();
        $http({
            url:url+'loadRetailersDashboard/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $scope.warehouses = data.warehouses;
            $scope.customers = data.customers;
            $scope.products = data.products;
            $ionicLoading.hide();
        }).error(function () {
            toastr.error('Check your internet connection and try again.');
            $ionicLoading.hide();
        });
        /*show the inventory*/
        $scope.add_product = function () {
            $scope.proListModal.show();
        };
        /*close the inventory listing modal*/
        $scope.closeProductList = function () {
            $scope.proListModal.hide();
            $scope.searchProd = '';
        };
        /*close the payment modal*/
        $scope.closePaymentMod = function () {
            $scope.paymentModal.hide();
        };
        /*add product to the shopping list*/
        $scope.addProd = function (item) {
            $scope.proListModal.hide();
            $scope.searchProd = '';
            item.quantity=1;
            $scope.shoppingList.push(item);
            //get the index
            $scope.products.splice($scope.products.indexOf(item),1);
            console.info($scope.shoppingList);
        };
        $scope.payForProds = function () {
            /*check if there is items in the shopping list*/
            if(! $scope.shoppingList.length){
                toastr.error('Please add shopping list items');
                return;
            }

            $scope.paymentModal.show();
        };
        $scope.addQShoppingList = function (item) {
            item.quantity +=1;
        };
        $scope.deleteShoppingList = function (item) {
            /*check the quantity if one delete if greater than one decreament*/

            if(item.quantity >1){
                item.quantity -= 1;
                return;
            }
            $scope.products.push(item);
            $scope.shoppingList.splice($scope.shoppingList.indexOf(item),1);
        };
        $scope.updateQShoppingList = function (item) {
            // Triggered on a button click, or some other target
            var ind = $scope.shoppingList.indexOf(item);
            $scope.data = {};
            $scope.data.q = $scope.shoppingList[ind]['quantity'];
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<span>SKU Code:</span><br/>' +
                '<input type="text" style="text-align: center" ng-value="data.code" ng-model="data.code">' +
                '<span>Quantity:</span><br/>' +
                '<input type="number" style="text-align: center" ng-value="data.q" ng-model="data.q">',
                title: 'SKU SALE',/*
                 subTitle: 'Please use normal things',*/
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Update</b>',
                        type: 'btn-myButton',
                        onTap: function(e) {
                            /*update quantity*/
                            $scope.shoppingList[ind]['quantity'] = $scope.data.q;
                            //check if there is already existing values for original price..
                            if($scope.shoppingList[ind]['original_price'] == undefined){
                                $scope.shoppingList[ind]['original_price'] = $scope.shoppingList[ind]['product_price']
                            }

                            /*ajax to get SKU factor..*/
                            if($scope.data.code != undefined && $scope.data.code != ''){
                                $http({
                                    url:url+'/getSKUFactory/'+$scope.data.code,
                                    method:'GET'
                                }).success(function (data) {
                                    if(data.hasFactor){
                                        $scope.shoppingList[ind]['product_price'] = data['product']['factor']
                                            * $scope.shoppingList[ind]['original_price'];
                                    }else{
                                        $scope.shoppingList[ind]['product_price'] = $scope.shoppingList[ind]['original_price'];
                                    }

                                }).error(function(error){
                                    toastr.error('Check your internet connection.');
                                })
                            }
                            $scope.shoppingList[ind]['product_price'] = $scope.shoppingList[ind]['original_price'];

                        }
                    }
                ]
            });
        };


        //sell products with barcode..
        $scope.sellWithBarcode = function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        };


        $scope.removeShoppingList = function (item) {
            /*swipe to remove item*/
            $scope.products.push(item);
            $scope.shoppingList.splice($scope.shoppingList.indexOf(item),1);
        };
        $scope.sellProds = function (data) {
            var sendData = [];
            sendData.push(data);
            sendData.push($scope.shoppingList);

            //$scope.sale.push({'waiter_id':sessionStorage.user_id});
            $http({
                url:url+'sellProds/'+sessionStorage.user_id,
                data:$scope.sale,
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                console.info(data);
            }).error(function (error) {
                console.error(error);
                toastr.error(error);
            })
        };
        /*cancel order*/
        $scope.cancelOrder = function () {
            //
        };
        /*change warehouse.*/
        $scope.changeWarehouse = function () {
            alert('closer');
            $scope.customerModal.show();
        };

        /*change customer.*/
        $scope.changeCustomer = function () {
            $scope.customerModal.show();
        };
        /*actually change the customer..*/
        $scope.changeCustomerSelected = function (item) {
            $scope.sale.customer = item;
            $scope.sale.customer.full_name = item.first_name+' '+item.last_name;
            $scope.customerModal.hide();
        };
        //close customers modal
        $scope.closeCustomerList = function () {
            $scope.customerModal.hide();
        }

    })
    .controller('menuController', function () {

    })
    .controller('notificationsController', function ($scope,$http,$ionicLoading,toastr) {
        $ionicLoading.show();
        $http({
            url:url+'loadNotifications/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $scope.notifications = data.notifications;
            $ionicLoading.hide();
        }).error(function (err) {
            console.error(err);
            toastr.error('Check your internet connection');
            $ionicLoading.hide();
        })
    })
    .controller('salesController', function ($scope,$ionicLoading,$http,toastr) {
        $ionicLoading.show();
        $http({
            url:url+'/loadSales/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $scope.sales = data.sales;
            $ionicLoading.hide();
        }).error(function (err) {
            $ionicLoading.hide();
            console.error(err);
            toastr.error('check your internet connection and try again');
        })
    });
