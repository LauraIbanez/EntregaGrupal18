const express = require("express");

const app = express();
const port = 3000;

// URL base de la API
const API_URL = 'https://672d2d2bfd89797156419e28.mockapi.io/users';

app.use(express.json()); // Para poder parsear los datos JSON

// Listar usuarios (GET)
app.get("/users", async (req, res) => {
    try {
        const response = await fetch(API_URL); // Usamos fetch en lugar de axios
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const data = await response.json();
        res.status(200).json(data); // Responder con todos los usuarios
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});


// Obtener un usuario por ID (GET)
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const response = await fetch(`${API_URL}/${id}`); // Usamos fetch en lugar de axios
      if (!response.ok) {
          throw new Error('Usuario no encontrado');
      }
      const data = await response.json();
      res.status(200).json(data); // Responder con el usuario encontrado
  } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// Agregar un nuevo usuario (POST)
app.post("/users", async (req, res) => {
  const { name, lastname } = req.body;
  if (!name || !lastname) {
      return res.status(400).json({ error: "Faltan los atributos 'name' o 'lastname' en el cuerpo de la solicitud" });
  }

  try {
      const response = await fetch(API_URL, {
          method: 'POST', // Indicamos el método POST
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, lastname }) // Enviamos los datos del nuevo usuario
      });
      if (!response.ok) {
          throw new Error('Error al crear el usuario');
      }
      const data = await response.json();
      res.status(201).json(data); // Responder con el usuario creado
  } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Modificar un usuario (PUT)
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, lastname } = req.body;

  if (!name || !lastname) {
      return res.status(400).json({ error: "Faltan los atributos 'name' o 'lastname' en el cuerpo de la solicitud" });
  }

  try {
      const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT', // Indicamos el método PUT
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, lastname }) // Enviamos los datos actualizados
      });
      if (!response.ok) {
          throw new Error('Error al actualizar el usuario');
      }
      const data = await response.json();
      res.status(200).json(data); // Responder con el usuario actualizado
  } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Eliminar un usuario (DELETE)
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE', // Indicamos el método DELETE
      });
      if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
      }
      const data = await response.json();
      res.status(200).json(data); // Responder con el usuario eliminado
  } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

//HASTA ACÁ VA EL CRUD

const URL = "http://localhost:3000/users"
const btnPost = document.getElementById("btnPost");

const postUserData = () => {
  const nameInput = document.getElementById("inputPostNombre").value;
  const lastnameInput = document.getElementById("inputPostApellido").value;
  
  const userData = {
    name: nameInput,
    lastname: lastnameInput,
  };
  console.log("userData", userData);
  fetch(URL, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
        Swal.fire("Usuario creado correctamente!");
      console.log("Usuario creado:", data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};


btnPost.addEventListener("click", postUserData);


//GET

const getItem = async (id) => {
  results.innerHTML = "";
  try {
    const urlGet = id !== "" ? URL + `/${id}` : URL;
    console.log("URL PARA OBTENER UNO: " + urlGet);

    const response = await fetch(urlGet);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos recibidos:", data);

    if (id !== "") {
      //Si existe ID
      console.log("ENTRO A CONSIDICONAL SI existe ID");
      //Create element
      const li = document.createElement("li");

      li.innerHTML = `<p>ID: ${id}</p>
                            <p>NAME: ${data.name}</p>
                            <p>LASTNAME: ${data.lastname}</p>`;
      results.appendChild(li);
    } else {
      //Si NO existe ID
      console.log("ENTRO A CONDICIONAL NO existe ID");
      console.log("DATA LENGHT: " + data.length);

      for (let i = 0; i < data.length; i++) {
        //Create element
        const li = document.createElement("li");
        li.innerHTML = `<p>ID: ${data[i].id}</p>
                                <p>NAME: ${data[i].name}</p>
                                <p>LASTNAME: ${data[i].lastname}</p>
                                <hr>`;
        results.appendChild(li);
      }
    }
    Swal.fire("Datos obtenidos correctamente!");
    return data;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
};

getOneButton.addEventListener("click", () => {
  console.log("ID A BUSCAR: " + getOneInput.value);
  getItem(getOneInput.value);
});
