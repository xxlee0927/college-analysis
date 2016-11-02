var dep_autocomplete = [];
$.getJSON('/departments', function(data){
	$.each(data, function(i, v){
		dep_autocomplete.push({
			label: v.name,
			value: v.dep_no
		});
	});
	console.log(dep_autocomplete);
	dep_autocomplete.sort(function(a, b){
		return a.value - b.value;
	});
	$('#dep_no').autocomplete({
		source: dep_autocomplete
	});
});

