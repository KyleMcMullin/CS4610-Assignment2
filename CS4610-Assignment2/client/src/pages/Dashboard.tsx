import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

interface Reptile {
    id: number;
    name: string;
}

interface Schedule {
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


    const handleLogout = () => {
        window.localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const handleAddReptile = () => {
        const newReptile = {
            id: Math.floor(Math.random() * 1000), // generate a random id
            userId: userId, // assuming you have a variable named currentUserId that holds the current user's id
            species: newReptileSpecies, // assuming you have a variable named newReptileSpecies that holds the new reptile's species
            name: newReptileName,
            sex: newReptileSex, // assuming you have a variable named newReptileSex that holds the new reptile's sex
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // add the new reptile to the list of reptiles
        setReptileData([...reptileData as Reptile[], newReptile as unknown as Reptile]);
        // hide the add reptile modal
        setShowAddReptileModal(false);
        // reset the new reptile form inputs
        setNewReptileName('');
        setNewReptileSpecies('');
        setNewReptileSex('');
    }


    useEffect(() => {
        getReptiles();
    }, [])
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
        api.get('../reptile/' + reptileId)
            .then(response => response.json())
            .then(data => setReptileData(data as Reptile[]))
    }


    useEffect(() => {
        api.get(`/${userId}/schedules`).then((response) => {
            setSchedules(response.data.schedules);
        });
    }, []);

    return (
        <div>
            <h2>Welcome to your Reptile Dashboard:</h2>

            <h3>List of Reptiles:</h3>
            <ul>
                {reptileData.map((reptile) => (
                    <li key={reptile?.id}>
                        <Link to={`/reptile/${reptile?.id}`}>{reptile?.name}</Link>
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

            {/* <h3>List of Schedules:</h3>
            <ul>
                {schedules.map((schedule) => (
                    <li key={schedule.id}>
                        <p>Reptile Id: {schedule.reptileId}</p>
                        <p>Type: {schedule.type}</p>
                        <p>Description: {schedule.description}</p>
                        <p>Days:</p>
                        <ul>
                            <li>Monday: {schedule.monday ? "Yes" : "No"}</li>
                            <li>Tuesday: {schedule.tuesday ? "Yes" : "No"}</li>
                            <li>Wednesday: {schedule.wednesday ? "Yes" : "No"}</li>
                            <li>Thursday: {schedule.thursday ? "Yes" : "No"}</li>
                            <li>Friday: {schedule.friday ? "Yes" : "No"}</li>
                            <li>Saturday: {schedule.saturday ? "Yes" : "No"}</li>
                            <li>Sunday: {schedule.sunday ? "Yes" : "No"}</li>
                        </ul>
                    </li>
                ))}
            </ul> */}

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
