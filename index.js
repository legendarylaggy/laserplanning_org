// ** View sort 
// laser 
// pons
// index = order entry



var sql = require('mssql')
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

const port = 8080;
const hostname = '127.0.0.1'

var testServer = false

var config = {
  user: 'sa',
  password: 'job1!boss',
  server: 'slaapp01',
  port: '1433',
  database: 'SLABINCK',
  parseJSON: 'true',
};

var testDB = {
  user: 'sa',
  password: 'johnwalker32',
  server: 'localhost',
  database: 'master',
  parseJson: 'true'
}

var lastUser = ''

if (testServer == true) {
  config = testDB
}
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.render('index', {
//     title: 'Order Entry'
//   });
// });
// * Main System Management 
app.get('/', (req, res) => {
  //console.log(config)
  employeSQL(data => {
    //console.table(data.recordset)
    res.render('edit', {
      output: data.recordset,
      title: 'System Management'
    })
  })
});

app.post('/postInfo', (req,res) => {
  var inData = {
    gen1: req.body.id,
    gen2: req.body.verantw,
    gen3: req.body.opmerking
  }
  var gen = inData.gen1.split('.')
  console.log(lastUser)
  console.log(gen[0] + " " + gen[1])
  console.log(inData.gen2)
  console.log(inData.gen3)

  //var updateQuery = ""
  checkStatus(lastUser,gen[0],gen[1],data =>{
    if(data > 0){
      updateSQLValues(lastUser,gen[0],gen[1],inData.gen2,inData.gen3)
    }
    else{
      createNewSQLValues(lastUser,gen[0],gen[1],inData.gen2,inData.gen3)
    }
  })
  

  res.send('Done')
})

app.post('/employeeData', (req, res) => {

  var reqData = {
    user: req.body.user
  }
  lastUser = reqData.user
  var query = "SELECT * FROM [dbo].[Employee] where Employee ='" + reqData.user + "' order by Employee";
  var getGeneral = "select * from [dbo].[Skills_algemeen] where Employee ='" + reqData.user + "' order by Employee";
  var getKleinebew = "select * from [dbo].[Skills_Kleinebew] where Employee ='" + reqData.user + "'";
  var getLaserAfd = "select * from [dbo].[Skills_laserafdeling] where Employee ='" + reqData.user + "'";
  var getPlooiAfd = "select * from [dbo].[Skills_plooiafdeling] where Employee ='" + reqData.user + "'";
  var getPoederAfd = "select * from [dbo].[Skills_poederlakken] where Employee ='" + reqData.user + "'";
  var getPonsAfd = "select * from [dbo].[Skills_ponsafdeling] where Employee ='" + reqData.user + "'";
  
  
  (async function (){
    try {
        pool = await sql.connect(config);
        const res1 = await pool.request().query(query);
        //processQryA(res1);
        if(res1 != null){
         // console.table(res1.recordset)
        }
        const res2 = await pool.request().query(getGeneral);
        const res3 = await pool.request().query(getKleinebew);
        const res4 = await pool.request().query(getLaserAfd);
        const res5 = await pool.request().query(getPlooiAfd);
        const res6 = await pool.request().query(getPoederAfd);
        const res7 = await pool.request().query(getPonsAfd);
       // processQryB(res2);
       if(res7 != null){
       // console.table(res2.recordset)
        res.send({
          output:res1.recordset,
          output2:res2.recordset,
          output3:res3.recordset,
          output4:res4.recordset,
          output5:res5.recordset,
          output6:res6.recordset,
          output7:res7.recordset
        })
        sql.close()
      }
        //const res3 = await pool.request().query(getKleinebew);
       // processQryC(res3);
        //const res4 = await pool.request().query(getLaserAfd);
       // processQryD(res4);
        /*..And so on with rest of sequential queries*/
        /*Any of them resulting in error will be caught in (catch)*/

    } catch (error) {
        console.error("Error in start()::", error);
        sql.close()
    }
})()


  
  
  // fetchEmployeeData(query,getGeneral, data => {
  //   //console.table(data.data[0])
  //   res.send({
  //     output: data.recordset
  //   })
  // })
})


app.get('/sql', (req, res) => { // ? DEBUG INFO ?
  fetchLaserSQL(data => {
    console.table(data.recordset[0])
    res.render('index', {
      title: 'SQL RECIEVED',
      record: data
    })
  })
})

app.get('/sendSQLData', (req, res) => {
  //sendSQLData(data)
  fetchLaserSQL(data => {
    console.table(data.data[0])
    res.render('index', {
      title: 'SQL RECIEVED',
      record: data
    })
  })
})

// * Main Laser Display Link 
app.get('/laser', (req, res) => {
  fetchLaserSQL(data => {
    //console.table(data.recordset)
    res.render('laser', {
      output: data.recordset,
      title: 'laser'
    })
  })
});
// * Grab slq id row
app.get('/lineInfo', (req, res) => {
  fetchSQLID(data => {
    res.send(data.recordset)
  })
});
// * Main Pons Display Link 
app.get('/pons', (req, res) => {
  fetchPonsSQL(data => {
    res.render('pons', {
      output: data.recordset,
      title: 'pons'
    })
  })
});
app.get('/ponsn', (req, res) => {
  fetchPonsSQL(data => {
    res.render('ponsnew', {
      output: data.recordset,
      title: 'pons'
    })
  })
});
// * Edit Info for MIP,NESTING status and Error
app.post('/editInfo', (req, res) => {
  var nesting = req.body.order
  var value = req.body.value;
  var check = req.body.type;
  var valueComp = 0;

  if (check == 0) { // NESTING
    value++
    if (value > 2) {
      value = 0;
    }
    valueComp = value
    statement = 'UPDATE ProgramInput set jobComplete = @jobComplete where [nesting] = @nesting';
  } else if (check == 1) { // MIP
    if (value === false) {
      value = true
    } else if (value === "true") {
      value = false
    }
    statement = 'UPDATE ProgramInput set MIP = @MIP where [nesting] = @nesting';
  } else if (check == 2) { // ERROR
    if (value === false || value === 0 || value.trim() == "false") {
      value = true
    } else {
      value = false
    }
    statement = 'UPDATE ProgramInput set error = @error where [nesting] = @nesting';
  }

  (async function () {
    try {
      let pool = await sql.connect(config)
      let result = await pool.request()
        .input('jobComplete', sql.TinyInt, valueComp)
        .input('nesting', sql.VarChar, nesting)
        .input('MIP', sql.Bit, value)
        .input('error', sql.Bit, value)
        .query(statement, (err, result) => {
          sql.close()
          fetchLaserSQL(data => {
            sql.close();
            res.redirect(req.get('referer'));
          })
        })
    } catch (err) {
      if (err) console.dir(err)
      sql.close()
    }
  })()
})
// 
app.post('/submitInfo', (req, res) => {
  //Store requested data  
  var reqData = {
    machine: req.body.machine,
    type: req.body.type,
    client: req.body.client,
    groupOrder: "''",
    order: req.body.order,
    nesting: req.body.pname,
    material: req.body.mat,
    plates: req.body.plateno,
    machineTime: req.body.mtime,
    orderDate: new Date,
    desc: req.body.desc,
    machineName: req.body.fmname,
    priority: req.body.orderType
  }

  var outputDate = new Date;
  outputDate.setFullYear(3000)

  //random group number
  var randGroup = Math.floor((Math.random() * 100000000) + 1);
  reqData.groupOrder = randGroup;

  var connection = new sql.ConnectionPool(config, (err) => {
    reqData.order = reqData.order.replace(/\n/g, '+')
    reqData.order.split('+').forEach((element, i, arr) => {
      var fetch = element.trim()
      var query = 'SELECT [Job_Operation].[Sched_Start] as value FROM [dbo].[Job_Operation] where Job like ' + fetch + '  AND ( [Work_Center] = N\'FIBER 3030\' OR [Work_Center] = N\'LASER-6KW\' OR [Work_Center] = N\'LASER-5040\' OR [Work_Center] = N\'PONS\' OR [Work_Center] = N\'TC3000\' OR [Work_Center] = N\'TC5000\' OR [Work_Center] = N\'TC6000\' ) '

      if (element != null) {
        fetchSQLq(connection, query, data => {

          //console.log(data.recordset[0].value)
          if (typeof data != 'undefined' && data.recordset[0] != undefined) { // * DEB-1 check if sql returned value otherwise give current date 
            console.log("order: " + fetch)
            if (outputDate > data.recordset[0].value) {
              outputDate = data.recordset[0].value
              reqData.orderDate = outputDate
            }
          } else {
            reqData.orderDate = new Date;
            console.log("Error at DEB-1")
            console.log(fetch)
            console.log(typeof data)
          }
          //Save earliest date
          if (i == (arr.length - 1)) {
            reqData.order.split('+').forEach((element) => { //TODO lazy way - fix it
              pushSQL(connection, element, reqData)
            })
          }
        });
      }
    })
    sql.close();
  });
  res.render('index', {
    title: 'Order Entry'
  });
});

// * START SERVER
app.listen(port, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Grab Laser tables
function fetchLaserSQL(callback) {
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)

    // TODO Pons query function
    // ! Change this for Pons (where machineType = '2')
    req.query("SELECT * FROM [dbo].[ProgramInput] ORDER BY  jobComplete DESC , priority DESC, jobDate ASC, [nesting] ASC", (err, recordset) => {
      callback(recordset)
    })
  })
}


