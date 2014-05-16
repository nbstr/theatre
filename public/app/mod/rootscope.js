angular.module('Rootscope', [])
/*
|--------------------------------------------------------
| ROOTSCOPE
|--------------------------------------------------------
*/
.run(function($rootScope){
	// FUNCTIONS
    $rootScope.nmbr = function(i){
    	var t = parseInt(i);
        return (t) ? t : 0
    };
    $rootScope.empty_data = function (data, new_data){
        if(data == '' || data == undefined){return new_data}else{return data}
    };
    // SCROLL
    $rootScope.slide = function(position, speed){
        if(typeof(position) === 'number'){
            $("body").animate({scrollTop:$rootScope.empty_data(position, 0)}, $rootScope.empty_data(speed, 500), 'swing');
        }
        else{
            position = $(position).offset().top;

            var element = $rootScope.empty_data(position, 0);

            if(speed == undefined){
                var total_height = $(document).height();
                var current_position = $('body').scrollTop();
                console.log({
                    total:total_height,
                    current:current_position,
                    ratio:(total_height - current_position) / total_height
                });
                speed = 800 + ( (total_height - current_position) / total_height * 400 );
            }
            $("body").animate({scrollTop:element}, speed, 'easeInOutQuint');
        }
    };
    // ALERT MODAL
    $rootScope.alert = function (message, callback, title){
        // DATA
        $('#alert h2').html((title) ? title : 'Information');
        $('#alert p').html(array2str(message));
        // CALLBACKS
        $('#alert').one('shown.bs.modal', function(){
            $('#alert button').focus();
        });
        if(typeof(callback) === 'function'){
            $('#alert').one('hidden.bs.modal', callback);
        }
        // DISPLAY
        $('#alert').modal('show');
    };
    $rootScope.error = function (message, callback){
        // DATA
        $('#error h2').html('Une erreur est survenue');
        $('#error p').html(array2str(message));
        // CALLBACKS
        $('#error').one('shown.bs.modal', function(){
            $('#error button').focus();
        });
        if(typeof(callback) === 'function'){
            $('#error').one('hidden.bs.modal', callback);
        }
        // DISPLAY
        $('#error').modal('show');   
    };
    // INIT
    $rootScope.init = function(){
        $rootScope.posted_order = false;
    };
    $rootScope.init();
})
.filter('dte', function(){
    return function(date){
        if(date == undefined){return '';}
        // INPUT YYYY-MM-DD
        var days = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
        var y = date.split('-')[0],
            m = date.split('-')[1],
            d = date.split('-')[2];
        var new_date = new Date(y, parseInt(m)-1, d);

        // console.log({
        //     input:{
        //         d:d,
        //         m:m,
        //         y:y
        //     },
        //     new_date:{
        //         date:new_date,
        //         week_day:new_date.getDay()
        //     }
        // });

        return days[new_date.getDay()] + ' ' + d + '.' + m;
    }
});