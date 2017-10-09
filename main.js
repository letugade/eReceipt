/*var button = document.createElement("button");
button.innerHTML = "Do Something";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);*/
var counter = 0;
function getID()
{
    var present = new Date();
    var y = present.getFullYear();
    var d = present.getDate();
    var m = present.getMonth() + 1;
    counter = counter + 1;
    if (m < 10 && d < 10)
    {
        var date = y + "0" + d + "0" + m;
    }
    else if (m < 10)
    {
        var date = y + "" + d + "0" + m;        
    }
    else if (d < 10)
    {
        var date = y + "0" + d + "" + m;
    }
    var ID = date;
    if (counter < 1000 && counter > 100)
    {
        ID += "0"
    } 
    else if (counter < 100 && counter > 10)
    {
        ID += "00"
    }
    else if (counter < 10 && counter > 0)
    {
        ID += "000"        
    }
    ID += "" + counter;
    return ID;
}
function getItems()
{
    var name = "";
    var tmpStr = ""
    var newObj = {};
    var product = [];
    var products = [];
    var table = document.getElementById("reciept");
    
    //gets rows of table
    var rLength = table.rows.length;
    //loops through rows    
    for (var i = 1; i < rLength; i++)
    {
       product = [];
      //gets cells of current row  
       var currentRow = table.rows.item(i).cells;

       //gets amount of cells of current row
       var rowLength = currentRow.length;

       //loops through each cell in current row
       for(var j = 0; j < rowLength; j++)
       {
           product.push(currentRow.item(j).innerHTML);
       }
       if (product[1] == 1)
       {
           /*var sIndent = product[0];
           var newObj = JSON.parse('{"' + sIndent.trim() + '":' + product[2] + '}');
           products.push(newObj);*/
           var sIndent = product[0];
           newObj[i] = product[2]// = JSON.parse('{"' + sIndent.trim() + '":' + product[2] + '}');
           tmpStr += '"' + sIndent.trim() + '":' + product[2] + ','
       }
       else
       {
            var indent = (product[0].trim() + ' x ' + product[1] + "");
            newObj[i] = product[2]// += JSON.parse('{"' + indent.trim() + '":' + product[2] + '}');
            tmpStr += '"' + indent.trim() + '":' + product[2] + ','
            //console.log('{"' + indent.trim() + '":' + product[2] + '}');
            //var name = JSON.parse('{"' + indent.trim() + '":' + product[2] + '}');
            //products.push(name);
       }
    }
return JSON.parse('{'+tmpStr.substr(0, tmpStr.length-1)+'}');
}
function round(total)
{
    total *= 100;
    total = Math.round(total);
    total /= 100;
    return total;
}
function floor(total)
{
    total *= 100;
    total = Math.floor(total);
    total /= 100;
    return total;
}
function getTotal()
{
    var products = getItems();
    var arrayTotal = [];
    var total = 0;
    var objTotal = {};
    var objService = {};
    var objGST = {};
    var objSummary = {};
    for (var i = 0; i < products.length; i++)
    {
        total += products[i][Object.keys(products[i])[0]];
    }
    objTotal.Total = round(total);
    objTotal.Service = round(total * 0.1);
    objTotal.GST = round(total * 0.07);
    objTotal.Summary = round(total + total * 0.1 + total * 0.07);
    return objTotal;
}
function generateQR()
{
    var seller = "McDonalds";
    var table = document.getElementById("reciept");
    var rLength = table.rows.length;
    if (rLength > 1)
    {
        var qrData = {};
        qrData.seller = seller;
        qrData.id = getID();
        qrData.items = getItems();
        qrData.total = getTotal();
        var JsonString = JSON.stringify(qrData);
        var qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
        qrURL += JsonString;
        var qrCode = document.createElement("img");
        qrCode.style = "padding-left: 110px; padding-top: 10px";
        qrCode.src = qrURL;
        var main = document.getElementById("main");
        main.appendChild(qrCode);
        console.log(JsonString);
    }
    else
    {
        alert("No data");
    }
}
function addItem()
{
    var table = document.getElementById("reciept");
    var name = document.getElementById("name").value.trim();
    var bought = document.getElementById("bought").value;
    var price = document.getElementById("price").value;
    document.getElementById("name").value = "";
    document.getElementById("bought").value = "";
    document.getElementById("price").value = "";
    var tr = document.createElement("tr");
    var add = true;
    var err;
    var tdValues = [name, bought, price];
    tdValues[2] = floor(tdValues[2]);
    var td = [];
    for (var i = 0; i < tdValues.length; i++)
    {
        if ( i == 0 || (i == 1 && tdValues[i] == parseInt(tdValues[i], 10)))
        {
            if (i == 0)
            {
            var rLength = table.rows.length;
            for (var c = 1; c < rLength; c++)
            {
                var currentRow = table.rows.item(c).cells
                if (currentRow.item(0).innerHTML.trim() == tdValues[0])
                {
                    alert("Invalid Entry!");
                    add = false;
                }
            }
                var tdTemp = document.createElement("td");
                tdTemp.innerHTML = tdValues[i] + "";
                td.push(tdTemp);
            } 
            else 
            {
                var tdTemp = document.createElement("td");
                tdTemp.innerHTML = tdValues[i] + "";
                td.push(tdTemp);
            }
        }
        else if(i == 2 && (tdValues[i] == parseFloat(tdValues[i], 10)))
        {
            if (tdValues[i] == parseInt(tdValues[i], 10))
            {
                tdValues[i] += "" + ".00";
            }
            else if (tdValues[i] * 10 == parseInt(tdValues[i] * 10, 10))
            {
                tdValues[i] += "" + "0";
            }
            var tdTemp = document.createElement("td");
            tdTemp.innerHTML = tdValues[i] + "";
            td.push(tdTemp);
        }
        else
        {
            alert("Invalid Entry!");
            add = false;
            break;
        }
    }
    if (add == true)
    {
        var tbody = document.getElementById("tableBody");
        tbody.appendChild(tr);
        for(var j = 0; j < td.length; j++)
        {
            tr.appendChild(td[j]);        
        }
    }
}