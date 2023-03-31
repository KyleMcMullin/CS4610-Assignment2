import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Dashboard = () => {
    const navigate = useNavigate();
    const api = useApi();
    const [showAddReptileModal, setShowAddReptileModal] = useState(false);
    const [newReptileName, setNewReptileName] = useState("");
    const [schedulesData, setSchedulesData] = useState([] as Schedule[]);
    const [newReptileSpecies, setNewReptileSpecies] = useState('');
    const [newReptileSex, setNewReptileSex] = useState('');

    const [reptileData, setReptileData] = useState([] as Reptile[]);

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

    const getSchedules= async(userId: number) => {
        try {
            const response = await fetch("../" + userId + "/schedules");
            const data = await response.json();
            setSchedulesData(data);
        } catch (error) {
            console.error(error);
        }
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

    async function handleDeleteReptile(id: number) {
        try {
            const response = await fetch(`/reptile/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete reptile');
            }
            // Remove the deleted reptile from the local data array
            setReptileData((prevData) => prevData.filter((reptile) => reptile.id !== id));
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div>
            <h2>Welcome to Your Dashboard:</h2>

            <h3>Your Schedule for Today:</h3>
            {schedulesData.length > 0 && schedulesData.map(schedules => (
                <ul key={schedules.id}>
                    <li>{schedules.type}</li>
                    <li>{schedules.description}</li>
                    <li>{schedules.monday}</li>
                    <li>{schedules.tuesday}</li>
                    <li>{schedules.wednesday}</li>
                    <li>{schedules.thursday}</li>
                    <li>{schedules.friday}</li>
                    <li>{schedules.saturday}</li>
                    <li>{schedules.sunday}</li>
                </ul>
            ))}


            <h3>Your Reptiles:</h3>
            <ul>
                {reptileData.length > 0 && reptileData && reptileData.map((reptile) => (
                    <ul key={reptile.id}>
                        <div className="reptile-div">
                            <div>
                                {reptile.name}
                            </div>
                            <button onClick={() => navigate("../reptile/" + reptile.id, { replace: true })}>Select</button>
                            <button onClick={() => handleDeleteReptile(reptile.id)}>Delete</button>
                        </div>

                    </ul>
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
