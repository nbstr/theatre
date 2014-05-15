function array2str(input, separator){
    separator = defined_default(separator, ', ');
    if(input == undefined){return ''}
    else if(typeof(input) == typeof('string')){return input}
    else if(typeof(input) == typeof(1989)){return input.toString()}
    else if(typeof(input) == typeof(['array']) || typeof(input) == typeof({object:'object'})){
        var output = '';
        var counter = 0;
        for(var i in input){
            if(typeof(input[i]) == typeof('string')){
                output += input[i];
                if(counter < (input.length - 1)){
                    output += separator;
                }
            }
            else if(typeof(input) == typeof(['array']) || typeof(input) == typeof({object:'object'})){
                output += array2str(input[i]);
                if(counter < (input.length - 1)){
                    output += separator;
                }
            }
            counter++;
        }
        return output
    }
    else{return input.toString()}
}
function defined_default(value, default_value){
    return (typeof value !== 'undefined') ? value : default_value
}
function v(data, conditions, type){
	var msg = (type) ? type + ': ' : '';
	var cnds = conditions.split('|');
	var error = false;
	for(var test in cnds){
		if(cnds[test].indexOf(':')>-1){
			var sub_test = cnds[test].split(':');
			if(sub_test[0] == 'min'){
				if(data.length < parseInt(sub_test[1])){
					error = true;
					msg += 'au moins '+sub_test[1]+' caractères';
					break;
				}
			}
			else if(sub_test[0] == 'max'){
				if(data.length > parseInt(sub_test[1])){
					error = true;
					msg += 'maximum '+sub_test[1]+' caractères';
					break;
				}
			}
		}
		else if(cnds[test] == 'req'){
			if(data == undefined || data.length < 1){
				error = true;
				msg += 'champ requis';
				break;
			}
			continue;
		}
		else if(cnds[test] == 'int'){
			if(typeof(data) != 'number' || data == undefined || data == ''){
				error = true;
				msg += 'ce champ doit contenir un nombre';
				break;
			}
			continue;
		}
		else if(cnds[test] == 'email'){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(data) && data){
				error = true;
				msg += 'adresse email invalide';
				break;
			}
			continue;
		}
	}
	if(error){
		return {
			success:false,
			error:msg
		}
	}
	else{
		return {
			success:true,
			error:msg
		}
	}
}
var tmp = {
	events:[
		{
			_id:0,
			title:'Thomas Fersen',
			dates:[
				'2014-10-07',
				'2014-10-08'
			],
			prices:{
				classA:{
					adult:24,
					young:20,
					student:16
				},
				classB:{
					adult:20,
					young:16,
					student:10
				}
			},
			category:'théâtre',
			url:'http://www.m4ke.it',
			featured:false
		},
		{
			_id:1,
			title:'Album ou les chevaliers, c\'est une autre histoire',
			dates:[
				'2014-10-08',
				'2014-10-09',
				'2014-10-10'
			],
			prices:{
				classA:{
					adult:14,
					young:12,
					student:9
				},
				classB:{
					adult:14,
					young:12,
					student:9
				}
			},
			category:'théâtre',
			url:'http://www.m4ke.it',
			featured:true
		}
	]
};