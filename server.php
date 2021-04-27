<?php
require 'vendor/autoload.php';

$data = json_decode(file_get_contents("php://input"), TRUE);
//---------------------------------------------------------------
//---------------------------------------------------------------
// primire cerere de afisare proiecte
if (isset($data['initRequest']) && $data['initRequest'] == true) {
  $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest");
  //echo "cererea a fost declansata";

  // lista proiectelor
  $interogare = "SELECT ?denumire WHERE {?proiect rdfs:label ?denumire}";
  $rezultate = $client->query($interogare);
  $proiecte = array();

  foreach ($rezultate as $rezultat) {
    //  json_encode($proiecte);
    // print($proiecte);
    print($rezultat->denumire . "|");
  }
  // var_dump(http_response_code(200)); // se arunca eroare
}

// primire cerere de afisare taskuri
if (isset($data['retrieveTasks'])) {
  echo $data['retrieveTasks'];
  // var_dump(http_response_code(200)); // se arunca eroare
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
// primire cerere de stergere
if (isset($data['project']) && isset($data['taskToDelete'])) {
  $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest/statements");

  $deleteStatement = "prefix : <http://Alex&Andrei.ro#>
  DELETE {?prjName :deRealizat :" . $data['taskToDelete'] . "} WHERE {?prjName rdfs:label '".$data['project'] ."'}";
  $client->update($deleteStatement);
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
// primire cerere de update
if (isset($data['project']) &&isset($data['taskToUpdate'])) {
  $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest/statements");

   $updateStatement1 = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
   prefix : <http://Alex&Andrei.ro#>
   DELETE WHERE {
      :cautareDate :esteRealizat ?bol.
   }
   ";
 $client->update($updateStatement1);
 $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest/statements");
  $updateStatement2 = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  prefix : <http://Alex&Andrei.ro#>
  INSERT{
    :cautareDate :esteRealizat [:'true'^^xsd:boolean].
  }
  WHERE{
    ?prjName rdfs:label 'Business Intelligence'.
  }
 
  ";
  $client->update($updateStatement2);
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
// primire cerere de inserare
if (
  isset($data['project']) && isset($data['insertDenumireTask']) && isset($data['insertDescriereTask']) && isset($data['insertTermenTask'])
  && isset($data['insertImagineTask'])
) {
  $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest/statements");

  $insertStatement = "prefix : <http://Alex&Andrei.ro#>
   INSERT {
     ?prjName :deRealizat :" . $data['insertDenumireTask'] . ". 
     :" . $data['insertDenumireTask'] . " 
     :areTermenLimita [:'" . $data['insertTermenTask'] . "'^^xsd:date]; 
     :esteRealizat [:'false'^^xsd:boolean]; :areImagine '" . $data['insertImagineTask'] . "'.} WHERE {?prjName rdfs:label '" . $data['project'] . "'}";
  $client->update($insertStatement);
}
//----------------------------------------------------------------------

