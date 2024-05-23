const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000; // Puerto para el servidor Express

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, // Puerto MySQL de XAMPP
    user: 'root',
    password: '',
    database: 'bibliotecaCuidatge'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

// Ruta para buscar libros
app.get('/buscar-libros', (req, res) => {
    const terminoBusqueda = req.query.q;

    // Verificar si se proporcionó un término de búsqueda válido
    if (!terminoBusqueda || terminoBusqueda.trim() === '') {
        return res.status(400).json({ error: 'Por favor, proporciona un término de búsqueda válido.' });
    }

    const query = `SELECT * FROM Libros WHERE titulo LIKE '%${terminoBusqueda}%'`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error al buscar libros' });
        }
        
        // Verificar si se encontraron resultados
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron libros que coincidan con el término de búsqueda proporcionado.' });
        }
        
        res.json(results);
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
$(document).ready(function() {
    $('#formulario-busqueda').submit(function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto
        
        const terminoBusqueda = $('#cercar').val();
        if (!terminoBusqueda) {
            alert('Por favor, ingresa un término de búsqueda');
            return;
        }

        // Realizar la solicitud al servidor Node.js
        $.get('/buscar-libros', { q: terminoBusqueda })
            .done(function(data) {
                mostrarResultados(data);
            })
            .fail(function(error) {
                console.error('Error al buscar libros:', error);
            });
    });
});

function mostrarResultados(resultados) {
    const $resultadosDiv = $('#resultados-busqueda');
    $resultadosDiv.empty(); // Limpiar resultados anteriores
    
    if (resultados.length === 0) {
        $resultadosDiv.text('No se encontraron libros que coincidan con el término de búsqueda.');
        return;
    }

    const $lista = $('<ul></ul>');
    resultados.forEach(function(libro) {
        const $li = $('<li></li>').text(libro.titulo);
        $lista.append($li);
    });
    $resultadosDiv.append($lista);
}