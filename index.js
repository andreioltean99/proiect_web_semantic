let btn1 = document.getElementById("btn-cat-prod");
let btnInsert = document.getElementById("btn-insert");
let currentProject;
let contentLoaded = false; // asigura afisarea proiectelor o singura data
//--------------------------------------- READ PROJECTS
btn1.addEventListener("click", function () {
  // Se efectueaza cerea catre server
  if(!contentLoaded){
  axios.post('server.php', {
    initRequest: true
  })
    .then(function (response) {
      document.getElementById('side-nav').style.display = 'block'; // se afiseaza sectiunea cu toate proiectele preluate din BD
       for (let i = 0; i < response.data.length; i++) {
         var node = document.createElement("LI");
         var textnode = document.createTextNode(response.data[i]);
         node.appendChild(textnode);
         node.setAttribute('id', `${response.data[i] + '_prj_id'}`);
         node.setAttribute('onclick', `showTasksForAProject('${response.data[i]}')`);
         document.getElementById("projects-list").appendChild(node);
       }
      contentLoaded=true;
    })
    .catch(function (error) {
      console.log(error);
    });
  }
})
//----------------------------------------- READ TASKS FOR A PROJECT

function showTasksForAProject(projectName) {
  currentProject = projectName;
  document.getElementById('project-name').innerHTML = "'" + projectName + "'";
  document.getElementById('main-area').style.display = 'block'; // se afiseaza sectiunea cu toate proiectele preluate din BD
  document.getElementById('footer').style.display = 'block'; // se afiseaza sectiunea cu toate proiectele preluate din BD
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

//---------------------------------------- DELETE TASK
function deleteTask(taskNumber) {
  // Se efectueaza cerea catre server
  axios.post('server.php', {
    project:currentProject,
    taskToDelete: taskNumber
  })
    .then(function (response) {
      showTasksForAProject(currentProject);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//---------------------------------------------- UPDATE TASK
function updateTask(taskNumber) {
  // Se efectueaza cerea catre server
  axios.post('server.php', {
    project: currentProject,
    taskToUpdate: taskNumber
  })
    .then(function (response) {
      showTasksForAProject(currentProject);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// ---------------------------------- CREATE TASK
btnInsert.addEventListener('click', function (event) {
  event.preventDefault(); // se previne trimiterea automata
})

btnInsert.addEventListener('mouseover', function () {

  let denumireTask = document.getElementById('insert-denumire').value;
  let descriereTask = document.getElementById('insert-descriere').value;
  let termenTask = document.getElementById('insert-termen').value;
  let imagineTask = document.getElementById('insert-imagine').value;
  //  console.log(denumire);
  // Se efectueaza cerea catre server daca au fost completate toate campurile
  if (currentProject != '' && denumireTask != '' && descriereTask != '' && termenTask != '' && imagineTask != '') {
    axios.post('server.php', {
      project: currentProject,
      insertDenumireTask: denumireTask,
      insertDescriereTask: descriereTask,
      insertTermenTask: termenTask,
      insertImagineTask: imagineTask
    })
      .then(function (response) {
        // console.log(response);
        //se apeleaza din nou functia showTasksForAProject pentru a actualiza informatia
        showTasksForAProject(currentProject);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // se sterg valorile din campurile input
  document.getElementById('insert-denumire').value = '';
  document.getElementById('insert-descriere').value = '';
  document.getElementById('insert-termen').value = '';
  document.getElementById('insert-imagine').value = '';
})








