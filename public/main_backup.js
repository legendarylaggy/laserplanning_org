//(function(){
  // var socket = io('http://srvtrumpf');
  // socket.on('connect', function(){});
  // socket.on('event', function(data){});
  // socket.on('disconnect', function(){
  //   socket.emit('BYE',"MESSAGE");
  // });

  var dropzone = document.getElementById('dropzone')
  var p = document.getElementById("out")
  var p = document.getElementById("err")
  var submitForm = document.getElementById("submitForm")

  var mainInfoStrs = ["BEGIN_EINRICHTEPLAN_INFO","ENDE_EINRICHTEPLAN_INFO"]
  var plateTechStrs = ["BEGIN_SHEET_TECH","ENDE_SHEET_TECH"]

  //Needs skipTerm:skipLine
  var partsInfoStrs = ["BEGIN_PARTS_IN_PROGRAM","ENDE_PARTS_IN_PROGRAM"]
  
  var partOrdersStrs = ["BEGIN_PARTORDER_IN_PRODORDER","ENDE_PARTORDER_IN_PRODORDER"]
  
  var skipLine = ["BEGIN_PARTS_IN_PROGRAM_POS","ENDE_PARTS_IN_PROGRAM_POS"]

  var name_value = ["ZA,MM,","ZA,DA,"]

  var sqlElementMain = ["Maschine", "Typ","Firma","Auftragsname","Anzahl der Programmdurchlaeufe","Lagergutbezeichnung","Maschinenzeit","Bemerkung","viewer name machine"]
  var sqlElementPlate = ["Blechmass X real","Blechmass Y real","Blechmass Z","Materialkennung"]
  var sqlElementPart = ["Teil-Identnummer","ToPs-Zeichnungskunde"]

  var fileInfo = []
  var sData = []
  var tempArr = []
  var out = []
  
  const splitCont = (item) =>{return item.content.split("\n")}

  const getIndexOfObj = (lines, searchTerm,skipTerm) => {

    skipTerm = skipTerm || ""
    var index = []
    
    searchTerm.forEach((term, i) => {
      lines.forEach((ele, lineNumber) => {
        if(ele.match(term) && i == 0){
          if(ele.match(skipTerm[i])){}
          else
          index[i] = lineNumber // + " " + ele //debug
        }
        else if(ele.match(term) && i == 1){
          if(ele.match(skipTerm[i])){}
          else
          index[i] = lineNumber // + " " + ele //debug
        }
      });
    });
    return index
  }
  const multiObj = (lines, searchTerm,skipTerm) => {

    skipTerm = skipTerm || ""
    var index = []
    var indexCounter = 0
    firstElement = []
    secondElement = []

    searchTerm.forEach((term, i) => {
      lines.forEach((ele, lineNumber) => {
        if(ele.match(term) && i == 0){

          if(ele.match(skipTerm[i])){}
          else{
            firstElement = lineNumber // + " " + ele //debug
            index.push([firstElement])
          }
        }
        else if(ele.match(term) && i == 1){
          if(ele.match(skipTerm[i])){}
          else{
            secondElement = lineNumber // + " " + ele //debug
            index[indexCounter].push(secondElement)
            indexCounter++
          }
        }
      });
      
    });
    return index
  }

  const multiData = (lines, index) =>{
    //ZA,MM,29 //Desc
    //ZA,DA,1  //Data
    var searchTerm = name_value
    var tempLines = 0
    var desc = []
    var data = []
    var tempArrNo = 0
    var result = []
    
    for (var k = 0; k < index.length; k++) {

      searchTerm.forEach((term,termNo) => {
        for(let i = index[k][0]; i < index[k][1]; i++) {
          if(lines[i].match(term)){
            tempLines = i+1 

            while(lines[tempLines+tempArrNo].length > 2){
              if(termNo === 0)
                desc[tempArrNo] = lines[tempLines+tempArrNo].split(",")[7]
              else if(termNo === 1){
                data[tempArrNo] = lines[tempLines+tempArrNo]
              }
              tempArrNo++ 
            }
            tempArrNo = 0
          }
        }
      })
    
      data = data.toString()
      if(data.match(",-  "))
        data = data.replace(/(\',\r,-\s\s\')/g,'')
      data = data.split(",")

      data.forEach((element,index) => {
        data[index] = element.replace(/[&\\#,+$~%":*?<>{}]/g, '').trim()
        if(data[index] == 'DA')
        data[index] = ""
      });
      data = data.filter(entry => entry.length >= 1)
      data.forEach((ele,i) => {data[i] = ele.replace(/[']/g, '')})
      desc.forEach((ele,i) => {desc[i] = ele.replace(/[']/g, '')})

      var output = []
      desc.forEach((i,j)=>{
        var obj = {}
        obj.name = i
        obj.value = data[j]
        output.push(obj)
      })
      result.push(output)
    }
    // console.table(desc)
    // console.table(data)
    //console.table(output)
    // console.table(result)
     

    return result
  }

  const getData = (lines, index) =>{
    //ZA,MM,29 //Desc
    //ZA,DA,1  //Data
    var searchTerm = name_value
    var tempLines = 0
    var desc = []
    var data = []
    var tempArrNo = 0
    searchTerm.forEach((term,termNo) => {
      for(let i = index[0]; i < index[1]; i++) {
        if(lines[i].match(term)){
          tempLines = i+1 

          while(lines[tempLines+tempArrNo].length > 2){
            if(termNo === 0)
              desc[tempArrNo] = lines[tempLines+tempArrNo].split(",")[7]
            else if(termNo === 1){
              data[tempArrNo] = lines[tempLines+tempArrNo]
            }
            tempArrNo++ 
          }
          tempArrNo = 0
        } 
      }
    })
    data = data.toString()
    if(data.match(",-  "))
      data = data.replace(/(\',\r,-\s\s\')/g,'')
    data = data.split(",")

    data.forEach((element,index) => {
      data[index] = element.replace(/[&\\#,$~%":*?<>{}]/g, '').trim()
      if(data[index] == 'DA')
      data[index] = ""
    });
    data = data.filter(entry => entry.length >= 1)
    data.forEach((ele,i) => {data[i] = ele.replace(/[']/g, '')})
    desc.forEach((ele,i) => {desc[i] = ele.replace(/[']/g, '')})

    var output = []
    desc.forEach((i,j)=>{
      var obj = {}
      obj.name = i
      obj.value = data[j]
      output.push(obj)
    })

    // console.table(desc)
    // console.table(data)
    // console.table(output)

    return output
  }

  const getValue = (object,grabItem) => {
    var output = []
    grabItem.forEach(item => {
      output[item] = object.find((ele,i,arr) =>{
        return arr[i]?ele.name.match(item):null
      })
    });    
    return output
  }

  const getValueADD = (object,grabItem) => {
    var output = [] = new Array()
    for (let index = 0; index < object.length; index++) {
      output[index] = []
      grabItem.forEach(item => {
        output[index][item] = object[index].find((ele,i,arr) =>{
          return arr[i]?ele.name.match(item):null
        })
        
      });
     //console.log(object[index])
      //console.log(output[index])
    }
    return output
  }

  const sortOutMulti = object => {
    totalPlates = 0
    totalTime = 0
    for (let i = 0; i < object.length; i++) {
      totalPlates += Number(object[i]["Anzahl der Programmdurchlaeufe"].value)
      totalTime += (object[i].Maschinenzeit.value * object[i]["Anzahl der Programmdurchlaeufe"].value)
    }
    var out = {
      time:totalTime,
      plates:totalPlates
    }

    return out
  }




  const printTableObj = (obj) => {
    var tbody = document.getElementById('tableOut');

    tbody.innerHTML += "<th><td>" + "top0" + "</td>" + "<td>" + "top1"+ "</td></th>";

    for (var i = 0; i < obj.length; i++) {
      var tr = "<tr>";
      tr += "<td>" + obj[i].name + "</td>" + "<td>" + obj[i].value.toString() + "</td></tr>";
      tbody.innerHTML += tr;
    }
  }

  //Submission Form
  const mainInfoForm = (main,plate, parts,extra,filename) =>{
    const { Maschine, Typ, Firma, Auftragsname, Lagergutbezeichnung, Maschinenzeit,Bemerkung } = main
    var plates = main['Anzahl der Programmdurchlaeufe']
    var machFN = main['viewer name machine']  
    
    var plateInfo  = extra

    var plateX = plate['Blechmass X real']
    var plateY = plate['Blechmass Y real']
    var materialType = plate['Materialkennung']
    var client = parts['ToPs-Zeichnungskunde']
    var material = ""
    var order = ""
    var checked = ""

    if(Lagergutbezeichnung.value.toString().trim() == "")
      material = materialType.value + "-" + plateX.value +"x"+ plateY.value
    else
      material = Lagergutbezeichnung.value.toString().trim()
    if(Firma.value.toString().trim() == ""){
       order = "Group"
       checked = "checked"
    }
    else 
      order = Firma.value.toString().trim()
      
    // plateX
    // plateY
    // materialType
    // client

    submitForm.innerHTML = 
    `<form method="POST" action="/submitInfo" id="usrform"> ` +
    `<br><br>` +
    `<label>Machine ID*</label><br>`+
    `<select name="machine">`+
    `<option value="${Maschine.value}">DEF:${Maschine.value}</option>`+
    `<option value="L49">L49 (Fiber)</option>`+
    `<option value="L3050">L3050 (6kw)</option>`+
    `<option value="L18">L18 (4m)</option>`+
    `<option value="TC6000L">TC6000</option>`+
    `<option value="TC5000R">TC5000</option>`+
    `<option value="TC3000R">TC3000</option>`+
    `</select>`+
  
    `<br><br>` +  
    `<label>Type* 1 = Laser | 2 = Pons</label><br>` +
    `<input class="cont" type="text" name="type" value="${Typ.value}">`+
    `<br><br>` +
    `<label>Client*</label><br>` +
    `<input class="cont" type="text" name="client" value="${client.value}" >`+
    `<br><br>` +
    // `<label>Group?</label>`+
    // `<input type="checkbox" name="groupCHK" value="group_true" ${checked}>` +
    `<br><br>` +
    `<label><input type="radio" id="normal" name="orderType" value="0" checked>` +
    `Normal</label><br>`+
    `<label><input type="radio" id="urgent" name="orderType" value="1" >` +
    `Urgent</label><br>`+
    `<label><input type="radio" id="fast" name="orderType" value="2" >` +
    `Fast</label><br>`+
    `<br><br>` +
    `<label>Program Name*</label><br>` +
    `<input class="cont" type="text" name="pname" value="${filename}">`+
    `<br><br>` +
    `<label>Material*</label><br>`+
    `<input class="cont" type="text" name="mat" value="${material}">` +
    `<br><br>` +
    `<label>Amount of Plates*</label><br>` +
    `<input class="cont" type="text" name="plateno" value="${plateInfo.plates}">`+
    `<br><br>` +  
    `<label>Total time* (min)</label><br>` +
    `<input class="cont" type="text" name="mtime" value="${plateInfo.time}" >`+
    `<br><br>` +
    `<label>Full Machine Name</label><br>` +
    `<input class="cont" type="text" name="fmname" value="${machFN.value}" >`+
    `<br><br>` +
    `<label>Orders* (seperate with a '+' eg. 259698+245698 or newline)</label><br>` +
    `<textarea rows="3" cols="48" name="order" form="usrform" >${Bemerkung.value.trim()}</textarea>`+
    `<br><br>` +
    `<p>* Necessary fields</p>` +
    `<p></p>` +
    `<input type="submit" value="Submit">`+
    `</form>`;

    
  }

  dropzone.ondrop = function(e) {
    e.preventDefault();
    this.className = 'dropzone dropped';
    //var types =  e.dataTransfer.types;
    var files = e.dataTransfer.files;
    var data = e.dataTransfer.items;

    var reader = new FileReader()
    var cFile = files[files.length-1]
    var cData = data[data.length-1]

    reader.readAsText(cData.getAsFile())
    reader.addEventListener("loadend", function(){

      var loadedFile = {
        name: cFile.name.split(".")[0],
        content: reader.result,
        len: reader.result.length,
        ext: cFile.name.split(".")[1]
      }

      fileInfo.push(loadedFile);
      var  currentFile = fileInfo[fileInfo.length-1]

      var fileObj = splitCont(currentFile)
      
      
      //getData(fileObj,getIndexOfObj(fileObj,partsInfoStrs,skipLine),name_value)
      //printTableObj(getData(fileObj,getIndexOfObj(fileObj,plateTechStrs,skipLine),name_value))
      //printTableObj(getData(fileObj,getIndexOfObj(fileObj,mainInfoStrs,skipLine),name_value))
      
      var main = getData(fileObj,getIndexOfObj(fileObj,mainInfoStrs,skipLine))
      var sub1 = getData(fileObj,getIndexOfObj(fileObj,plateTechStrs,skipLine))
      var sub2 = getData(fileObj,getIndexOfObj(fileObj,partsInfoStrs,skipLine))
      var test = multiData(fileObj,multiObj(fileObj,mainInfoStrs,skipLine))

      var testin = getValueADD(test,sqlElementMain)
      var plateInfo = sortOutMulti(testin)
      
      var mainInfo = getValue(main,sqlElementMain)
      var plateTech= getValue(sub1,sqlElementPlate)
      var partInfo = getValue(sub2,sqlElementPart)
      
     
      mainInfoForm(mainInfo,plateTech,partInfo,plateInfo,currentFile.name)
      //////////////////////////////////////////
      p.innerHTML =
              'Name: '    + currentFile.name  + '<br>' +
              'Content: ' + currentFile.ext   + '<br>' +
              'Size: '    + currentFile.len   + '<br>';
    });

  };


  dropzone.ondragover = function(){
    this.className = 'dropzone dragover'
    return false;
  };
  dropzone.ondragleave = function(){
    this.className = 'dropzone'
    return false;
  };


  //Post info back to server 
  function post(path,params,send,method){
    method = method || "post";
    send = send || false;
    if(send)
    { 
      var form = document.createElement("form")
      form.setAttribute("method",method)
      form.setAttribute("action", path)

      for (let key in params) {
        if(params.hasOwnProperty(key)){
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type","hidden")
          hiddenField.setAttribute("name",key);
          hiddenField.setAttribute("value",params[key])

          form.appendChild(hiddenField);
        }

      }
      document.body.appendChild(form)
      form.submit();
    }
  }

 

  
