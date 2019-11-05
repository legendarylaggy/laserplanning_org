/**
 * send request to the specified url from a form. will change window location
 * @param {string} path  the path to send the post request to 
 * @param {object} params the paramiters to add to the url
 * @param {string} [method = post] the method to use on the form
 */

export function post(path,params,method){
    method = method || "post";

    var form = document.createElement("form")
    form.setAttribute("method",method)
    form.setAttribute("action", path)

    for (let keys in params) {
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
  