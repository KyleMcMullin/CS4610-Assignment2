import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

interface Reptile {
    id: number;
    name: string;
    // Add other properties here
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
    const [firstName, setFirstName] = useState("");
    const [reptiles, setReptiles] = useState<Reptile[]>([]);
    const [showAddReptileModal, setShowAddReptileModal] = useState(false);
    const [newReptileName, setNewReptileName] = useState("");
    const [schedules, setSchedules] = useState<Schedule[]>([]);

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const handleAddReptile = async () => {
        const userId = window.localStorage.getItem("userId");
        const response = await api.post(`/reptile/${userId}`, { name: newReptileName });
        const newReptile = response.data;
        setReptiles([...reptiles, newReptile]);
        setShowAddReptileModal(false);
        setNewReptileName("");
    };

    useEffect(() => {
        const userId = window.localStorage.getItem("userId");
        api.get(`/reptile/${userId}`).then((response) => {
            response.json().then((data: Reptile[]) => {
                setReptiles(data);
            });
        });
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/users/current"); // make API call to get current user's data
                setFirstName(response.data.firstName); // set the first name in the state
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const userId = window.localStorage.getItem("userId");
        api.get(`/${userId}/schedules`).then((response) => {
            setSchedules(response.data.schedules);
        });
    }, []);

    // #TODO Uncomment when you figure out token issues

    // useEffect(() => {
    //     if (!window.localStorage.getItem("token")) {
    //         navigate("/", {
    //             replace: true
    //         })
    //     }
    // }, [])

    return (
        <div>
            <h2>Welcome to {firstName} Dashboard:</h2>

            <h3>List of Reptiles:</h3>
            <ul>
                {reptiles.map((reptile) => (
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
                    <button onClick={handleAddReptile}>Add</button>
                </div>
            )}

            <h3>List of Schedules:</h3>
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
            </ul>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
