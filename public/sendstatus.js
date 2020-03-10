//const e = require("express");

$(function () {
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
      if (elements[i].innerHTML > 60) {
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
      } else
        hours = hours + "h "
      return "" + hours + minutes + " min"
    } else

      return seconds + "sec"
  }

  // Open edit window
  $(function () {
    $("#diagE").dialog({
      autoOpen: false,
      modal: true,
      width: 400,
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
      position: {
        my: "top",
        at: "top",
        of: window
      },
      buttons: {
        Close: function () {
          $(this).dialog('close');
        }
      }
    });

    $("#editPage").dialog({
      width: 950,
      resizable: false,
      autoOpen: false,
      //height:350,
      modal: true,
      position: {
        my: "top",
        at: "top",
        of: window
      },
      buttons: {
        'OK': function () {
          //if(checkStringLength)){
          sendInfo();
          // }
          //  else{
          //  alert("verantw - max 5 characters / opmerking - max 250 characters ")
          // }
        },
        Cancel: function () {
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

      $.post('employeeData', // url
        {
          user: val
        }, // data to be submit
        function (data, status, jqXHR) { // success callback
          var txt = "";
          for (x in data.output2[0]) {
            txt += data.output2[0][x] + " ";
          };

          $('#divInDialog').html("");
          //$('#diagE').html(data[22].Employee);
          $('#diagE').dialog('open');
          // $('#diagE').dialog('option', 'title', data.output[0].First_Name + " " + data.output[0].Last_Name);

          // $('#divInDialog').text('status: ' + status + ', data: ' + data.output2[0].employee);

          $('#divInDialog').append("<h2>" + data.output[0].First_Name + " " + data.output[0].Last_Name + " - " + data.output[0].Employee + "</h2> ")
          $('#divInDialog').append("<b> General </b>- " + (data.output2[0] ? "data available" : "no data") + " <button id='general' class=\"git button-xsmall pure-button\">Edit</button>  <button class=\"button-xsmall pure-button\" " + (data.output2[0] ? "" : "disabled") + " >View</button> <br><br>")
          $('#divInDialog').append("<b> Kleine Bewerkingen </b>- " + (data.output3[0] ? "data" : "no data") + " <button  id='klbew' class='git button-xsmall pure-button'>Edit</button>  <button class=\"button-xsmall pure-button\" " + (data.output3[0] ? "" : "disabled") + ">View</button> <br><br>")
          $('#divInDialog').append("<b> Laser Afdeling </b>- " + (data.output4[0] ? "data available" : "no data") + " <button class=\"git button-xsmall pure-button\">Edit</button>  <button class=\"button-xsmall pure-button\" " + (data.output4[0] ? "" : "disabled") + ">View</button> <br><br>")
          $('#divInDialog').append("<b> Plooi Afdeling </b>- " + (data.output5[0] ? "data available" : "no data") + " <button class=\"git button-xsmall pure-button\">Edit</button>  <button class=\"button-xsmall pure-button\" " + (data.output5[0] ? "" : "disabled") + ">View</button> <br><br>")
          $('#divInDialog').append("<b> Poeder Afdeling </b>- " + (data.output6[0] ? "data available" : "no data") + " <button class=\"git button-xsmall pure-button\" >Edit</button>  <button class=\"button-xsmall pure-button\" " + (data.output6[0] ? "" : "disabled") + ">View</button> <br><br>")
          $('#divInDialog').append("<b> Pons Afdeling </b>- " + (data.output7[0] ? "data available" : "no data") + " <button class=\"git button-xsmall pure-button\">Edit</button>  <button class=\"button-xsmall pure-button\" " + (data.output7[0] ? "" : "disabled") + ">View</button> <br><br>")

          //$('#divInDialog').append("<h3>" + txt + "</h2>")
          //console.log(data.output2[0])
          // console.log(txt)
          //console.table(data.output)
        });

      // $.get("/lineInfo", function (data) {
      //   console.table(data[0].Employee)


      // })

    });

    $("#divInDialog").on("click", "#general", function () {
      $('#editPage').dialog('open');
      $('#editPage').dialog('option', 'title', "General");
      var val = $(this).attr('id');
      getData("ALGEMEEN")
      //First get information then push to form
      //$('#editForm').load("generalForm.html")
      //$('#editForm').load("generalForm.html", {data: employeDetails})
      $('#generalForm input:not(:checkbox)').attr('disabled', 'disabled');

  
    });




    $("#divInDialog").on("click", "#klbew", function () {
      $('#editPage').dialog('open');
      $('#editPage').dialog('option', 'title', "Kleine Bewerkingen");
      var val = $(this).attr('id');
      $('#editForm').load("klbewForm.html")

    });


    function sendInfo() {




      var gForm = $('#generalForm').serializeArray();
      //console.table(gForm)
      console.log(gForm)
      // Get some values from elements on the page:
      // var $form = $(this),
      //   term = $form.find("input[name='s']").val(),
      //   url = $form.attr("action");

      // // Send the data using post


      gForm.forEach((element, i) => {
        if (element.name == 'boxCheck' && element.value == 'on') {

          console.log("entries found!")
          console.log(gForm[i + 1].name + " " + gForm[i + 1].value)
          console.log(gForm[i + 2].name + " " + gForm[i + 2].value)

          $.post('postInfo', {
            id: gForm[i + 1].name,
            verantw: gForm[i + 1].value,
            opmerking: gForm[i + 2].value
          }).done(function (data) {
            var content = $(data).find("#content");
            // $("#result").empty().append(content);
            console.log("saved!")
          });
        }
      });

      // // Put the results in a div
      //  posting.done(function (data) {
      //   var content = $(data).find("#content");
      //   // $("#result").empty().append(content);
      //   console.log("saved!")
      // });


    }


  });

  function getData(val) {
    // Grab the template
    $.get('/result.ejs', function (template) {
        // Compile the EJS template.
        var func = ejs.compile(template);

        // Grab the data

        $.post('data', // url
        {
          user: val
        }, // data to be submit
        function (data, status, jqXHR) { // success callback

          var html = func(data);
           $('#divResults').html(html);

        });



        // $.get('/data', function (data) {

         
        //    // Generate the html from the given data.
        //    var html = func(data);
        //    $('#divResults').html(html);
        // });
    });
}





});