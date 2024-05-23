<?php
$servername = "localhost";
$username = "tu_usuario";
$password = "tu_contraseña";
$dbname = "biblioteca";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$busqueda = $_POST['cercar'];
$sql = "SELECT * FROM libros WHERE titulo LIKE ? OR autor LIKE ? OR descripcion LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%".$busqueda."%";
$stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo "<h2>Resultats de la cerca:</h2>";
    while($row = $result->fetch_assoc()) {
        echo "<div>";
        echo "<h3>" . $row['titulo'] . "</h3>";
        echo "<p>Autor: " . $row['autor'] . "</p>";
        echo "<p>Any: " . $row['anyo'] . "</p>";
        echo "<p>Descripció: " . $row['descripcion'] . "</p>";
        echo "</div>";
    }
} else {
    echo "No s'han trobat resultats.";
}

$conn->close();
?>
