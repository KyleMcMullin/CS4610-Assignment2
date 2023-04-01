import { useState, useEffect } from 'react'
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Reptile = () => {
    const navigate = useNavigate();
    const [feedData, setFeedData] = useState([] as Feeding[])
    const [husbandryData, setHusbandryData] = useState([] as HusbandryRecord[])
    const [scheduleData, setScheduleData] = useState([] as Schedule[])
    const api = useApi();
    const { reptileId, userId } = useParams();
    const [newHusbandryRecordLength, setNewHusbandryRecordLength] = useState("")
    const [newHusbandryRecordWeight, setNewHusbandryRecordWeight] = useState("")
    const [newHusbandryRecordTemperature, setNewHusbandryRecordTemperature] = useState("")
    const [newHusbandryRecordHumidity, setNewHusbandryRecordHumidity] = useState("")
    const [newFeedingFoodItem, setNewFeedingFoodItem] = useState("")
    const [newScheduleType, setNewScheduleType] = useState("")
    const [newScheduleDescription, setNewScheduleDescription] = useState("")
    const [newScheduleMonday, setNewScheduleMonday] = useState(false)
    const [newScheduleTuesday, setNewScheduleTuesday] = useState(false)
    const [newScheduleWednesday, setNewScheduleWednesday] = useState(false)
    const [newScheduleThursday, setNewScheduleThursday] = useState(false)
    const [newScheduleFriday, setNewScheduleFriday] = useState(false)
    const [newScheduleSaturday, setNewScheduleSaturday] = useState(false)
    const [newScheduleSunday, setNewScheduleSunday] = useState(false)
    const [updateFlag, setUpdateFlag] = useState(false)
    const [updateReptileName, setUpdateReptileName] = useState("")
    const [updateReptileSpecies, setUpdateReptileSpecies] = useState("")
    const [updateReptileSex, setUpdateReptileSex] = useState("")
    type Reptile = {
        id: number,
        userId: number,
        species: string,
        name: string,
        sex: string,
        createdAt: Date,
        updatedAt: Date
    }

    type Feeding = {
        id: number
        foodItem: String
        time: String
    }
    type HusbandryRecord = {
        id: number
        reptileId: number,
        length: number,
        weight: number,
        temperature: number,
        humidity: number
    }
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
    }
    async function getHusbandryRecords() {
        try {
            const response = await api.get(`/reptile/${userId}/${reptileId}/husbandry`) as HusbandryRecord[];
            setHusbandryData(response)
        } catch (error) {
            console.error(error);
        }
    }


    async function getSchedules() {
        try {
            const response = await api.get(`/reptile/${userId}/${reptileId}/schedules`)
            setScheduleData(response.schedules)
            var temp = response as Schedule[];
        } catch (error) {
            console.error(error);
        }
    }

    async function getFeedings() {
        try {
            const response = await api.get(`/reptile/${userId}/${reptileId}/feeding`) as Feeding[];
            setFeedData(response)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getFeedings();
        getSchedules();
        getHusbandryRecords();
        getReptile();
    }, [])


    async function getReptile() {
        const response = await api.get(`/reptile/${userId}/${reptileId}`) as Reptile;
        setUpdateReptileName(response.name);
        setUpdateReptileSpecies(response.species);
        setUpdateReptileSex(response.sex);
    }

    async function createFeeding() {
        const newFeeding = {
            userId: userId,
            reptileId: reptileId,
            foodItem: newFeedingFoodItem
        }
        const response = await api.post(`/reptile/${userId}/${reptileId}/feeding`, {
            body: newFeeding
        }) as Feeding;
        setNewFeedingFoodItem("");
        getFeedings();
    }
    async function createHusbandryRecord() {
        const newHusbandryRecord = {
            userId: userId,
            reptileId: reptileId,
            length: newHusbandryRecordLength,
            weight: newHusbandryRecordWeight,
            temperature: newHusbandryRecordTemperature,
            humidity: newHusbandryRecordHumidity
        }
        const response = await api.post(`/reptile/${userId}/${reptileId}/husbandry`, {
            body: newHusbandryRecord
        }) as HusbandryRecord;
        setNewHusbandryRecordLength("");
        setNewHusbandryRecordWeight("");
        setNewHusbandryRecordTemperature("");
        setNewHusbandryRecordHumidity("");
        // setHusbandryData([...husbandryData, response]);
        // setUpdateFlag(prev => !prev);
        getHusbandryRecords();
    }

    async function createSchedule() {
        const newSchedule = {
            reptileId: reptileId,
            userId: userId,
            type: newScheduleType,
            description: newScheduleDescription,
            monday: newScheduleMonday,
            tuesday: newScheduleTuesday,
            wednesday: newScheduleWednesday,
            thursday: newScheduleThursday,
            friday: newScheduleFriday,
            saturday: newScheduleSaturday,
            sunday: newScheduleSunday
        }

        const response = await api.post(`/reptile/${userId}/${reptileId}/schedules`, {
            body: newSchedule
        }) as Schedule;
        setNewScheduleDescription("");
        setNewScheduleType("");
        setNewScheduleMonday(false);
        setNewScheduleTuesday(false);
        setNewScheduleWednesday(false);
        setNewScheduleThursday(false);
        setNewScheduleFriday(false);
        setNewScheduleSaturday(false);
        setNewScheduleSunday(false);
        getSchedules();
        // if(scheduleData.length > 0){
        //     setScheduleData([...scheduleData, response]);
        // }
        // else{
        // setScheduleData([response]);
        // }
        // setUpdateFlag(prev => !prev);
    }




    function handleHusbandryData() {
        if (husbandryData.length > 0 && husbandryData) {
            return (
                <div>
                    <h1>Husbandry Data</h1>
                    {husbandryData.map((husbandry, index) => (
                        <ul key={index}>
                            <li>
                                Length: {husbandry.length}
                            </li>
                            <li>
                                Weight: {husbandry.weight}
                            </li>
                            <li>
                                Temperature: {husbandry.temperature}
                            </li>
                            <li>
                                Humidity: {husbandry.humidity}
                            </li>
                        </ul>
                    ))}
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>No Husbandry Data</h1>
                </div>
            )
        }
    }
    function handleScheduleData() {
        if (scheduleData.length > 0 && scheduleData) {
            return (
                <div>
                    <h1>Schedule Data</h1>
                    {scheduleData.map((schedule, index) => (
                        <ul key={index}>
                            <li>
                                Type: {schedule.type}
                            </li>
                            <li>
                                Description: {schedule.description}
                            </li>
                            <li>
                                Monday: {schedule.monday ? "true" : "false"}
                            </li>
                            <li>
                                Tuesday: {schedule.tuesday ? "true" : "false"}
                            </li>
                            <li>
                                Wednesday: {schedule.wednesday ? "true" : "false"}
                            </li>
                            <li>
                                Thursday: {schedule.thursday ? "true" : "false"}
                            </li>
                            <li>
                                Friday: {schedule.friday ? "true" : "false"}
                            </li>
                            <li>
                                Saturday: {schedule.saturday ? "true" : "false"}
                            </li>
                            <li>
                                Sunday: {schedule.sunday ? "true" : "false"}
                            </li>
                        </ul>
                    ))}
                </div>

            )
        } else {
            return (
                <div>
                    <h1>No Schedule Data</h1>
                </div>
            )
        }
    }

    async function updateReptile() {
        const updatedReptile = {
            id: reptileId,
            userId: userId,
            species: updateReptileSpecies,
            name: updateReptileName,
            sex: updateReptileSex
        }
        const response = await api.put(`/reptile/${reptileId}`, {
            body: updatedReptile
        }) as Reptile;
        setUpdateReptileName("");
        setUpdateReptileSpecies("");
        setUpdateReptileSex("");
    }
    function handleFeedingData() {
        if (feedData.length > 0 && feedData) {
            return (
                <div>
                    <h1>Feeding Data</h1>
                    {feedData.map((feeding, index) => (
                        <ul key={index}>
                            <li>
                                Food Item: {feeding.foodItem}
                            </li>
                            {/* <li>
                                Time: {feeding.time ? feeding.time : "No Time"}
                            </li> */}
                        </ul>
                    ))}
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>No Feeding Data</h1>
                </div>
            )
        }
    }

    return (
        <div>
            <h1>Reptile Page!</h1>
            <button onClick={() => { navigate('../../../dashboard/', { replace: true }) }}>Back to Dashboard</button>
            <div>
                {handleFeedingData()}
            </div>
            <div>
                {handleHusbandryData()}
            </div>
            <div>
                {handleScheduleData()}
            </div>
            <div>
                <h1>Create Feeding</h1>
                <div>
                    <label>
                        Food Item:
                        <input type="text" name="foodItem" value={newFeedingFoodItem} onChange={(e) => setNewFeedingFoodItem(e.target.value)} />
                    </label>
                    <button onClick={createFeeding}>Create Feeding</button>
                </div>
            </div>
            <div>                            <div>
                <h1>Update Reptile</h1>
                <div>
                    <label>
                        Name:
                        <input type="text" id="name" value={updateReptileName} onChange={(e) => setUpdateReptileName(e.target.value)} />
                    </label>
                    <label>
                        Species:
                        <input type="text" id="species" value={updateReptileSpecies} onChange={(e) => setUpdateReptileSpecies(e.target.value)} />
                    </label>
                    <label>
                        sex:
                        <input type='text' id="sex" value={updateReptileSex} onChange={(e) => setUpdateReptileSex(e.target.value)} />
                    </label>
                    <button onClick={updateReptile}>Update</button>
                </div>
                <h1>Create Husbandry Record</h1>
                <div>
                    <label>
                        Length:
                        <input type="number" id="newHusbandryLength" value={newHusbandryRecordLength} onChange={(e) => setNewHusbandryRecordLength(e.target.value)} />
                    </label>
                    <label>
                        Weight:
                        <input type="number" id="weight" value={newHusbandryRecordWeight} onChange={(e) => setNewHusbandryRecordWeight(e.target.value)} />
                    </label>
                    <label>
                        Temperature:
                        <input type="number" id="temperature" value={newHusbandryRecordTemperature} onChange={(e) => setNewHusbandryRecordTemperature(e.target.value)} />
                    </label>
                    <label>
                        Humidity:
                        <input type="text" id="humidity" value={newHusbandryRecordHumidity} onChange={(e) => setNewHusbandryRecordHumidity(e.target.value)} />
                    </label>
                    <button onClick={createHusbandryRecord}>Add</button>
                </div>
            </div>
                <div>
                    <h1>Create Schedule</h1>
                    <div>
                        <label>
                            Type:
                            <input type="text" id="type" value={newScheduleType} onChange={(e) => setNewScheduleType(e.target.value)} />
                        </label>
                        <label>
                            Description:
                            <input type="text" id="description" value={newScheduleDescription} onChange={(e) => setNewScheduleDescription(e.target.value)} />
                        </label>
                        <label>
                            Monday
                            <input type='checkbox' id="monday" checked={newScheduleMonday} onChange={e => setNewScheduleMonday(e.target.checked)} />
                        </label>
                        <label>
                            Tuesday
                            <input type='checkbox' id="tuesday" checked={newScheduleTuesday} onChange={e => setNewScheduleTuesday(e.target.checked)} />
                        </label>
                        <label>
                            Wednesday
                            <input type='checkbox' id="wednesday" checked={newScheduleWednesday} onChange={e => setNewScheduleWednesday(e.target.checked)} />
                        </label>
                        <label>
                            Thursday
                            <input type='checkbox' id="thursday" checked={newScheduleThursday} onChange={e => setNewScheduleThursday(e.target.checked)} />
                        </label>
                        <label>
                            Friday
                            <input type='checkbox' id="friday" checked={newScheduleFriday} onChange={e => setNewScheduleFriday(e.target.checked)} />
                        </label>
                        <label>
                            Saturday
                            <input type='checkbox' id="saturday" checked={newScheduleSaturday} onChange={e => setNewScheduleSaturday(e.target.checked)} />
                        </label>
                        <label>
                            Sunday
                            <input type='checkbox' id="sunday" checked={newScheduleSunday} onChange={e => setNewScheduleSunday(e.target.checked)} />
                        </label>
                        <button onClick={createSchedule}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}