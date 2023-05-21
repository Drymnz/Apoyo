
function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        parser(contenido);
    };
    lector.readAsText(archivo);
}

function mostrarContenido(contenido) {
    var elemento = document.getElementById('contenido-archivo');
    elemento.innerHTML = contenido;
}

document.getElementById('file-input').addEventListener('change', leerArchivo, false);



function parser(params) {

    //const fs = require('fs'); // liberia para lectura de archivos

    /* if (process.argv[2] == undefined) {// para ver que hay un archivo
       console.log("Ingres algo correcto esta mal");
       process.exit(1);
   } */

    //const filename = process.argv[2];//colocar el argumento en esta constante */
    //const filetext = fs.readFileSync(params).toString();// pasar el texto almacenado

    const allline = params.split('\n');// separar por lineas el archivo


    const headLine = allline[0];// obtener solo la primera linea que es la cabezera
    const dataLine = allline.slice(1);// toma de la possicion de un arrey to end

    const fielNames = headLine.split(',');

    let objList = [];// listado de objetos

    for (let i = 0; i < dataLine.length; i++) {
        let obj = {};//new object
        if (dataLine[i] === "") {
            continue;
        }
        const data = dataLine[i].split(',');
        for (let j = 0; j < fielNames.length; j++) {
            if (data[j]=== "") {
                obj[fielNames[j].toString()] = "0";//ingres el dato
            }else{
                const asNumber = Number(data[j]);//intenta convertir a numero
                obj[fielNames[j].toString()] = (isNaN(asNumber)) ? data[j] : asNumber;//ingres el dato
            }
        }
        objList.push(obj);
    }

    const jsonText = JSON.stringify(objList, null, 2);
    pintara(objList, fielNames)
    //const outPutFile = filename.replace(".csv", ".json");
    //fs.writeFileSync(outPutFile, jsonText);
    //mostrarContenido(jsonText);
}

function pintara(objList, cabezera) {
    let resultAPI = objList;
    //Estos son los for a lo que te refieres y que no se repita ✅
    //Object.keys() para obtener un array de key ["Titulo A1", "Titulo A2", ...]
    let arrtitle = []
    resultAPI.forEach(item => {
        Object.keys(item).forEach(nameKey => {
            if (!arrtitle.includes(nameKey)) {
                arrtitle.push(nameKey)
            }
        })
    })
    //usando método nativo map() para recorrer array y  "template strings" para obtener una cadena. Reduce mucho código
    let htmlTitle = arrtitle.map(item => {
        return `<th>${item}</th>`
    }).join('');
    //Ahora con el detalle, map() y Template String usando ``
    let htmlRows = resultAPI.map(item => {
        let valueRow = arrtitle.map(nameTitle => {
            //valido los valores por titulo, si no existe devuelvo un string vacío
            return `<td>${(item[nameTitle] == undefined) ? "" : item[nameTitle]}</td>`
        })
        return `<tr>${valueRow.join('')}</tr>`
    }).join('')
    //Finalmente lo pinto en table
    document.getElementsByClassName("table")[0].innerHTML = htmlTitle + htmlRows


    ///

    $(document).ready(() => {
        $('th').hover(function () {
            let indiceColumna = $(this).parent().children().index(this);
            $(this).addClass('resaltar');
            $(`table td:nth-child(${indiceColumna + 1})`).addClass('resaltar');
        }, function () {
            $('table tr').children().removeClass('resaltar');
        });

        $('th').click(function () {
            $(this).hide();
            let indiceColumna = $(this).parent().children().index(this);
            $(`table td:nth-child(${indiceColumna + 1})`).remove();
            $(this).remove();
        });
    });

    $(document).ready(() => {
        $('tbody tr').hover(function () {
            $(this).find('td').addClass('resaltar');
        }, function () {
            $(this).find('td').removeClass('resaltar');
        });

        $('tbody tr').click(function () {
            //let indiceColumna = $(this).parent().children().index(this);
            if ($(this).parent().children().index(this) > 0) {
                $(this).hide();
            }
        });
    });
}


function table_CSV() {

    var csv_data = [];

    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {

        var cols = rows[i].querySelectorAll('td,th');

        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {

            csvrow.push(cols[j].innerHTML);
        }

        csv_data.push(csvrow.join(","));
    }

    csv_data = csv_data.join('\n');

    descargaCSV(csv_data);

}

function descargaCSV(csv_data) {

    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    var temp_link = document.createElement('a');

    temp_link.download = "baulphp.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    temp_link.click();
    document.body.removeChild(temp_link);
}