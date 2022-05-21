//npm install
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.listen(3000, () => console.log("App escuchando en el puerto 3000!"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    //"mongodb+srv://allanvillatoro:Vanguardia2022@cluster0.z8xei.mongodb.net/PersonasDB?retryWrites=true&w=majority"
    "mongodb+srv://admin:admin@cluster0.mmvqg.mongodb.net/VideosDB?retryWrites=true&w=majority"  
    //mongosh "mongodb+srv://cluster0.mmvqg.mongodb.net/myFirstDatabase" --apiVersion 1 --username admin  
  )
  .catch((error) => handleError(error));

  //Definiendo el esquema
  const videoSchema = new mongoose.Schema(
    {
      //_id: mongoose.Schema.Types.ObjectId,
      _id: Number,
      titulo: String,
      descripcion: String,
      duracion: String,
      autor: String,
      enlace: String,
      ciudad: String,
      fechah: { type: Date, default: Date.Now },
    },
    {
      collection: "VideosT", //para forzar a enlazar con una colección
    }
  ); 

  //paseando el esquema al modelo
const Videos = mongoose.model("Videos", videoSchema);

app.get("/api/videos", (req, res) => {
  Videos.find((err, videos) => {
    if (err) res.status(500).send("Error en la base de datos");
    else res.status(200).json(videos);
  });
});

app.get("/api/videos/porautor", function (req, res) {
    //hace un query de los documentos
    Videos.find({ autor: { $gt: req.query.autor} }, function (err, videos) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la base de datos");
      } else res.status(200).json(videos);
    });
});

app.get("/api/videos/:id", function (req, res) {
    //busca un registro por id
    Videos.findById(req.params.id, function (err, videos) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (videos != null) {  
          res.status(200).json(videos);
        } else res.status(404).send("No se encontro ese video");
      }
    });
 });

app.post("/api/videos", function (req, res) {
    //crea un objeto pero del modelo Video
    const videos1 = new Videos({
      _id: req.body.id,      
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      duracion: req.body.duracion,
      autor: req.body.autor,
      enlace: req.body.enlace,
      fechah: new Date(2022, 05, 21), 
    });

      //guarda una persona en la base de datos
    videos1.save(function (error, videos1) {
    if (error) {
      res.status(500).send("No se ha podido agregar.");
    } else {
      res.status(200).json(videos1); //envía al cliente el id generado
    }
    });
});

app.put("/api/videos/:id", function (req, res) {
    //Modificar con Find ID
    Videos.findById(req.params.id, function (err, videos) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (videos != null) {
            videos.titulo = req.body.titulo;
            videos.descripcion = req.body.descripcion;
            videos.duracion = req.body.duracion;
            videos.autor = req.body.autor;
            videos.enlace = req.body.enlace;
  
          videos.save(function (error, videos1) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Modificado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro ese video");
      }
    });
  });
  
app.delete("/api/videos/:id", function (req, res) {
    //Eliminar con Find ID
    Videos.findById(req.params.id, function (err, videos) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (videos != null) {
          videos.remove(function (error, result) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Eliminado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro ese video");
      }
    });
});