import React, { useState } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const NovaPublicacao = () => {
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const handleUpload = async () => {
    setCarregando(true);
    try {
      const urls = await Promise.all(
        [...imagens].map(async (img) => {
          const imgRef = ref(storage, `publicacoes/${uuidv4()}-${img.name}`);
          await uploadBytes(imgRef, img);
          return await getDownloadURL(imgRef);
        })
      );


      await addDoc(collection(db, "publicacoes"), {
        descricao,
        localizacao,
        imagens: urls,
        criadoEm: Timestamp.now(),
      });

      alert("Publicação enviada!");
      setDescricao("");
      setLocalizacao("");
      setImagens([]);
    } catch (e) {
      console.error(e);
      alert("Erro ao criar publicação");
    }
    setCarregando(false);
  };

  return (
    <div>
      <h2>Criar Nova Publicação</h2>
      <input
        type="text"
        placeholder="Localização"
        value={localizacao}
        onChange={(e) => setLocalizacao(e.target.value)}
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImagens(e.target.files)}
      />
      <button onClick={handleUpload} disabled={carregando}>
        {carregando ? "Enviando..." : "Publicar"}
      </button>
    </div>
  );
};

export default NovaPublicacao;
