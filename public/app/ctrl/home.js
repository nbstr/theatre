function HomeCtrl($scope, $http, $rootScope){
	$scope.set_tmp = function(){
		$scope.user = {
			firstname:'firstname',
			lastname:'lastname',
			phone:'0000000000',
			email:'nab.kml@gmail.com',
			street:'Rue XXXXXXXXXXX',
			num:'00, 000',
			city:'Bruxelles',
			zip:'1190'
		};
	};
	$scope.get_events = function(){
		// GET DATA THEN SEND IT TO SET DATA
		$http.get('/events')
		.error(function(response){
			console.log(response);
		})
		.then(function(response){
			console.log(response);
			$scope.set_order(response.data);
		});
	};
	$scope.set_order = function(data){
		$scope.ORDER = {};
		for(var e in data){
			$scope.ORDER['e_' + data[e]._id] = {
				event_id:data[e]._id,
				date:'',
				class:'',
				ordered:false
			};
		}
		$scope.EVENTS = data;
	};
	$scope.set_class = function(id, classe){
		$scope.ORDER['e_' + id].class = classe;
		$scope.check_event(id);
	}
	$scope.check_total = function(){
		$scope.total_order = 0;
		for(var e in $scope.ORDER){
			if($scope.ORDER[e].ordered){ // IF ORDERED
				var id = $scope.ORDER[e].event_id;
				for(ev in $scope.EVENTS){ // GET EVENT'S DATA
					if($scope.EVENTS[ev]._id == id){
						// ADULTS
						$scope.total_order += $scope.EVENTS[ev].prices['class' + $scope.ORDER['e_' + id].class].adult * $rootScope.nmbr($scope.FOLKS.adult);
						// YOUNGS
						$scope.total_order += $scope.EVENTS[ev].prices['class' + $scope.ORDER['e_' + id].class].young * $rootScope.nmbr($scope.FOLKS.young);
						// STUDENTS
						$scope.total_order += $scope.EVENTS[ev].prices['class' + $scope.ORDER['e_' + id].class].student * $rootScope.nmbr($scope.FOLKS.student);
					}
				}
			}
		}
	};
	$scope.check_event = function(id){
		// EVENT SELECTED
		if(!$scope.ORDER['e_' + id].ordered){
			$scope.ORDER['e_' + id].ordered = true;
		}
		// DATE SELECTED
		if(!$scope.ORDER['e_' + id].date){
			for(e in $scope.EVENTS){
				if($scope.EVENTS[e]._id == id){
					$scope.ORDER['e_' + id].date = $scope.EVENTS[e].dates[0];
				}
			}
		}
		// EVENT SELECTED
		if(!$scope.ORDER['e_' + id].class){
			$scope.ORDER['e_' + id].class = 'B';
		}
		$scope.check_total();
	};
	$scope.check_events = function(){
		for(var e in $scope.ORDER){
			if($scope.ORDER[e].ordered){ // IF ORDERED
				$scope.check_event($scope.ORDER[e].event_id);
			}
		}
	};
	$scope.clear_event = function(id){
		// CLEAR
		if(!$scope.ORDER['e_' + id].ordered){
			for(e in $scope.EVENTS){
				if($scope.EVENTS[e]._id == id){
					$scope.ORDER['e_' + id].date = '';
				}
			}
			$scope.ORDER['e_' + id].class = '';
			$scope.check_total();
		}
		// SET
		else{
			$scope.check_event(id);
		}
	};
	// VALIDATION
	$scope.form_validation = function(){
        $scope.form_test = function(){

            var form = [
                v($scope.user.firstname, 'req|min:2', 'Prénom'),
                v($scope.user.lastname, 'req|min:2', 'Nom'),
                v($scope.user.phone, 'req', 'Numéro de téléphone'),
                v($scope.user.email, 'req|email', 'Adresse Email'),
                v($scope.user.street, 'req|min:2', 'Rue'),
                v($scope.user.num, 'req', 'Numéro de propriété'),
                v($scope.user.city, 'req|min:2', 'Ville'),
                v($scope.user.zip, 'req|min:2', 'Code Postal')
            ];
            // COUNTRY CUSTOM VALIDATION
			if($scope.user.country){
				form.push(v($scope.user.pays, 'min:2', 'Pays'));
			}

            for(i in form){
                if(!form[i].success){
                	$rootScope.slide('.screen');
                    return {error:true, info:form[i].error}
                }
            }
            return {error:false, info:'Vos coordonnées sont validées'}
        };
        var form_result = $scope.form_test();
        if(form_result.error){$rootScope.error(form_result.info);}else{$scope.validate();}
    };
	$scope.validate = function(){
		
		// AT LEAST ONE PERSON
		if($rootScope.nmbr($scope.FOLKS.adult) + $rootScope.nmbr($scope.FOLKS.young) + $rootScope.nmbr($scope.FOLKS.student) < 1){
			$rootScope.error('Veuillez sélectionner au moins une personne pour cet abonnement');
		}
		else{
			// AT LEAST 5 TICKETS AND 2 FEATURED
			var min_orders = 5, min_featured = 2;
			var count = 0, featured = 0;
			for(var e in $scope.ORDER){
				if($scope.ORDER[e].ordered){ // IF ORDERED
					count++;
					var id = $scope.ORDER[e].event_id;
					for(ev in $scope.EVENTS){ // GET EVENT'S DATA
						if($scope.EVENTS[ev]._id == id){
							if($scope.EVENTS[ev].featured){
								featured++;
							}
						}
					}
				}
			}
			if(count < min_orders){
				$rootScope.error('Veuillez sélectionner au moins '+min_orders+' oeuvres');
			}
			else if(featured < min_featured){
				$rootScope.error('Veuillez choisir au moins '+min_featured+' oeuvres sélectionnées par le Théâtre de Namur');
			}
			else{
				$scope.post_order();
			}
		}		
	};
	$scope.set_post_data = function(){
		var d = $scope.user;
		var data = {
			user:{
				firstname:d.firstname,
				lastname:d.lastname,
				phone:d.phone,
				email:d.email,
				address:{
					street:d.street,
					number:d.num,
					city:d.city,
					zip:d.zip,
					country:(d.pays) ? d.pays : 'Belgique'
				}
			},
			orders:[],
			group:{
				adult:$rootScope.nmbr($scope.FOLKS.adult),
				young:$rootScope.nmbr($scope.FOLKS.young),
				student:$rootScope.nmbr($scope.FOLKS.student)
			},
			total:$scope.total_order
		};
		for(var e in $scope.ORDER){
			if($scope.ORDER[e].ordered){ // IF ORDERED
				var id = $scope.ORDER[e].event_id;
				for(ev in $scope.EVENTS){ // GET EVENT'S DATA
					if($scope.EVENTS[ev]._id == id){

						var evnt = $scope.EVENTS[ev],
							nfo = {
								event_id:evnt._id,
								title:evnt.title,
								date:$scope.ORDER[e].date,
								class:$scope.ORDER[e].class,
								tickets:[]
							};

						for(var p in $scope.FOLKS){
							var ticket = {
								class:$scope.ORDER[e].class,
								category:p,
								number:$rootScope.nmbr($scope.FOLKS[p])
							}
							nfo.tickets.push(ticket);
						}

						data.orders.push(nfo);
					}
				}
			}
		}
		return data
	};
	$scope.post_order = function(){
		if(!$rootScope.posted_order){
			$rootScope.posted_order = true; // DUPLICATE SECURITY

			var data = $scope.set_post_data();

			console.log(data);

			$http.post('/order', data)
			.error(function(response){
				console.log(response);
				$rootScope.error('Une erreur est survenue, veuillez réessayer plus tard.');
			})
			.then(function(response){
				console.log(response);
				$scope.post_success();
			 });
		}
	};
	$scope.post_success = function(){
		$('.screen').fadeOut(500, function(){
			$('#account-number').text('BE83726654283');
			$('#account-value').text($scope.total_order + '€');
			$('.thx-screen').fadeIn(500)
		});
	};
	$scope.init = function(){
		$scope.FOLKS = {
			adult:'1',
			young:'',
			student:''
		};
		$scope.get_events();
	}
	$scope.init();
}