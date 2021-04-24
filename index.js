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

var stringResponse = response.data;

var splitstring = stringResponse.split('|')
for(let i=0; i<splitstring.length-1; i++){
  var node = document.createElement("LI");                 
var textnode = document.createTextNode(splitstring[i]);       
node.appendChild(textnode); 
node.setAttribute('id',`${splitstring[i]+'_prj_id'}`);
node.setAttribute('onclick',`showTasksForAProject('${splitstring[i]}')`);          
document.getElementById("projects-list").appendChild(node); 

}
  })
  .catch(function (error) {
    console.log(error);
  });
})
//-----------------------------------------

function showTasksForAProject(projectName){
  document.getElementById('project-name').innerHTML="'"+projectName+"'";
  document.getElementById('main-area').style.display='block'; // se afiseaza sectiunea cu toate proiectele preluate din BD
  document.getElementById('footer').style.display='block'; // se afiseaza sectiunea cu toate proiectele preluate din BD
  axios.post('server.php', {
    retrieveTasks: projectName
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
 }

 //----------------------------------------
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
    // Se efectueaza cerea catre server
   let denumireTask= document.getElementById('denumire-task');
   let task = document.getElementById('task');
 axios.post('server.php', {
    insertDenumireTask: denumireTask,
    insertTask: task
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
})





 
