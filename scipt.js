const URL_BASE = 'https://jsonplaceholder.typicode.com/posts' //URL de la API
let posts = [] //Array que contendra los posteos

function getData() { //Funcion que traera los posteos
    fetch(URL_BASE)
        .then(res => res.json())
        .then(data => {
            posts = data
            renderPostList()
        })
        .catch(error => console.error("Error al llamar a la API:", error))
}getData()

function renderPostList() {
    const postList = document.getElementById("postList");
    postList.innerHTML = ""; // Limpiar la lista existente

    posts.forEach(post => {
        const listItem = document.createElement("li");
        listItem.classList.add("posts");
        listItem.innerHTML = `
        <div id="postsContainer">
            <h3 class="postsTitle">${post.title}</h3>
            <p class="postsBody">${post.body}</p>
            <button id="editPost-${post.id}" class="editButton" onclick="editPost(${post.id})">Editar</button>
            <button id="deletePost-${post.id}" class="deleteButton" onclick="deletePost(${post.id})">Eliminar</button>
            
            <div id="editForm-${post.id}" class="editForm" style="display: none;">
            <label for="editTitle-${post.id}">Título:</label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editContent-${post.id}">Contenido:</label>
            <textarea id="editContent-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>
            </div>
        </div>
        `;

        postList.appendChild(listItem); // Agregar el elemento a la lista
    });
}

function postData(){
    const postTitleInput = document.getElementById("postTitle")
    const postBodyInput = document.getElementById("postContent")
    const postTitle = postTitleInput.value
    const postBody = postBodyInput.value
    event.preventDefault()

    if(postBody.trim() == "" || postTitle.trim() == ""){
        document.querySelectorAll(".error").forEach(element => element.style.display = "block")
        return
    }else{
        document.querySelectorAll(".error").forEach(element => element.style.display = "none")
    }

    fetch(URL_BASE, {
        method: 'POST',
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
    .then(res => res.json())
    .then(data => {
        posts.unshift(data)
        renderPostList()
        postBodyInput.value = ""
        postTitleInput.value = ""
    })
    .catch(error => console.log("Ha habido un error al subir el posteo: " + error))
}

function editPost(id){
    const editForm = document.getElementById(`editForm-${id}`)
    editForm.style.display = (editForm.style.display == "none" ? "block" : "none")
}

function updatePost(id){
    const editTitle = document.getElementById(`editTitle-${id}`)
    const editBody = document.getElementById(`editContent-${id}`)

    fetch(`${URL_BASE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: id,
          title: editTitle.value,
          body: editBody.value,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(res => res.json())
      .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if(index != -1){
            posts[index] = data
        }else{
            console.error("No se ha podido actualizar el posteo")
            alert("No se ha podido actualizar el posteo")
        }
        renderPostList()
      })
      .catch(error => console.error("Ha ocurrido un problema:", error))
      editPost()
}

function deletePost(id){
    fetch(`${URL_BASE}/${id}`, {
        method: 'DELETE',
      })
      .then(res => {
        if(res.ok){
            posts = posts.filter(post => post.id != id)
            renderPostList()
        }else{
            console.error("Hubo un error al eliminar el posteo")
            alert("Hubo un error al eliminar el posteo")
        }
      })
      .catch(error => console.error("Ha ocurrido un problema:", error))
}