<?php
$data = json_decode(file_get_contents("php://input"), TRUE);
// primire cerere de afisare proiecte
if(isset($data['initRequest']) && $data['initRequest'] == true){
    echo "cererea a fost declansata";
  // var_dump(http_response_code(200)); // se arunca eroare
}
// primire cerere de stergere
if(isset($data['taskToDelete'])){
    echo $data['taskToDelete'];
  // var_dump(http_response_code(200)); // se arunca eroare

}
    

?>