function fetchEmployeeData(query,newQ,callback) {
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)
    // console.log(err)
    req.query(query, (err, recordset) => {
      //console.log(err)
      callback(recordset)
    })
    req.query(newQ, (err, recordset) => {
      callback(recordset)
    })
  })

}

function employeSQL(callback) {
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)
    // console.log(err)
    // // TODO Pons query function
    // ! Change this for Pons (where machineType = '2')
    req.query("SELECT * FROM [dbo].[Employee] where Status = 'Active' order by First_Name ", (err, recordset) => {
      //console.log(err)
      callback(recordset)
    })
  })
}


// Grab one row
function fetchSQLID(callback) {
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)

    // TODO Pons query function
    // ! Change this for Pons (where machineType = '2')
    req.query("SELECT * FROM [dbo].[Employee] where Status = 'Active' order by First_Name ", (err, recordset) => {
      callback(recordset)
    })
  })
}


function checkStatus(employee,hfdnr,itemnr,callback) {
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)

    // TODO Pons query function
    // ! Change this for Pons (where machineType = '2')
    req.query("Select count(*) as rowAmount from skills_algemeen where employee = '" + employee +"' and hfdnr =" + hfdnr +" and itemnr =" + itemnr, (err, recordset) => {
      callback(recordset.recordset[0].rowAmount)
    })
  })
}
function updateSQLValues(employee,hfdnr,itemnr,verantw,opmerking) {
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)

    // TODO Pons query function
    // ! Change this for Pons (where machineType = '2')
    req.query("update skills_algemeen set ok = 1, verantw ='"+ verantw +"', opmerking = '"+ opmerking +"', signed = 1, tijdupdate = GETDATE() where employee = '" + employee +"' and hfdnr =" + hfdnr +" and itemnr =" + itemnr, (err, recordset) => {
      console.log(recordset.rowsAffected)
    })
  })
}
function createNewSQLValues(emp,hfdnr,itemnr,verantw,opmerking){
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)

    // TODO Pons query function
    // ! Change this for Pons (where machineType = '2')
    req.query("insert into skills_algemeen (employee,hfdnr, itemnr, ok, verantw, opmerking, signed, tijdupdate) Values('"+emp+"',"+hfdnr+","+itemnr+",1,'"+verantw+"','"+opmerking+"', 1, GETDATE())", (err, recordset) => {
      console.log(err)
      console.log(recordset)
    })
  })
  
}

