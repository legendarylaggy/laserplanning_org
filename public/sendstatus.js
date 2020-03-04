$(function() {
// submit form to server

function post(path, params, method) {
  method = method || "post";

  var form = document.createElement("form")
  form.setAttribute("method", method)
  form.setAttribute("action", path)

  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden")
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key])

      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form)
  form.submit();

}
// Change status
$(document).on("click", ".stat", function () {
  var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
  var clickedBtnVal = $(this).attr('value');
  var status = "ERROR"
  switch (clickedBtnVal) {
    case '0':
      status = "PENDING"
      break;
    case '1':
      status = "BUSY"
      break;
    case '2':
      status = "READY"
      break;
  }
  // confirmation for user
  if (window.confirm("Change status of nesting " + clickedBtnID + " to " + status + "?")) {

    var info = {
      order: clickedBtnID,
      value: clickedBtnVal,
      type: 0 //Status
    }
    post("/editInfo", info)
  }
});

//Toggle MIP
$(document).on("click", ".squaredCheck", function () {
  var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
  var clickedBtnVal = $(this).attr('value');
  var info = {
    order: clickedBtnID,
    value: clickedBtnVal,
    type: 1 // MIP
  }
  post("/editInfo", info)

});

//Toggle error
$(document).on("click", ".errorCheck", function () {
  var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
  var clickedBtnVal = $(this).attr('value');
  var info = {
    order: clickedBtnID,
    value: clickedBtnVal,
    type: 2 // ERROR
  }
  post("/editInfo", info)

});

//hide error and extra order by default
$("td[colspan=9]").find("p").hide();
$("td[colspan=8]").find("p").hide();

// Toggle view of error box
$(".clicker").click(function (event) {
  var $target = $(event.target);
  $target.closest("tr").next().find("p").slideToggle();
});

// Expand all hidden order fields
$("#showAllOrders").click(function (event) {
  var $target = $(event.target);
  $(".expand").each(function () {
    $(this).closest("p").slideToggle();
  })
});

// --- ONLOAD ---
//set time from minutes to default format hm / s 
//
window.onload = function () {
  var elements = document.getElementsByClassName("data")
  for (var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = convertTime(elements[i].innerHTML)
  }

  var elements = document.getElementsByClassName("jobTime")
  for (var i = 0; i < elements.length; i++) {
    if( elements[i].innerHTML > 60 )
    {
      elements[i].style.color = 'white'
      elements[i].style.fontWeight = 'bold'
      elements[i].style.textDecoration = 'underline'
    }
    elements[i].innerHTML = convertTime(elements[i].innerHTML)

  }
}

