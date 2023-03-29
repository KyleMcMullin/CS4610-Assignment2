import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

type Reptile = {
    id: number;
    userId: number;
    species: string;
    name: string;
    sex: string;
    createdAt: Date;
    updatedAt: Date;
};

type Schedule = {
    id: number;
    reptileId: number;
    userId: number;
    type: string;
    description: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const Dashboard = () => {
    const [reptiles, setReptiles] = useState<Reptile[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const history = useHistory();

    useEffect(() => {
        const fetchReptiles = async () => {
            try {
                const response = await fetch("/reptiles");
                const data = await response.json();
                setReptiles(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSchedules = async () => {
            const day = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
            try {
                const response = await fetch(`/schedules/${day}`);
                const data = await response.json();
                setSchedules(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReptiles();
        fetchSchedules();
    }, []);

    const handleAddReptile = () => {
        history.push("/add-reptile");
    };

    const handleEditReptile = (id: number) => {
        history.push(`/edit-reptile/${id}`);
    };

    const handleDeleteReptile = async (id: number) => {
        try {
            await fetch(`/reptiles/${id}`, {
                method: 'DELETE',
            });
            setReptiles(reptiles.filter((reptile) => reptile.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleAddReptile}>Add Reptile</button>
            {reptiles.map((reptile) => (
                <div key={reptile.id}>
                    <h2>{reptile.name}</h2>
                    <p>Species: {reptile.species}</p>
                    <p>Sex: {reptile.sex}</p>
                    <button onClick={() => handleEditReptile(reptile.id)}>Edit</button>
                    <button onClick={() => handleDeleteReptile(reptile.id)}>Delete</button>
                </div>
            ))}
            <h2>Schedule for today</h2>
            {schedules.length > 0 ? (
                schedules.map((schedule) => (
                    <div key={schedule.id}>
                        <h3>{schedule.type}</h3>
                        <p>{schedule.description}</p>
                        <p>Monday: {schedule.monday ? "Yes" : "No"}</p>
                        <p>Tuesday: {schedule.tuesday ? "Yes" : "No"}</p>
                        <p>Wednesday: {schedule.wednesday ? "Yes" : "No"}</p>
                        <p>Thursday: {schedule.thursday ? "Yes" : "No"}</p>
                        <p>Friday: {schedule.friday ?"Yes" : "No"}</p>
                        <p>Saturday: {schedule.saturday ? "Yes" : "No"}</p>
                        <p>Sunday: {schedule.sunday ? "Yes" : "No"}</p>
                    </div>
                )))}
        </div>
    );
};
export default Dashboard;