// Grab Laser tables
function fetchPonsSQL(callback) {
  var connection = new sql.ConnectionPool(config, (err) => {
    var req = new sql.Request(connection)

    // TODO Pons query function
    // ! Change this for Pons (where machineType = '2')
    req.query("SELECT * FROM [dbo].[ProgramInput] WHERE machineType = '2'  ORDER BY  jobComplete DESC , priority DESC, jobDate ASC, [nesting] ASC", (err, recordset) => {
      callback(recordset)
    })
  })
}

//Grab selected tables + pass open connection
function fetchSQLq(connection, query, callback) {
  var req = new sql.Request(connection)
  req.query(query, (err, recordset) => {
    callback(recordset)
  })
}

// push full table info  + pass connection
const pushSQL = (connection, order, input) => {
  var req = new sql.Request(connection)
    //.input('id', sql.Int, 4)
    .input('machineID', sql.VarChar, input.machine)
    .input('machineType', sql.TinyInt, input.type)
    .input('client', sql.VarChar, input.client)
    .input('jobOrder', sql.VarChar, order)
    .input('group', sql.Bit, 0) //NOT USED
    .input('groupOrder', sql.VarChar, input.groupOrder) // Randomly generated number 
    .input('nesting', sql.VarChar, input.nesting)
    .input('material', sql.VarChar, input.material)
    .input('plateAmount', sql.Int, input.plates)
    .input('programTime', sql.Float, input.machineTime)
    .input('description', sql.VarChar, input.desc)
    .input('FullMachineName', sql.VarChar, input.machineName)
    .input('priority', sql.TinyInt, input.priority)
    .input('jobComplete', sql.TinyInt, 1) //Default
    .input('jobDate', sql.DateTime, input.orderDate)
    .query('INSERT INTO ProgramInput(machineID, machineType, client, jobOrder, nesting, material,plateAmount,programTime,description,FullMachineName,jobDate,priority ,jobComplete,groupOrder)  values (@machineID, @machineType, @client, @jobOrder, @nesting, @material, @plateAmount,@programTime,@description,@FullMachineName,@jobDate, @priority , @jobComplete,@groupOrder)', (err, result) => {
      if (err) console.log(err);
      sql.close();
    })
}