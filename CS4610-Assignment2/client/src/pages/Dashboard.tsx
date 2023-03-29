import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Dashboard = () => {
    const navigate = useNavigate();
    const api = useApi();
    const { id, userId, reptileId } = useParams();
    const [showAddReptileModal, setShowAddReptileModal] = useState(false);
    const [newReptileName, setNewReptileName] = useState("");
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [newReptileSpecies, setNewReptileSpecies] = useState('');
    const [newReptileSex, setNewReptileSex] = useState('');
    const [reptileData, setReptileData] = useState([] as Reptile[])
    
    useEffect(() => {
        getReptiles();
        getSchedules();
    }, [])

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

   function getReptiles(){
    api.get('../reptile/' + id)
    .then(response => response.json())
    .then(data => setReptileData(data as Reptile[]))
}

    function getSchedules(){
        fetch('/schedules')
    }

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const handleAddReptile = () => {
        const newReptile = {
            id: reptileData.length + 1, // parse id to a number
            userId: Number(userId),
            species: newReptileSpecies,
            name: newReptileName,
            sex: newReptileSex,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // add the new reptile to the list of reptiles
        setReptileData([...reptileData, newReptile]);
        // hide the add reptile modal
        setShowAddReptileModal(false);
        // reset the new reptile form inputs
        setNewReptileName('');
        setNewReptileSpecies('');
        setNewReptileSex('');
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

                    <label htmlFor="newReptileName">Name:</label>
                    <input type="text" id="newReptileName" value={newReptileName} onChange={(e) => setNewReptileName(e.target.value)} />

                    <label htmlFor="newReptileSpecies">Species:</label>
                    <input type="text" id="newReptileSpecies" value={newReptileSpecies} onChange={(e) => setNewReptileSpecies(e.target.value)} />

                    <label htmlFor="newReptileSex">Sex:</label>
                    <input type="text" id="newReptileSex" value={newReptileSex} onChange={(e) => setNewReptileSex(e.target.value)} />

                    <button onClick={handleAddReptile}>Add</button>
                </div>
            )}

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
