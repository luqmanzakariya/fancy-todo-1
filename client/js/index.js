const baseUrl = 'http://localhost:3000'
let profileImage = localStorage.getItem('image') || "./assets/user1.png"
let name = localStorage.getItem('name') || "User"

let click = false

$('document').ready(function () {
  isLogin()
  weather()
  let idUser = ''
  //input user
  $(`#inputUser`).change(function(event) {
    idUser = $(this).children(":selected").attr("id");
  });

  let idMember = ''
  //input user
  $(`#inputMember`).change(function(event) {
    idMember = $(this).children(":selected").attr("id");
  });

  if (localStorage.getItem('token')) {
    hasToken()
  }
  else {
    noToken()
  }

  $('#registerForm').submit(function (event) {
    event.preventDefault()
    let input = {
      name: $('#reg-name').val(),
      email: $('#reg-email').val(),
      password: $("#reg-password").val()
    }
    register(input)
  })

  $('#loginForm').submit(function (event) {
    event.preventDefault()
    let input = {
      email: $('#login-email').val(),
      password: $('#login-password').val()
    }
    login(input)
  })

  $('#logout-button').click(function (event) {
    event.preventDefault()
    logout()
  })

  $('#createTodo').click(function (event) {
    event.preventDefault()
    showCreateTodo()
  })

  $('#myTodo').click(function (event) {
    event.preventDefault()
    showMyTodo()
    myTodo()
  })

  $('#myProject').click(function (event) {
    event.preventDefault()
    showProject()
  })

  $('.click').click(function (event) {
    event.preventDefault()
    return new Promise(function () {
      click = true
    })
      .then((googleUser) => {
        onSignIn(googleUser)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  $('.create-todo').submit(function (event) {
    event.preventDefault()

    let input = {
      name: $('#input-form-name').val(),
      description: $('#input-form-description').val(),
      dueDate: $('#input-form-dueDate').val(),
      UserId: localStorage.getItem('_id')
    }
    createTodo(input)
  })

  $('.create-project').submit(function (event) {
    event.preventDefault()
    let input = {
      title: $(`#input-project-title`).val(),
      description: $(`#input-project-description`).val(),
      members: idMember,
      UserId: localStorage.getItem('_id')
    }
    createProject(input)
  })

  $(`.project-todo`).submit(function (event) {
    event.preventDefault()
    let input = {
      name: $(`#todo-project-name`).val(),
      description: $(`#todo-project-description`).val(),
      dueDate: $(`#todo-project-dueDate`).val() || new Date(),
      UserId: null
    }
    createTodoProject(input)
  })

  $(`.edit-todo`).submit(function(event){
    event.preventDefault()
    let input = {
      name: $(`#edit-todo-name`).val(),
      description: $(`#edit-todo-description`).val(),
      dueDate: $(`#edit-todo-dueDate`).val() || new Date(),
      UserId: null
    }
    
    submitEditTodoProject(input)
  })

  $(`.addUser`).submit(function(event){
    event.preventDefault()
    addUser(idUser)
    
    
  })

})

//========================================
//============= weather =============
//========================================
function weather(){
  axios({
    url: `${baseUrl}/weathers`,
    method: `get`,
    dataType: `json`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({data})=>{
      console.log('masuk weather', data)
      $(`#weather`).append(`
        <p > Location: jakarta <br> Current Weather: ${data.weather[0].main} <br> Description : ${data.weather[0].description}</p>
      `)

    })
    .catch((err)=>{
      console.log(err)
    })
}

//========================================
//============= Function Projects =============
//========================================
function listUsers() {
  axios({
    url: `${baseUrl}/users/${localStorage.getItem('_id')}`,
    method: `get`,
    dataType: `json`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({ data }) => {
      $(`.listUsers`).empty()
      $(`.listUsers`).append(`
        <option selected disabled hidden>Invite other user</option>
      `)
      for (let i = 0; i < data.length; i++) {
        $(`.listUsers`).append(`
          <option class="input-user-name" id="${data[i]._id}">${data[i].name}</option>
        `)
      }
    })
    .catch((err) => {
      console.log('ini errorr', err)
    })
}

function addUser(idUser) {
  let idProject = $(`.changeId`).attr('id')
  console.log('masuk add user', idUser)
  console.log('ini id project', idProject)
  axios({
    url: `${baseUrl}/projects/${idProject}?id=${idUser}`,
    method: `patch`,
    dataType: `json`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({data})=>{
      $('#add-user').modal('toggle');
      Swal.fire('member has been added')
      showProject()
    })
    .catch((err)=>{
      console.log(err)
    })
}

function createProject(input) {
  console.log('masuk create project function', input)
  axios({
    url: `${baseUrl}/projects`,
    method: `post`,
    dataType: `json`,
    data: input,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({ data }) => {
      findAllProject()
      swal.fire(`Project Created`)
    })
    .catch((err) => {
      console.log(err)
    })
}

function findAllProject() {
  console.log('masuk find all project')
  axios({
    url: `${baseUrl}/projects`,
    method: `get`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({ data }) => {
      $(`#list-project`).empty()
      for (let i = 0; i < data.length; i++) {
        $(`#list-project`).append(`
        <tr id=row${data[i]._id}>
          <td> ${data[i].title}</td>
          <td> ${data[i].description}</td><td id="${data[i]._id}"></td>
          </tr>`)
        for (let j = 0; j < data[i].members.length; j++) {
          $(`#${data[i]._id}`).append(`
          | ${data[i].members[j].name} 
          `)
        }
        $(`#row${data[i]._id}`).append(`
          <td class="icon"> <a onclick="projectDetails('${data[i]._id}')">Details</a> </td>
          <td class="icon"> </td>
          <td class="icon"> <a onclick="deleteProject('${data[i]._id}')">&#128465</a> </td>
        `)
      }
      console.log(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

function editProject(id){
  console.log('masuk edit project', id)
}

function deleteProject(id){
  console.log('masuk delete project', id)
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      axios({
        url: `${baseUrl}/projects/${id}`,
        method: `delete`,
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(({data})=>{
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          findAllProject()
        })
        .catch((err)=>{
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: `${err.response.data.message}`
          })
        })

    }
  }).catch((err)=>{
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: `${err.response.data.message}`
    })
  })

}

function projectDetails(id) {
  console.log('masuk project details', id)
  showProjectDetails()
  
  $(`.changeId`).attr('id', `${id}`)

  axios({
    url: `${baseUrl}/projects/${id}`,
    method: `get`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({ data }) => {
      $(`.changeId`).html(`${data.title}`)
      $(`#todoInProject`).empty()
      console.log('coba check length si data.todo',data)

      

      for (let i = 0; i < data.todos.length; i++) {
        if (data.todos[i].status === false){
          $(`#todoInProject`).append(`
          <tr>
            <th scope="row" class="icon"> <a onclick="changeStatusTodoProject('${data.todos[i]._id}')"> &#9744 </a> </th>
            <td> ${data.todos[i].name}</td>
            <td> ${data.todos[i].description}</td>
            <td> ${data.todos[i].dueDate} </td>
            <td class="icon"> <a onclick="editTodoProject('${data.todos[i]._id}')">&#10000</a> </td>
            <td class="icon"> <a onclick="deleteTodoProject('${data.todos[i]._id}')">&#128465</a> </td>
          </tr>
          `)
        }
        else {
          $(`#todoInProject`).append(`
          <tr>
            <th scope="row" class="icon"> <a onclick="changeStatusTodoProject('${data.todos[i]._id}')"> &#x2713 </a> </th>
            <td> <strike> ${data.todos[i].name} </strike></td>
            <td> <strike> ${data.todos[i].description} </strike> </td>
            <td> <strike> ${data.todos[i].dueDate} </strike> </td>
            <td class="icon"> <a onclick="editTodoProject('${data.todos[i]._id}')">&#10000</a> </td>
            <td class="icon"> <a onclick="deleteTodoProject('${data.todos[i]._id}')">&#128465</a> </td>
          </tr>
          `)
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })

}

//========================================
//============= Function Todo In Project =============
//========================================

function createTodoProject(input){
  let id = $(`.changeId`).attr('id')
  console.log('masuk yaaa', input)
  console.log('ini id', id)
  axios({
    url: `${baseUrl}/projects/${id}`,
    method: `post`,
    data: input,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({data})=>{
      swal.fire('Created todo in project')
      projectDetails(id)
    })
    .catch((err)=>{
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: `${err.response.data.message}`
      })
    })
}

function editTodoProject(idTodo){
  let ProjectId = $(`.changeId`).attr('id')
  console.log('masuk edit todo project', idTodo, 'ini project id', ProjectId)
  showEditTodoProject()
  axios({
    url: `${baseUrl}/todos/todoproject/${ProjectId}?idTodo=${idTodo}`,
    method: `get`,
    data: {idTodo},
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({data})=>{
      let date = data.dueDate.substr(0,10)
      $(`#edit-todo-name`).val(data.name)
      $(`#edit-todo-description`).val(data.name)
      $(`#edit-todo-dueDate`).val(date)
      $(`.getIdTodo`).attr('id', data._id)
    })
    .catch((err)=>{
      console.log(err)
    })
  
}

function submitEditTodoProject(input){
  let ProjectId = $(`.changeId`).attr('id')
  let idTodo = $(`.getIdTodo`).attr('id')
  console.log('submit edit todo project', ProjectId, 'ini id', idTodo)
  axios({
    url: `${baseUrl}/todos/todoproject/${ProjectId}?idTodo=${idTodo}`,
    method: `patch`,
    data: input,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({data})=>{
      swal.fire('Todo Project has been updated')
      projectDetails(ProjectId)
      showProjectDetails()
    })
    .catch((err)=>{
      console.log(err)
    })
}

function deleteTodoProject(idTodo){
  let ProjectId = $(`.changeId`).attr('id')
  console.log('masuk delete todo prooject', idTodo)
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      axios({
        url: `${baseUrl}/todos/todoproject/${ProjectId}`,
        method: `delete`,
        data: {idTodo},
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(({data})=>{
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          projectDetails(ProjectId)
        })
        .catch((err)=>{
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: `${err.response.data.message}`
          })
        })

    }
  }).catch((err)=>{
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: `${err.response.data.message}`
    })
  })
}

function changeStatusTodoProject(idTodo){
  console.log('masuk change status todo', idTodo)
  let ProjectId = $(`.changeId`).attr('id')
  axios({
    url: `${baseUrl}/todos/todoproject/status/${ProjectId}`,
    method: `patch`,
    data: {idTodo},
    headers: {
      token: localStorage.getItem('token'),
      userid: localStorage.getItem('_id')
    }
  })
    .then(({ data }) => {
      projectDetails(ProjectId)
      console.log('berhasil')
    })
    .catch((err) => {
      console.log('ini error', err)
    })
}


//========================================
//============= Function Todo =============
//========================================
function createTodo(input) {
  axios({
    url: `${baseUrl}/todos/create`,
    method: `post`,
    dataType: `json`,
    data: input,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(({ data }) => {
      console.log('berhasil create', data)
      Swal.fire('Todo created')
      showMyTodo()

    })
    .catch((err) => {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: `${err.response.data.message}`
      })
    })
}

function myTodo() {
  axios({
    url: `${baseUrl}/todos/`,
    method: `get`,
    headers: {
      token: localStorage.getItem('token'),
      userid: localStorage.getItem('_id')
    }
  })
    .then(({ data }) => {
      $(`#listTodo`).empty()
      console.log(data)
      let date = new Date().toString()
      for (let i = 0; i < data.length; i++) {
        if (data[i].dueDate !== null) {
          date = data[i].dueDate.substring(0, 10)
        }
        if (data[i].status === false) {
          $(`#listTodo`).append(`
          <tr>
            <th scope="row" class="icon"> <a onclick="updateStatus('${data[i]._id}')">	&#9744 </a></th>
            <td> ${data[i].name}</td>
            <td>${data[i].description}</td>
            <td>${date}</td>
            <td class="icon"> <a onclick="editTodo('${data[i]._id}')">&#10000</a> </td>
            <td class="icon"> <a onclick="deleteTodo('${data[i]._id}')">&#128465</a> </td>
          </tr>
          `)
        }
        else {
          $(`#listTodo`).append(`
          <tr>
            <th scope="row" class="icon"> <a onclick="updateStatus('${data[i]._id}')"> &#x2713 </a></th>
            <td> <strike> ${data[i].name} </strike> </td>
            <td> <strike> ${data[i].description} </strike> </td>
            <td> <strike> ${date} </strike> </td>
            <td class="icon"> <a onclick="editTodo('${data[i]._id}')">&#10000</a> </td>
            <td class="icon"> <a onclick="deleteTodo('${data[i]._id}')">&#128465</a> </td>
          </tr>
          `)
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

function updateStatus(id) {
  console.log('ini update status todo', id)
  axios({
    url: `${baseUrl}/todos/status/${id}`,
    method: `patch`,
    headers: {
      token: localStorage.getItem('token'),
      userid: localStorage.getItem('_id')
    }
  })
    .then(({ data }) => {
      myTodo()
    })
    .catch((err) => {
      console.log('ini error', err)
    })
}

function editTodo(id) {
  console.log('ini edit todo', id)
  axios({
    url: `${baseUrl}/todos/${id}`,
    method: `get`,
    headers: {
      token: localStorage.getItem('token'),
      userid: localStorage.getItem('_id')
    }
  })
    .then(({ data }) => {
      console.log('berhasil edit', data.dueDate.substring(0, 10))
      console.log('ini substr', data.dueDate.substr(0, 10))
      const { value: formValues } = Swal.fire({
        title: 'Edit Todo',
        html:
          `
        <form class="edit-todo">
          <div class="form-group">
            <label for="formCreate-name">Title</label>
            <input id="swal-input1" type="text" class="swal2-input form-control" id="formCreate-name"
              value="${data.name}">
          </div>
          <div class="form-group">
            <label for="formCreate-description">Description</label>
            <textarea id="swal-input2" class="form-control" id="formCreate-description" rows="3"
              >${data.description}</textarea>
          </div>
          <div class="form-group">
            <label for="formCreate-dueDate">Due Date</label>
            <input id="swal-input3" type="date" class="form-control" id="formCreate-dueDate value="${data.dueDate.substr(0, 10)}">
          </div>
        </form>
      `,
        focusConfirm: true,
        preConfirm: () => {
          return {
            name: document.getElementById('swal-input1').value,
            description: document.getElementById('swal-input2').value,
            dueDate: document.getElementById('swal-input3').value || new Date(),
          }
        }
      })
        .then((data) => {
          if (data.value) {
            console.log('ini form value', data)
            axios({
              url: `${baseUrl}/todos/${id}`,
              method: `patch`,
              data: data.value,
              headers: {
                token: localStorage.getItem('token'),
                userid: localStorage.getItem('_id')
              }
            })
              .then(({ data }) => {
                myTodo()
                swal.fire('todo has been updated')
              })
          }

        })
    })
    .catch((err) => {
      console.log(err)
    })

}

function deleteTodo(id) {
  console.log('ini delete todo', id)
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      axios({
        url: `${baseUrl}/todos/${id}`,
        method: 'delete',
        headers: {
          token: localStorage.getItem('token'),
        }
      })
        .then(({ data }) => {
          myTodo()
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
    .catch((err) => {
      console.log(err)
    })
}

//========================================
//============= Show Hide =============
//========================================
function showCreateTodo() {
  $('.form-create-todo').show()
  $('.my-todo').hide()
  $('.project-menu').hide()
}

function showMyTodo() {
  $('.form-create-todo').hide()
  $('.my-todo').show()
  $('.project-menu').hide()
  myTodo()
}

function showProject() {
  $('.project-menu').show()
  $('.form-create-todo').hide()
  $('.my-todo').hide()
  $(`.notTodoProject`).show()
  $(`#todoProject`).hide()
  $(`.edit-todo`).hide()
  listUsers()
  findAllProject()
}

function showProjectDetails() {
  // $('.project-menu').hide()
  $(`.notTodoProject`).hide()
  $(`#todoProject`).show()

  $('.form-create-todo').hide()
  $('.my-todo').hide()
  $(`.edit-todo`).hide()
}

function showEditTodoProject(){
  $(`.edit-todo`).show()
  
  $(`.notTodoProject`).hide()
  $(`#todoProject`).hide()
  $('.form-create-todo').hide()
  $('.my-todo').hide()
}

//========================================
//============= Pre Login =============
//========================================
function isLogin() {
  if (localStorage.getItem('token')) {
    hasToken()
  }
  else {
    noToken()
  }
}

function hasToken() {
  $('.hasToken').show()
  $('.noToken').hide()
  myTodo()
  showMyTodo()

  name = localStorage.getItem('name')
  profileImage = localStorage.getItem('image')
  $('#user-name').html(`Hi ${name}`)
  if (localStorage.getItem('image')) {
    $('#user-image').attr("src", profileImage);
  }
  else {
    $('#user-image').attr("src", "./assets/user1.png");
  }
}

function noToken() {
  $('.noToken').show()
  $('.hasToken').hide()
}

//============= Register =============
function register(input) {
  axios({
    url: `${baseUrl}/users/register`,
    method: 'post',
    dataType: 'json',
    data: input
  })
    .then(({ data }) => {
      Swal.fire('Register success, please login!')
      $('#reg-modal').modal('toggle');
    })
    .catch((err) => {
      console.log(err)
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: `${err.response.data.message}`
      })
    })
}

//============= Login Normal =============
function login(input) {
  axios({
    url: `${baseUrl}/users/login`,
    method: 'post',
    dataType: 'json',
    data: input
  })
    .then(({ data }) => {
      profileImage = "./assets/user1.png"
      localStorage.setItem('token', data.token)
      localStorage.setItem('_id', data._id)
      localStorage.setItem('name', data.name)
      localStorage.setItem('email', data.email)
      isLogin()
      Swal.fire('Login success!')
      $('#login-modal').modal('toggle');
    })
    .catch((err) => {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: `${err.response.data.message}`
      })
    })
}

//============= Google Signin =============
function onSignIn(googleUser) {
  if (click) {
    const idToken = googleUser.getAuthResponse().id_token

    axios({
      url: `${baseUrl}/users/loginGoogle`,
      method: 'post',
      dataType: 'json',
      data: { idToken }
    })
      .then(({ data }) => {
        profileImage = googleUser.getBasicProfile().getImageUrl()
        localStorage.setItem('token', data.token)
        localStorage.setItem('_id', data._id)
        localStorage.setItem('name', data.name)
        localStorage.setItem('email', data.email)
        localStorage.setItem('image', googleUser.getBasicProfile().getImageUrl())
        isLogin()
        Swal.fire('Login success!')
        $('#login-modal').modal('hide');
        $('#register-modal').modal('hide');
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

//============= Logout =============
function logout() {
  localStorage.clear()
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  isLogin()
  Swal.fire(`You've been logged out`)
}

