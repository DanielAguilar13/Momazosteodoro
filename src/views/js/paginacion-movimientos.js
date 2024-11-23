document.addEventListener('DOMContentLoaded', function() {
    const recordsPerPage = 8;  // Número de elementos por página
    let currentPage = 1;  // Página actual
    let totalPages = 0;  // Total de páginas
    let allRecords = [];  // Almacenará todos los movimientos

    // Función para cargar los movimientos
    fetch('/movimiento')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allRecords = data;  // Guardamos los movimientos
            totalPages = Math.ceil(allRecords.length / recordsPerPage);  // Calculamos el total de páginas
            renderPagination();  // Renderizamos los botones de paginación
            renderTable();  // Renderizamos la primera página de la tabla
        })
        .catch(error => console.error('Error al obtener los datos:', error));

    // Función para mostrar la tabla con los movimientos
    function renderTable() {
        const start = (currentPage - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const pageRecords = allRecords.slice(start, end);  // Filtramos los movimientos para la página actual

        const tabla = document.getElementById('tabla-datos');
        tabla.innerHTML = '';  // Limpiamos la tabla antes de agregar los nuevos datos

        pageRecords.forEach(item => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${item.concepto}</td>
                <td>${item.cantidad}</td>
                <td>${item.id_categoria}</td>
                <td>${item.id_tipo}</td>
                <td>${item.id_tarjeta}</td>
                <td>${item.fecha}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="editarMovimiento(${item.id})">✏️</button>
                    <button class="btn btn-delete" onclick="eliminarMovimiento(${item.id})">🗑️</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    // Función para actualizar los botones de paginación
    function renderPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';  // Limpiamos la paginación

        // Botón anterior
        const prevButton = document.createElement('button');
        prevButton.classList.add('prev');
        prevButton.innerText = '«';
        prevButton.disabled = currentPage === 1;  // Deshabilitamos si estamos en la primera página
        prevButton.addEventListener('click', () => changePage(currentPage - 1));
        pagination.appendChild(prevButton);

        // Generar botones para cada página
        const pageButtons = generatePageButtons(totalPages);
        pageButtons.forEach(button => {
            pagination.appendChild(button);
        });

        // Botón siguiente
        const nextButton = document.createElement('button');
        nextButton.classList.add('next');
        nextButton.innerText = '»';
        nextButton.disabled = currentPage === totalPages;  // Deshabilitamos si estamos en la última página
        nextButton.addEventListener('click', () => changePage(currentPage + 1));
        pagination.appendChild(nextButton);
    }

    // Función para generar los botones de las páginas
    function generatePageButtons(totalPages) {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('page');
            pageButton.innerText = i;
            pageButton.setAttribute('data-page', i);
            pageButton.addEventListener('click', () => changePage(i));
            if (i === currentPage) {
                pageButton.classList.add('active');  // Resaltamos la página actual
            }
            buttons.push(pageButton);
        }
        return buttons;
    }

    // Función para cambiar de página
    function changePage(page) {
        if (page < 1 || page > totalPages) return;  // Validamos que la página esté dentro del rango
        currentPage = page;  // Actualizamos la página actual
        renderTable();  // Renderizamos la tabla
        renderPagination();  // Actualizamos los botones de paginación
    }
});