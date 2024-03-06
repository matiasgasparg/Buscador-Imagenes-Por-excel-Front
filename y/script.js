document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('enviar_btn').addEventListener('click', enviarArchivo);
    document.getElementById('descargar_zip').addEventListener('click', descargarZip);
    // Deshabilitar el botón de descarga al cargar la página
    document.getElementById('descargar_zip').disabled = true;
});

function enviarArchivo() {
    var form_data = new FormData();
    var file_input = document.getElementById('archivo_excel').files[0];
    var nombre_columna = document.getElementById('nombre_columna').value;
    form_data.append('archivo_excel', file_input);
    form_data.append('nombre_columna', nombre_columna);

    fetch('http://matiasgaspar.pythonanywhere.com/buscar_imagenes', {
        method: 'POST',
        body: form_data
    })
    .then(response => {
        if (response.ok) {
            // Si la respuesta del servidor es exitosa (código de estado 200),
            // habilitar el botón de descarga ZIP
            document.getElementById('descargar_zip').disabled = false;
        } else {
            console.error('Error al enviar el archivo:', response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Mostrar el mensaje en la página
        var mensaje = document.getElementById('mensaje');
        mensaje.innerText = data.message;
    })
    .catch(error => console.error('Error:', error));
}

function descargarZip() {
    // Descargar el archivo ZIP
    fetch('http://matiasgaspar.pythonanywhere.com/descargar_zip')
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
        fetch('http://matiasgaspar.pythonanywhere.com/eliminar_zip')
        .then(response => {
            if (response.ok) {
                console.log('Archivo ZIP eliminado correctamente.');
                document.getElementById('descargar_zip').disabled = true;

                // Llamar a limpiar_downloads en el backend después de eliminar el archivo ZIP
                fetch('http://matiasgaspar.pythonanywhere.com/limpiar_downloads')
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
