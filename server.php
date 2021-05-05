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
   // array_push($proiecte,$rezultat->denumire->localName());
     array_push($proiecte,$rezultat->denumire->__toString());
  //  print($rezultat->denumire . "|");
  }
   echo json_encode($proiecte);
   
  
}

// primire cerere de afisare taskuri
if (isset($data['retrieveTasks'])) {

    //eliminare spatiu dintre cuvinte
    $proiectul=str_replace(' ','',$data['retrieveTasks']);
    $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest");
    $interogare = "PREFIX : <http://Alex&Andrei.ro#>
SELECT ?task ?relatie ?valoare ?imagine ?descriere WHERE {
  ?task ?relatie ?nod.
  ?task :areImagine ?imagine.
  ?task :areDescriere ?descriere.
  ?nod <http://Alex&Andrei.ro#> ?valoare.
  {
  SELECT ?task WHERE {
   :".$proiectul."?relation ?task. 
  }
}
}";
    $rezultate = $client->query($interogare);
    $taskuri=array();
    $imagini=array();
    $descrieri=array();
    $valori=array();
    foreach ($rezultate as $rezultat) {
      array_push($taskuri,$rezultat->task->__toString());
      array_push($imagini,$rezultat->imagine->__toString());
      array_push($descrieri,$rezultat->descriere->__toString());
      array_push($valori,$rezultat->valoare->__toString()); 
    }
    $task1=array();
   // $task2=array();
  //  $task3=array();
     for($i=0; $i<count($taskuri); $i=$i+2){
       array_push($task1,$taskuri[$i],$imagini[$i],$descrieri[$i],$valori[$i],$valori[$i+1]);
     }
      
       echo  json_encode($task1);
   
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

  $taskStatus; $taskStatusUpdate;
$client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest");

$interogare = "PREFIX : <http://Alex&Andrei.ro#>
SELECT ?nod ?task ?valoare WHERE {
  :".$data['taskToUpdate']." :esteRealizat ?nod.
  ?nod <http://Alex&Andrei.ro#> ?valoare.
  {
  SELECT ?task WHERE {
   :WebSemantic ?relation :".$data['taskToUpdate'].".  }}}";
$rezultate = $client->query($interogare);

 foreach ($rezultate as $rezultat) {
  $taskStatus = $rezultat->valoare->getValue(); 
}
if($taskStatus){
  $taskStatusUpdate = 'false';
}else{
  $taskStatusUpdate = 'true';
}


  $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest/statements");

   $updateStatement1 = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
   prefix : <http://Alex&Andrei.ro#>
   DELETE WHERE {
      :".$data['taskToUpdate']." :esteRealizat ?bol.
   }
   ";
 $client->update($updateStatement1);
 $client = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafetest/statements");

  $updateStatement2 = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  prefix : <http://Alex&Andrei.ro#>
  INSERT{
    :".$data['taskToUpdate']." :esteRealizat [:'".$taskStatusUpdate."'^^xsd:boolean].
  }
  WHERE{
    ?prjName rdfs:label '".$data['project']."'.
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

    $data['project']=str_replace(" ","",$data['project']);
    $insertStatement = "PREFIX : <http://Alex&Andrei.ro#>
 INSERT DATA {GRAPH <http://Alex&Andrei.ro#".$data['project']."> {:".$data['project']." :deRealizat :".$data['insertDenumireTask'].".
      :".$data['insertDenumireTask']."  :areTermenLimita [:'[".$data['insertTermenTask']."]'^^xsd:date];
      :esteRealizat [:'false'^^xsd:boolean];
      :areImagine '".$data['insertImagineTask']."';
      :areDescriere '".$data['insertDescriereTask']."'; 
   }
 }";
     $client->update($insertStatement);
}
//----------------------------------------------------------------------
