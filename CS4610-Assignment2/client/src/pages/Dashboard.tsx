import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Dashboard = () => {
    const navigate = useNavigate();
    const api = useApi();
    const [showAddReptileModal, setShowAddReptileModal] = useState(false);
    const [newReptileName, setNewReptileName] = useState("");
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [newReptileSpecies, setNewReptileSpecies] = useState('');
    const [newReptileSex, setNewReptileSex] = useState('');


    const [reptileData, setReptileData] = useState([] as Reptile[])

    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        getUserId();
    }, []);

    const getUserId = async () => {
        try {
            const response = await fetch("/me");
            const data = await response.json();
            const userId = data.user.id;
            setUserId(userId);
            getReptiles(userId);
            getSchedules(userId);
        } catch (error) {
            console.error(error);
        }
    };

    const getReptiles = async (userId: number) => {
        try {
            const response = await fetch("../reptile/" + userId);
            const data = await response.json();
            setReptileData(data);
        } catch (error) {
            console.error(error);
        }
    };

    function getSchedules(userId: number){
        api.get('../'+ userId +'/schedules')
            .then(response => response.json())
            .then(data => setSchedules(data as Schedule[]))
    }

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


    const handleLogout = () => {
        window.localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const handleAddReptile = async () => {
        const newReptileData = {
            userId: userId, // replace with the actual user ID
            species: newReptileSpecies,
            name: newReptileName,
            sex: newReptileSex,
        };
        const response = await api.post("/reptile", newReptileData);
        console.log(response.reptile.id);
        const newReptile = {
            id: response.reptile.id,
            name: response.reptile.name,
            species: response.reptile.species,
            sex: response.reptile.sex,
            userId: response.reptile.userId,
            createdAt: response.reptile.createdAt,
            updatedAt: response.reptile.updatedAt
        };
        setReptileData([...reptileData, newReptile]);
        setNewReptileName("");
        setNewReptileSpecies("");
        setNewReptileSex("");
        setShowAddReptileModal(false);
    };



    return (
        <div>
            <h2>Welcome to your Dashboard:</h2>

            <h3>List of Reptiles:</h3>
            <ul>
                {reptileData && reptileData.map((reptile) => (
                    <li key={reptile.id}>
                        <button onClick={() => navigate("../reptile/" + reptile.id, { replace: true })}>
                            {reptile.name}
                        </button>
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
