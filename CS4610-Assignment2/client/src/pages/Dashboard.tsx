import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Dashboard = () => {
    const navigate = useNavigate();
    const api = useApi();
    const { id, reptileId } = useParams();
    const [showAddReptileModal, setShowAddReptileModal] = useState(false);
    const [newReptileName, setNewReptileName] = useState("");
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [newReptileSpecies, setNewReptileSpecies] = useState('');
    const [newReptileSex, setNewReptileSex] = useState('');
    const [reptileData, setReptileData] = useState([] as Reptile[])
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        getUserId();
        if (reptileData.length > 0) {
          getReptiles();
        }
        if (schedules.length > 0 && userId) {
            getSchedules();
        }
      }, [reptileData, schedules, userId]);

    type Schedule = {
        id: number,
        reptileId: number,
        userId: number,
        type: string,
        description: string,
        monday: boolean,
        tuesday: boolean,
        wednesday: boolean,
        thursday: boolean,
        friday: boolean,
        saturday: boolean,
        sunday: boolean,
        createdAt: Date,
        updatedAt: Date
    }    

    type Reptile = {
        id: number,
        userId: number,
        species: string,
        name: string,
        sex: string,
        createdAt: Date,
        updatedAt: Date
    }

    function getUserId() {
        fetch('/me')
            .then(response => response.json())
            .then(data => {
                const userId = data.user.id;
                setUserId(userId);
            })
            .catch(error => console.error(error));
    }


    function getReptiles(){
    api.get('../reptile/' + id)
    .then(response => response.json())
    .then(data => setReptileData(data as Reptile[]))
    }

    function getSchedules(){
        api.get('../'+ userId +'/schedules')
        .then(response => response.json())
        .then(data => setSchedules(data as Schedule[])) 
    }

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        navigate("/", { replace: true });
    };


const handleAddReptile = async () => {
  const newReptile = {
    userId: Number(userId),
    species: newReptileSpecies,
    name: newReptileName,
    sex: newReptileSex,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Send POST request to add new reptile
  const response = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newReptile)
  });
  const addedReptile = await response.json();

  // Add new reptile to list of reptiles
  setReptileData([...reptileData, addedReptile]);

  // Hide the add reptile modal and reset form inputs
  setShowAddReptileModal(false);
  setNewReptileName("");
  setNewReptileSpecies("");
  setNewReptileSex("");
};


    return (
        <div>
            <h2>Welcome to your Dashboard:</h2>

            <h3>List of Reptiles:</h3>
            <ul>
                {reptileData && reptileData.map((reptile) => (
                    <li key={reptile.id}>
                        {/* <button onClick={() => navigate('../reptile/' + id + '/' + reptile.id, {replace: true})}>{reptile.name}</button> */}
                        <button onClick={() => navigate('../reptile/' + reptile.id, {replace: true})}>{reptile.name}</button>

                    </li>
                ))}
            </ul>   

            <button onClick={() => setShowAddReptileModal(true)}>Add Reptile</button>

            {showAddReptileModal && (
                <div>

                    <div>
                        <label htmlFor="newReptileName">Name:</label>
                        <input type="text" id="newReptileName" value={newReptileName} onChange={(e) => setNewReptileName(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="newReptileSpecies">Species:</label>
                        <input type="text" id="newReptileSpecies" value={newReptileSpecies} onChange={(e) => setNewReptileSpecies(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="newReptileSex">Sex:</label>
                        <input type="text" id="newReptileSex" value={newReptileSex} onChange={(e) => setNewReptileSex(e.target.value)} />
                    </div>

                    <button onClick={handleAddReptile}>Add</button>
                </div>
            )}

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
