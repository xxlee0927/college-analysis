var dep_autocomplete = [];
$.getJSON('/enemies', function(data){
	$.each(data, function(i, v){
		dep_autocomplete.push({
			label: v.name,
			value: v.dep_no
		});
	});
	dep_autocomplete.sort(function(a, b){
		return a.value - b.value;
	});
});

$('#dep_no').autocomplete({
	source: dep_autocomplete
});