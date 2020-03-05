$(function () {

  $('#generalForm input:not(:checkbox)').attr('disabled', 'disabled');

  $(':checkbox').on('change', function () {
    var check  = $(this).first().nextAll().attr('disabled', !$(this).is(':checked'))
    //.closest('div').prevUntil($(':checkbox').closest('div')).find('input').attr('disabled', !$(this).is(':checked'))
    console.log(check)
  });
});