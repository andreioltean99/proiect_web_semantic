let btn1 = document.getElementById("btn-cat-prod");
let btnInsert = document.getElementById("btn-insert");

//---------------------------------------
btn1.addEventListener("click", function(){
    // Se efectueaza cerea catre server
 axios.post('server.php', {
    initRequest: true
  })
  .then(function (response) {
    document.getElementById('side-nav').style.display='block'; // se afiseaza sectiunea cu toate proiectele preluate din BD
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
})
//-----------------------------------------
btnInsert.addEventListener('focus', function(){
    console.log("fortmularul este trimis");
})

function deleteTask(taskNumber){
      // Se efectueaza cerea catre server
axios.post('server.php', {
   taskToDelete: taskNumber
 })
 .then(function (response) {
   console.log(response);
 })
 .catch(function (error) {
   console.log(error);
 });
}
// ----------------------------------
btnInsert.addEventListener('click', function(event){
    event.preventDefault(); // se previne trimiterea automata
})

btnInsert.addEventListener('mouseover', function(){
    console.log("insereaza date");
})


 
