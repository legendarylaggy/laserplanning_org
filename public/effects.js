$( document ).ready(function() {
  
    if($('#generalForm input[type="checkbox"]').prop('checked')){
    }
    else{
  $('#generalForm input:not(:checkbox)').attr('disabled', 'disabled');

  $(':checkbox').on('change', function () {
    $(this).first().nextAll().attr('disabled', !$(this).is(':checked'))
    //.closest('div').prevUntil($(':checkbox').closest('div')).find('input').attr('disabled', !$(this).is(':checked'))
  });

    }
  



function textLength(value) {
  var maxLength = 10;
  if (value.length > maxLength) return false;
  return true;
}

// document.getElementsByClassName('entry').onkeyup = function(){
// if(!textLength(this.value)) alert('text is too long!');
// }

var elements = document.getElementsByClassName('entry');

for (var i = 0, length = elements.length; i < length; i++) {
  elements[i].onkeyup = function () {
    if (!textLength(this.value)) alert('text is too long! Max 10 characters!');
  }
}

});