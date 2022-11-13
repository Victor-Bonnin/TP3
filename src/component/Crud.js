import { useState, useEffect } from "react";

export default function Crud() {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [color, setColor] = useState("");
  const [dogs, setDogs] = useState([]);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  async function getDogs() {
    const response = await fetch("http://localhost:5000/dogs");
    const data = await response.json();
    setDogs(data);
  }

  useEffect(() => {
    getDogs();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!edit) {
      const response = await fetch("http://localhost:5000/dogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          race,
          color,
        }),
      });
      await response.json();
    } else {
      const response = await fetch(`http://localhost:5000/dogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          race,
          color,
        }),
      });
      await response.json();
      setEdit(false);
      setId("");
    }
    await getDogs();
    setName("");
    setRace("");
    setColor("");
  }

  async function deleteDog(id) {
    const response = await fetch(`http://localhost:5000/dogs/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    await getDogs();
  }

  async function getDog(id) {
    const data = await fetch(`http://localhost:5000/dogs/${id}`);
    const dog = await data.json();
    setName(dog.name);
    setRace(dog.race);
    setColor(dog.color);
    setEdit(true);
    setId(dog.id);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>
          Nom
          <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
        </label>
        <label>
          Race
          <input type="text" onChange={(e) => setRace(e.target.value)} value={race} />
        </label>
        <label>
          Couleur
          <input type="text" onChange={(e) => setColor(e.target.value)} value={color} />
        </label>
        <button>{edit ? "Modifier" : "Ajouter"}</button>
      </form>
      <ul>
        {dogs.map((dog) => (
          <li className="dog" key={dog.id}>
            {dog.name} | {dog.race} | {dog.color}
            <button onClick={() => deleteDog(dog.id)}>Supprimer</button>
            <button
              onClick={() => {
                getDog(dog.id);
              }}
            >
              Modifier
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
