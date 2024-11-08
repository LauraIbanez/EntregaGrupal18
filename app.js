
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const btnGet1 = document.getElementById('btnGet1');
  const inputGet1Id = document.getElementById('inputGet1Id');
  const btnPost = document.getElementById('btnPost');
  const inputPostNombre = document.getElementById('inputPostNombre');
  const inputPostApellido = document.getElementById('inputPostApellido');
  const btnPut = document.getElementById('btnPut');
  const inputPutId = document.getElementById('inputPutId');
  const inputPutNombre = document.getElementById('inputPutNombre');
  const inputPutApellido = document.getElementById('inputPutApellido');
  const btnDelete = document.getElementById('btnDelete');
  const inputDelete = document.getElementById('inputDelete');
  const results = document.getElementById('results');
  const alertError = document.getElementById('alert-error');
  const dataModal = new bootstrap.Modal(document.getElementById('dataModal'));
  const btnSendChanges = document.getElementById('btnSendChanges');

  // API URL
  const API_URL = 'https://672d2d2bfd89797156419e28.mockapi.io/users';

  // Función para mostrar los resultados en la lista
  function showResults(data) {
      results.innerHTML = '';  // Limpiar los resultados actuales
      data.forEach(user => {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.innerText = `ID: ${user.id} - Nombre: ${user.name} ${user.lastname}`;
          results.appendChild(li);
      });
  }

  // Función para manejar los errores y mostrar un mensaje
  function showError(message) {
      alertError.classList.add('show');
      alertError.innerText = message;
      setTimeout(() => {
          alertError.classList.remove('show');
      }, 3000);
  }

  // 1. GET ALL USERS o GET USER BY ID
btnGet1.addEventListener('click', async () => {
  const id = inputGet1Id.value.trim();  // Obtener el ID del input y quitar espacios

  // Verificar si el ID es válido (no vacío y es un número)
  if (id) {
      // Si hay un ID, obtener un solo usuario por su ID
      try {
          const response = await fetch(`${API_URL}/${id}`);
          if (!response.ok) {
              throw new Error('Usuario no encontrado');
          }
          const data = await response.json();
          showResults([data]);  // Mostrar solo el usuario encontrado
      } catch (error) {
          showError('Usuario no encontrado');
      }
  } else {
      // Si no hay un ID, obtener todos los usuarios
      try {
          const response = await fetch(API_URL);
          if (!response.ok) {
              throw new Error('Error al obtener usuarios');
          }
          const data = await response.json();
          showResults(data);  // Mostrar todos los usuarios
      } catch (error) {
          showError('Error al obtener la lista de usuarios');
      }
  }
});


  // 3. POST NEW USER
btnPost.addEventListener('click', async () => {
  const name = inputPostNombre.value;
  const lastname = inputPostApellido.value;

  if (!name || !lastname) {
      showError("Faltan el nombre o el apellido");
      return;
  }

  try {
      // Hacer el POST para agregar el nuevo usuario
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, lastname })
      });

      if (!response.ok) {
          throw new Error('Error al agregar el usuario');
      }

      // Obtener los datos del nuevo usuario
      const newUser = await response.json();
      
      // Después de agregar el nuevo usuario, obtener todos los usuarios
      const allUsersResponse = await fetch(API_URL);
      if (!allUsersResponse.ok) {
          throw new Error('Error al obtener la lista de usuarios');
      }
      
      const allUsers = await allUsersResponse.json();

      // Mostrar la lista completa de usuarios en el DOM
      showResults(allUsers);

      // Limpiar los campos de entrada
      inputPostNombre.value = '';
      inputPostApellido.value = '';
      
  } catch (error) {
      showError('Error al agregar el usuario');
  }
});

  // 4. PUT (EDIT USER)
btnPut.addEventListener('click', async () => {
  const id = inputPutId.value;
  if (!id) {
      showError("Falta el ID para modificar");
      return;
  }
  try {
      // Hacer una solicitud GET para obtener el usuario actual
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
          throw new Error('Usuario no encontrado');
      }
      const data = await response.json();

      // Llenar el modal con la información actual del usuario
      inputPutNombre.value = data.name;
      inputPutApellido.value = data.lastname;
      btnSendChanges.disabled = false;
      dataModal.show();

      // Guardar cambios en el usuario
      btnSendChanges.addEventListener('click', async () => {
          const updatedName = inputPutNombre.value;
          const updatedLastname = inputPutApellido.value;
          if (!updatedName || !updatedLastname) {
              showError("Faltan los datos para actualizar");
              return;
          }

          try {
              // Hacer una solicitud PUT para actualizar el usuario
              const updateResponse = await fetch(`${API_URL}/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: updatedName, lastname: updatedLastname })
              });

              if (!updateResponse.ok) {
                  throw new Error('Error al actualizar el usuario');
              }

              const updatedData = await updateResponse.json();

              // Después de actualizar, obtener todos los usuarios de nuevo
              const allUsersResponse = await fetch(API_URL);
              if (!allUsersResponse.ok) {
                  throw new Error('Error al obtener la lista de usuarios');
              }

              const allUsers = await allUsersResponse.json();

              // Mostrar la lista completa de usuarios (incluido el modificado)
              showResults(allUsers);

              // Ocultar el modal después de la modificación
              dataModal.hide();
          } catch (error) {
              showError('Error al actualizar el usuario');
          }
      });
  } catch (error) {
      showError('Usuario no encontrado');
  }
});

// 5. DELETE USER
btnDelete.addEventListener('click', async () => {
  const id = inputDelete.value;
  if (!id) {
      showError("Falta el ID para eliminar");
      return;
  }

  try {
      // Hacer la solicitud DELETE para eliminar el usuario
      const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
      }

      // Después de eliminar el usuario, obtener la nueva lista de todos los usuarios
      const allUsersResponse = await fetch(API_URL);
      if (!allUsersResponse.ok) {
          throw new Error('Error al obtener la lista de usuarios');
      }

      const allUsers = await allUsersResponse.json();

      // Mostrar la lista actualizada de usuarios en el DOM (sin el eliminado)
      showResults(allUsers);

      // Limpiar el campo de entrada del ID
      inputDelete.value = '';

  } catch (error) {
      showError('Error al eliminar el usuario');
  }
});
});