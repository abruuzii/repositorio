const firebaseConfig = {
  apiKey: "",
  authDomain: "imagenes-brayan.firebaseapp.com",
  projectId: "imagenes-brayan",
  storageBucket: "imagenes-brayan.firebasestorage.app",
  messagingSenderId: "41709158474",
  appId: "1:41709158474:web:d96326c9334218edc766b3"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

async function uploadImage() {
  const file = document.getElementById("fileInput").files[0];
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const status = document.getElementById("status");

  if (!file) {
    alert("Selecciona una imagen.");
    return;
  }

  status.innerText = "Subiendo imagen...";
  const fileName = `productos/${Date.now()}_${file.name}`;
  const storageRef = storage.ref().child(fileName);

  try {
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();

    document.getElementById("preview").src = url;
    document.getElementById("preview").style.display = "block";
    document.getElementById("imageURL").href = url;
    document.getElementById("imageURL").innerText = url;
    status.innerText = "Imagen subida. Guardando producto...";

    // ⚠️ Obtener token guardado tras iniciar sesión
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8000/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        titulo,
        descripcion,
        precio,
        stock,
        imagen: url
      })
    });

    const result = await response.json();

    if (response.ok) {
      status.innerText = "✅ Producto guardado correctamente.";
      console.log("Producto creado:", result);
    } else {
      status.innerText = "❌ Error al guardar producto: " + result.message;
      console.error(result);
    }

  } catch (error) {
    console.error("Error:", error);
    status.innerText = "❌ Fallo al subir imagen o guardar producto.";
  }
}