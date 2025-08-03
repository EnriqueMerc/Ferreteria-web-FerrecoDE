// --- Variables Globales ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const contadorCarrito = document.getElementById('contador-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');

// --- Añadir al carrito ---
function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarPopup(`${nombre} agregado al carrito`);
    actualizarContador();
}

// --- Mostrar contador ---
function actualizarContador() {
    if (contadorCarrito) {
        contadorCarrito.textContent = carrito.length;
    }
}

// --- Mostrar carrito en Carrito.html ---
if (listaCarrito && totalCarrito) {
    mostrarCarrito();
}

function mostrarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.nombre} - C$ ${item.precio}
            <button onclick="eliminarProducto(${index})" style="margin-left: 10px; background-color: #FF3B3F; color: white; border: none; border-radius: 5px;">❌ Eliminar</button>
        `;
        listaCarrito.appendChild(li);
        total += item.precio;
    });
    totalCarrito.innerHTML = `<h3>Total: C$ ${total.toFixed(2)}</h3>`;
    actualizarContador();
}

// --- Vaciar carrito ---
const botonVaciar = document.querySelector('.vaciar-carrito');
if (botonVaciar) {
    botonVaciar.addEventListener('click', () => {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        mostrarPopup("Carrito vaciado");
    });
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    mostrarPopup("Producto eliminado del carrito");
}

// --- Notificación tipo popup ---
function mostrarPopup(mensaje) {
    const popup = document.createElement('div');
    popup.textContent = mensaje;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '15px 20px';
    popup.style.backgroundColor = '#4CD964';
    popup.style.color = 'white';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    popup.style.zIndex = 9999;
    popup.style.fontFamily = `'Comic Sans MS', sans-serif`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2500);
}

// --- Mostrar formulario de pago ---
function mostrarPago() {
    const pagoDiv = document.getElementById("pagoContainer");
    if (pagoDiv) {
        pagoDiv.style.display = "block";
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
}

// --- Mostrar campos según método ---
function mostrarCampos() {
    const metodo = document.getElementById("metodo").value;
    const detallesDiv = document.getElementById("detallesPago");
    detallesDiv.innerHTML = "";

    if (metodo === "tarjeta") {
        detallesDiv.innerHTML = `
            <label for="nombre">Nombre en la tarjeta:</label>
            <input type="text" id="nombre" required>

            <label for="numero">Número de tarjeta:</label>
            <input type="text" id="numero" maxlength="16" required>

            <label for="cvv">CVV:</label>
            <input type="number" id="cvv" maxlength="3" required>

            <label for="expiracion">Fecha de expiración:</label>
            <input type="text" id="expiracion" placeholder="MM/AA" required>
        `;
    } else if (metodo === "transferencia") {
        detallesDiv.innerHTML = `
            <p>Realiza la transferencia a:</p>
            <ul>
                <li>Banco: BAC Credomatic</li>
                <li>Cuenta: 123-456-789</li>
                <li>Titular: Ferretería El Chele Pumba</li>
            </ul>
            <label for="comprobante">Número de comprobante:</label>
            <input type="text" id="comprobante" required>
        `;
    } else if (metodo === "efectivo") {
        detallesDiv.innerHTML = `
            <p>Has seleccionado pago en efectivo. Podrás pagar al recibir o retirar el producto.</p>
        `;
    }
}

// --- Confirmar Pago ---
function confirmarPago() {
    const metodo = document.getElementById("metodo").value;
    if (!metodo) {
        mostrarPopup("❗ Por favor selecciona un método de pago.");
        return;
    }

    if (carrito.length === 0) {
        mostrarPopup("❗ Tu carrito está vacío.");
        return;
    }

    let total = carrito.reduce((sum, item) => sum + item.precio, 0);
    let metodoTexto = metodo === "tarjeta" ? "Tarjeta" :
    metodo === "transferencia" ? "Transferencia" : "Efectivo";

    mostrarPopup(`✅ Compra realizada con ${metodoTexto}. Total: C$ ${total.toFixed(2)}`);

    // Vaciar carrito
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));

    if (listaCarrito) listaCarrito.innerHTML = '';
    if (contadorCarrito) contadorCarrito.textContent = '0';
    if (totalCarrito) totalCarrito.innerHTML = `<h3>Total: C$ 0.00</h3>`;

    // Ocultar formulario
    const pagoDiv = document.getElementById("pagoContainer");
    if (pagoDiv) pagoDiv.style.display = "none";
}

function redirigir() {
    window.location.href = "https://wa.me/50582836794";

}

function buscarProducto() {
const termino = document.getElementById("buscador").value.toLowerCase().trim();
const productos = document.querySelectorAll(".producto");

productos.forEach(producto => {
    const nombre = producto.querySelector("h3").textContent.toLowerCase();
    const coincide = nombre.includes(termino);
    producto.style.display = coincide ? "block" : "none";
});
}
document.getElementById("buscador").addEventListener("input", buscarProducto);