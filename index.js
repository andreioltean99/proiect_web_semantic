let btn1 = document.getElementById("btn-cat-prod");
let btnInsert = document.getElementById("btn-insert");
let currentProject;
let contentLoaded = false; // asigura afisarea proiectelor o singura data
let tasksLoaded = false; // asigura incarcarea taskurilor pentru un singur proiect
let lastTasksLength=0;
//--------------------------------------- READ PROJECTS
btn1.addEventListener("click", function () {
  // Se efectueaza cerea catre server
  if (!contentLoaded) {
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
        contentLoaded = true;
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
  if (tasksLoaded) {
    // daca a fost afisata lista de taskuri inainte se sterge lista pentru a se putea afisa lista noua
    var rootNode = document.getElementById("project-tasks");
    rootNode.textContent = '';   
  
  }
  axios.post('server.php', {
    retrieveTasks: projectName
  })
    .then(function (response) {

      let i = 0;
      while (i < response.data.length) {
        var displayStatus; // 
        if (response.data[i + 4] == 'true') {
          displayStatus = 'Task finalizat';
        } else {
          displayStatus = 'In curs de realizare';
        }
        //divul principal
        var node = document.createElement('div');
        node.setAttribute('class', 'project-task-heading');
        //div secundar
        var node2 = document.createElement('div');
        //linie despartitoare
        var hr = document.createElement('hr');
        node2.setAttribute('style', 'display: inline-block;');
        //paragraf descrire
        var p = document.createElement('p');
        p.setAttribute('style', 'font-weight: normal; font-size: 20px; display: block;');
        p.appendChild(document.createTextNode(response.data[i + 2]));

        //termen limita
        var deadline = document.createElement('p');
        deadline.setAttribute('style', 'font-weight: normal; color: red; font-size: 20px; display: block;');
        deadline.appendChild(document.createTextNode(response.data[i + 3]))

        //status
        var status = document.createElement('p');
        status.setAttribute('style', 'font-weight: normal; font-size: 20px; display:block;');
        status.appendChild(document.createTextNode(displayStatus));
        //title
        var title = document.createElement('h2');
        var displayTitle = response.data[i].substring(22);
        title.innerHTML = displayTitle;
        node2.appendChild(title);

        //imagine
        var img = document.createElement('img');
        img.setAttribute('style', 'width:100px; height:100px;');
        img.setAttribute('src', '../proiect_web_semantic/img/' + response.data[i + 1]);

        //buton stergere
        var buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('class', 'btn btn-danger btn-md');
        buttonDelete.setAttribute('onclick', `deleteTask('${displayTitle}')`);
        buttonDelete.appendChild(document.createTextNode('Sterge sarcina'));
        node2.appendChild(buttonDelete);

        //buton update
        var buttonUpdate = document.createElement('button');
        buttonUpdate.setAttribute('class', 'btn btn-warning btn-md');
        buttonUpdate.setAttribute('onclick', `updateTask('${displayTitle}')`);
        buttonUpdate.appendChild(document.createTextNode('Actualizeaza sarcina'));
        node2.appendChild(buttonUpdate);

        node.appendChild(node2);

        node.appendChild(img);
        //descriere
        node.appendChild(p);

        //deadline
        node.appendChild(deadline);

        //status task
        node.appendChild(status);

        node.appendChild(hr);
        document.getElementById("project-tasks").appendChild(node);

        i = i + 5;
      }
      tasksLoaded = true;
      lastTasksLength=response.data.length;
      // document.getElementsByClassName('task-name')[0].innerHTML=response.data[2];
    //  console.log(response.data.length)
    })
    .catch(function (error) {
      console.log(error);
    });
}

//---------------------------------------- DELETE TASK
function deleteTask(taskNumber) {
  // Se efectueaza cerea catre server
  axios.post('server.php', {
    project: currentProject,
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