// Order List search Box
$(document).ready(function () {
  $("#tableSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#orderTableSearch tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

$(function () {
  $("#dialog").dialog({
    autoOpen: false,
    width: 870,
    maxHeight: 800,
    show: {
      effect: "slide",
      duration: 500
    },
    hide: {
      effect: "slide",
      duration: 500
    }
  });

  $("#opener").on("click", function () {
    $("#dialog").dialog("open");
  });
});

// Conver minute to default values 
const convertTime = (input) => {

  var decimalTime = parseFloat(input)
  var hours = Math.floor(decimalTime / 60)
  var minutes = Math.floor(((decimalTime / 60) % 1) * 60)
  var seconds = Math.floor(((decimalTime) * 60))
  if (decimalTime > 1) {
    if (hours < 1) {
      hours = ""
    }
    else
      hours = hours + "h "
    return "" + hours + minutes + " min"
  }
  else

    return seconds + "sec"
}

// Open edit window
$(function () {
  $("#diagE").dialog({
    autoOpen: false,
    modal: true,
    width: 900,
    show: {
      effect: "fade",
      duration: 200
    },
    hide: {
      effect: "fade",
      duration: 200
    }
  });



  $("#diagE").dialog({
    resizable: false,
    autoOpen: false,
    //height:350,
    modal: true,
    position:{
      my:"top",
      at:"top",
      of: window
    },
    buttons: {
      'OK': function() {
        $(this).dialog('close');
        
      },
     Cancel: function() {
        $(this).dialog('close');
     }
   }
});

$("#editPage").dialog({
  title:"EDIT",
  width:1000,
  resizable: false,
  autoOpen: false,
  //height:350,
  modal: true,
  position:{
    my:"top",
    at:"top",
    of: window
  },
  buttons: {
    'OK': function() {
      $(this).dialog('close');
      
    },
   Cancel: function() {
      $(this).dialog('close');
   }
 }
});
  $("body").on("click", ".infoRow", function () {


    var val = $(this).attr('id');


    // $("#diagE").dialog({
    //   open: function(event, ui){
    //     $('#divInDialog').load('test.html', function() {
    //       alert('Load was performed.')
    //     });
    //   }
    // });


  //   $( "#diagE" ).dialog({
  //     open: function(event, ui) {
  //       $('#divInDialog').load('main.css', function() {
  //         alert('Load was performed.');
  //       });
  //     }
  //  });

  
      //  $.get("lineInfo", function(data){
      //       $('#diagE').html(data[22].Employee);
      //       $('#diagE').dialog('open');
      //  })

       $.post('employeeData',   // url
			   { user: val }, // data to be submit
         function(data, status, jqXHR) {// success callback
          var txt = "";
          for (x in data.output2[0]) {
            txt += data.output2[0][x] + " ";
          };

          $('#divInDialog').html("");
          //$('#diagE').html(data[22].Employee);
            $('#diagE').dialog('open');
            $('#diagE').dialog('option', 'title', data.output[0].First_Name + " " + data.output[0].Last_Name);

           // $('#divInDialog').text('status: ' + status + ', data: ' + data.output2[0].employee);

            $('#divInDialog').append("<h2>" + data.output[0].First_Name +" " + data.output[0].Last_Name + "</h2> ")
            $('#divInDialog').append("<b> General </b>- " + (data.output2[0]?"data available":"no data") + " <button class=\"git\">Edit</button>  <button class=\"button-xsmall pure-button\" "+ (data.output2[0]?"":"disabled") +" >View</button> <br><br>" )
            $('#divInDialog').append("<b> Kleine Bewerkingen </b>- " + (data.output3[0]?"data":"no data") + " <button class='git'>Edit</button>  <button class=\"button-xsmall pure-button\" "+ (data.output3[0]?"":"disabled") +">View</button> <br><br>")
            $('#divInDialog').append("<b> Laser Afdeling </b>- " + (data.output4[0]?"data available":"no data") + " <button class=\"git button-xsmall pure-button\">Edit</button>  <button class=\"button-xsmall pure-button\" "+ (data.output4[0]?"":"disabled") +">View</button> <br><br>")
            $('#divInDialog').append("<b> Plooi Afdeling </b>- " + (data.output5[0]?"data available":"no data") + " <button class=\"git button-xsmall pure-button\">Edit</button>  <button class=\"button-xsmall pure-button\" "+ (data.output5[0]?"":"disabled") +">View</button> <br><br>")
            $('#divInDialog').append("<b> Poeder Afdeling </b>- " + (data.output6[0]?"data available":"no data") + " <button class=\"git button-xsmall pure-button\" >Edit</button>  <button class=\"button-xsmall pure-button\" "+ (data.output6[0]?"":"disabled") +">View</button> <br><br>")
            $('#divInDialog').append("<b> Pons Afdeling </b>- " + (data.output7[0]?"data available":"no data") + " <button class=\"git button-xsmall pure-button\">Edit</button>  <button class=\"button-xsmall pure-button\" "+ (data.output7[0]?"":"disabled") +">View</button> <br><br>")
            

            //$('#divInDialog').append("<h3>" + txt + "</h2>")
            //console.log(data.output2[0])
           // console.log(txt)

            //console.table(data.output)
        });
        
        
  

    // $.get("/lineInfo", function (data) {
    //   console.table(data[0].Employee)
      

    // })

  });


var formGeneral = "<form>\
                  <label for=\"fname\">Brochure:</label><br>\
                  <input type=\"text\" id=\"fname\" name=\"fname\" value=\"\"><br>\
                  <label for=\"fname\">Brochure:</label><br>\
                  <input type=\"text\" id=\"fname\" name=\"fname\" value=\"\"><br>\
                  <label for=\"fname\">Brochure:</label><br>\
                  <input type=\"text\" id=\"fname\" name=\"fname\" value=\"\"><br>\
                  <label for=\"fname\">Brochure:</label><br>\
                  <input type=\"text\" id=\"fname\" name=\"fname\" value=\"\"><br>\
                  <label for=\"lname\">Rondleiding:</label><br>\
                  <input type=\"text\" id=\"lname\" name=\"lname\" value=\"\"><br><br>\
                  <input type=\"submit\" value=\"Submit\">\
                  </form>";


  $("#divInDialog").on("click",".git", function () {

    
    $('#editPage').dialog('open');
    var val = $(this).attr('id');
    $('#editForm').load("generalForm.html")

        
  });


});

});