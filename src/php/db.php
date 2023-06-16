<?php
class DB
{
    private $host = "localhost";
    private $user = "root";
    private $password = "";
    private $dbname = "library_plus";
    private $port = "3306";
    private $socket = "";
    private $conn;
    private $stmt;
    public function __construct()
    {
        //  (Data Source Name), establece la conexión a la base de datos. En este caso, se establece en false para deshabilitar la emulación y utilizar consultas preparadas de manera nativa.
        $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->dbname . ";port=" . $this->port . ";charset=utf8mb4";
        $options = [
                // Establece si se deben emular las consultas preparadas o no.
            PDO::ATTR_EMULATE_PREPARES => false,
                // Establece el modo de manejo de errores. En este caso, se establece en PDO::ERRMODE_EXCEPTION para que se lancen excepciones en caso de error.
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                //  Establece el modo de recuperación de filas por defecto cuando se recuperan los resultados de una consulta. En este caso, se establece en PDO::FETCH_ASSOC para que los resultados se devuelvan como un array asociativo.
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        try {
            // Crear una nueva instancia de PDO pasando el DSN, usuario y contraseña.
            $this->conn = new PDO($dsn, $this->user, $this->password, $options);
        } catch (PDOException $e) {
            // Capturar el error.
            throw new PDOException($e->getMessage(), (int) $e->getCode());
        }
    }
    // Permite ejecutar una consulta.
    public function query($query)
    {
        $this->stmt = $this->conn->prepare($query);
    }
    // Permite vincular parámetros a una consulta de manera segura.
    public function bind($param, $value, $type = null)
    {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }
    //  Permite ejecutar una consulta preparada.
    public function execute()
    {
        return $this->stmt->execute();
    }
    // Permite obtener todas las filas de un conjunto de resultados de una consulta SELECT.
    public function resultSet()
    {
        $this->execute();
        return $this->stmt->fetchAll();
    }
    // Permite obtener una sola fila.
    public function single()
    {
        $this->execute();
        return $this->stmt->fetch();
    }
    // Permite btener el número de filas afectadas por una consulta.
    public function rowCount()
    {
        return $this->stmt->rowCount();
    }
    // Permite obtener el ID del último registro insertado.
    public function lastInsertId()
    {
        return $this->conn->lastInsertId();
    }
    // Permite iniciar una transacción.
    public function beginTransaction()
    {
        return $this->conn->beginTransaction();
    }
    // Permite finalizar una transacción.
    public function endTransaction()
    {
        return $this->conn->commit();
    }
    // Permite cancelar una transacción.
    public function cancelTransaction()
    {
        return $this->conn->rollBack();
    }
    // se utiliza para imprimir información detallada sobre una consulta preparada.
    public function debugDumpParams()
    {
        return $this->stmt->debugDumpParams();
    }
    public function close()
    {
        $this->conn = null;
    }
}