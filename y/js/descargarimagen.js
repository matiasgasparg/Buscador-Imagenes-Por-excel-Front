document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('enviar_btn').addEventListener('click', enviarArchivo);
    document.getElementById('descargar_zip').addEventListener('click', descargarZip);
    // Deshabilitar el botón de descarga al cargar la página
    document.getElementById('descargar_zip').disabled = true;
});

function enviarArchivo() {
    // Mostrar el modal al enviar el archivo
    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    var form_data = new FormData();
    var file_input = document.getElementById('archivo_excel').files[0];
    var nombre_columna = document.getElementById('nombre_columna').value;
    form_data.append('archivo_excel', file_input);
    form_data.append('nombre_columna', nombre_columna);

    fetch(`https://matiasgaspar.pythonanywhere.com/buscar_imagenes`, {
        method: 'POST',
        body: form_data
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('descargar_zip').disabled = false;
        } else {
            console.error('Error al enviar el archivo:', response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        var mensaje = document.getElementById('mensaje');
        mensaje.innerText = data.message;

        // Ocultar el modal después de completar la solicitud
        modal.style.display = "none";
    })
    .catch(error => console.error('Error:', error));
}

// Obtener el elemento para cerrar el modal y ocultarlo al hacer clic en la "x"
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
function descargarZip() {
    // Descargar el archivo ZIP
    fetch('https://matiasgaspar.pythonanywhere.com/descargar_zip')
    .then(response => {
        if (response.ok) {
            return response.blob(); // Convertir la respuesta en un objeto Blob
        } else {
            console.error('Error al descargar el archivo ZIP.');
        }
    })
    .then(blob => {
        // Crear un enlace de descarga para el usuario
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'downloads.zip';
        document.body.appendChild(a);
        a.click(); // Simular el clic en el enlace de descarga
        window.URL.revokeObjectURL(url); // Liberar recursos

        // Después de descargar el archivo ZIP, llamar a eliminar_zip en el backend
        fetch('https://matiasgaspar.pythonanywhere.com/eliminar_zip')
        .then(response => {
            if (response.ok) {
                console.log('Archivo ZIP eliminado correctamente.');
                document.getElementById('descargar_zip').disabled = true;

                // Llamar a limpiar_downloads en el backend después de eliminar el archivo ZIP
                fetch('https://matiasgaspar.pythonanywhere.com/limpiar_downloads')
                .then(response => {
                    if (response.ok) {
                        console.log('Contenido de la carpeta "downloads" eliminado correctamente.');
                    } else {
                        console.error('Error al limpiar la carpeta "downloads".');
                    }
                })
                .catch(error => console.error('Error al llamar a limpiar_downloads:', error));
            } else {
                console.error('Error al eliminar el archivo ZIP.');
            }
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error al descargar el archivo ZIP:', error));
}
