<?php
require 'vendor/autoload.php';
$data = json_decode(file_get_contents("php://input"), TRUE);

// primire cerere de afisare proiecte
if (isset($data['initRequest']) && $data['initRequest'] == true) {

  //echo "cererea a fost declansata";
  $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest");

  // lista proiectelor
  $interogare = "SELECT ?denumire WHERE {?proiect rdfs:label ?denumire}";
  $rezultate = $client->query($interogare);
  $proiecte = array();

  foreach ($rezultate as $rezultat) {
  //  json_encode($proiecte);
    // print($proiecte);
   print($rezultat->denumire."|");
  }
  // var_dump(http_response_code(200)); // se arunca eroare
}

// primire cerere de afisare taskuri
if (isset($data['retrieveTasks'])) {
  echo $data['retrieveTasks'];
  // var_dump(http_response_code(200)); // se arunca eroare
}


// primire cerere de stergere
if (isset($data['taskToDelete'])) {
  echo $data['taskToDelete'];
  // var_dump(http_response_code(200)); // se arunca eroare
}
if(isset($data['insertDenumireTask']) && isset($data['insertTask'])){
    $denumireTask = $data['insertDenumireTask'];
    $task = $data['insertTask'];
    //echo ['denumire'=>$denumireTask, 'task'=>$task];
    echo $denumireTask;
}
else{
    var_dump(http_response_code(500)); // se arunca eroare
}


