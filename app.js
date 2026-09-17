let products = [];

const form = document.querySelector('form');


const guardado = localStorage.getItem('prodjson');
try {
    if (guardado) products = JSON.parse(guardado);
} catch {
    products = [];
}
renderLista();
renderHojas();
//const caja = document.querySelector('#barcodetest');

//localStorage.clear();

function EAN(caja, ean) {

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    caja.appendChild(svg);
    let formato
    if (ean.length == 12 || ean.length == 13) formato = 'EAN13'
    else if (ean.length == 7 || ean.length == 8) formato = 'EAN8'
    else formato = 'CODE128'


    try {
        JsBarcode(svg, ean, { format: formato, height: 50, margin: 0 });   // intento con el formato correcto
    } catch {
        svg.innerHTML = '';                                                // limpio el intento fallido
        try {
            JsBarcode(svg, ean, { format: 'CODE128', height: 50, margin: 0 });  // plan B
        } catch {
            caja.textContent = '⚠ código inválido';                          // ni eso: aviso y sigo
        }
    }
}



// esta funcion toma el input del usuario para meterlo en el array con sus resultados//
function Products(sku, ean, nombre, cant) {
    this.sku = sku
    this.ean = ean
    this.nombre = nombre
    this.cant = cant

}
// esto sirve para que no se borren los valores del cache al reiniciar la pagina77
function guardar() {
    localStorage.setItem('prodjson', JSON.stringify(products));

}
//esta parte se encarga de mostrar la lista de texto con los productos//
function renderLista() {
    const lista = document.querySelector('ul')
    lista.textContent = ''
    for (const prod of products) {
        let li = document.createElement('li');
        li.textContent = `${prod.sku} — ${prod.nombre} (x${prod.cant})`;
        lista.appendChild(li)
    }
}
// Esta parte se encarga de colgar en la pagina las etiquetas para que se pueda ver que resultado esta quedando//
function renderHojas() {
    const cont = document.querySelector('#hojas');
    cont.innerHTML = '';
    const perPage = 8;
    for (let k = 0; k < products.length; k += perPage) {
        const bloque = products.slice(k, k + perPage);
        const hoja = document.createElement('div');
        hoja.className = 'hoja';
        cont.appendChild(hoja)
        for (const prod of bloque){
            
                let div = document.createElement('div')
                div.className = 'etiqueta'
                hoja.appendChild(div)
                let sku = document.createElement('div')
                sku.className = 'et__sku'
                sku.textContent = prod.sku
                div.appendChild(sku)
                let ean = document.createElement('div')
                ean.className = 'et__ean'
                ean.textContent = prod.ean
                div.appendChild(ean)
                let nombre = document.createElement('div')
                nombre.className = 'et__nombre'
                nombre.textContent = prod.nombre
                div.appendChild(nombre)
                let big = document.createElement('div')
                big.className = 'et__big'
                big.textContent = prod.sku.slice(-3)
                div.appendChild(big)
                let barcode = document.createElement('div')
                barcode.className = 'et__barcode'
                div.appendChild(barcode)
                EAN(barcode, prod.ean)

            
        }
    }
}
function importar_excel(){
    let abc = document.querySelector("textarea").value
    let separado = abc.split("\n")  
    for (const linea of separado){
        if (linea.trim() === '') continue; 
        let columnas = linea.split("\t")
        let prod ={
            sku : columnas[0],
            ean : columnas[1],
            nombre : columnas[2],
            cant : 1
        }
        products.push(prod)
        console.log(products)
        
    };

    /*leer el texto del textarea (.value)
    
    cortarlo por saltos de línea → array de líneas
    para cada línea:
        cortarla por tabuladores → [sku, ean, nombre]
        armar la ficha { sku, ean, nombre, cant: 1 }
        pushearla a products
        */
    guardar()
    renderLista()
    renderHojas()
    console.log(abc)
    }
document.querySelector('#btnPrint').addEventListener('click', function () {
  window.print();
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const sku = document.querySelector('#inSKu').value
    const ean = document.querySelector('#inEAN').value
    const name = document.querySelector('#inName').value
    const cant = document.querySelector('#inCant').value
    const prod = new Products(sku, ean, name, cant)

    products.push(prod)
    guardar()
    //EAN(caja,prod.ean)
    renderLista()
    renderHojas()
    form.reset()
    document.querySelector('#inSKu').focus();
    console.log(products);

});


document.querySelector('#btnImport').addEventListener('click',importar_excel);

document.querySelector('#btnVaciar').addEventListener('click', function () {
 if (confirm('¿Vaciar toda la plancha? Esto borra todos los productos.')){
  products = [];        
  guardar();            
  renderLista();        
  renderHojas(); }     
});



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}