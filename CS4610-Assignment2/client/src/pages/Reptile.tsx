import { useState, useEffect} from 'react'
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Reptile = () => {
    const api = useApi();
    const {reptileId, userId} = useParams();
    const [feedData, setFeedData] = useState([] as Feeding[])
    const [husbandryData, setHusbandryData] = useState([] as HusbandryRecord[])
    const [scheduleData, setScheduleData] = useState([] as Schedule[])
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
    var updateFlag = false;

    useEffect(() => {
        getFeedings();
        getSchedules();
        getHusbandryRecords();
    }, [updateFlag])
    


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
    async function getHusbandryRecords(){
        try {
            const response = await api.get(`/reptile/${userId}/${reptileId}/husbandry`) as HusbandryRecord[];
            setHusbandryData(response)
        } catch (error) {
            console.error(error);
        }
    }


    async function getSchedules(){
        try {
            const response = await api.get(`/reptile/${reptileId}/schedules`) as Schedule[];
            setScheduleData(response)
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    }

    async function createFeeding(){
        const newFeeding = {
            userId: userId,
            reptileId: reptileId,
            foodItem: newFeedingFoodItem
        }
        const response = await api.post(`/reptile/${userId}/${reptileId}/feeding`,{body: newFeeding
        }) as Feeding;
        setNewFeedingFoodItem("");
        console.log("item" + newFeedingFoodItem)
        //setFeedData([...feedData, response]);
        updateFlag = !updateFlag;
    }
    async function createHusbandryRecord(){
        console.log(newHusbandryRecordLength)
        console.log(`reptileId: ${reptileId}, userId: ${userId}`);
        const newHusbandryRecord = {
            userId: userId,
            reptileId: reptileId,
            length: newHusbandryRecordLength,
            weight: newHusbandryRecordWeight,
            temperature: newHusbandryRecordTemperature,
            humidity: newHusbandryRecordHumidity
        }
        const response = await api.post(`/reptile/${userId}/${reptileId}/husbandry`,{
            body: newHusbandryRecord
        }) as HusbandryRecord;
        console.log(response);
        setNewHusbandryRecordLength("");
        setNewHusbandryRecordWeight("");
        setNewHusbandryRecordTemperature("");
        setNewHusbandryRecordHumidity("");
        updateFlag = !updateFlag;
    }

    async function createSchedule(){
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

        const response = await api.post(`/reptile/${userId}/${reptileId}/schedules`,{
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
        updateFlag = !updateFlag;
    }
    async function getFeedings(){
        try {
            const response = await api.get(`/reptile/${userId}/${reptileId}/feeding`) as Feeding[];
            console.log(response)
            setFeedData(response)
        } catch (error) {
            console.error(error);
        }
    }
    


    function handleHusbandryData(){
        if (husbandryData.length > 0 && husbandryData){
            return (
                <div>
                <h1>Husbandry Data</h1>
                {husbandryData.map((husbandry,index) => (
                    <ul key ={index}>
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
        else{
            return (
                <div>
                    <h1>No Husbandry Data</h1>
                </div>
            )
        }
    }
    function handleScheduleData(){
        if(scheduleData.length > 0 && scheduleData){
            return (
                <div>
                    <h1>Schedule Data</h1>
                {scheduleData.map((schedule,index) => (
                    <ul key={index}>
                    <li>
                        Type: {schedule.type}
                    </li>
                    <li>
                        Description: {schedule.description}
                    </li>
                    <li>
                        Monday: {schedule.monday}
                    </li>
                    <li>
                        Tuesday: {schedule.tuesday}
                    </li>
                    <li>
                        Wednesday: {schedule.wednesday}
                    </li>
                    <li>
                        Thursday: {schedule.thursday}
                    </li>
                    <li>
                        Friday: {schedule.friday}
                    </li>
                    <li>
                        Saturday: {schedule.saturday}
                    </li>
                    <li>
                        Sunday: {schedule.sunday}
                    </li>
                    </ul>
                ))}
                </div>

                    )
        }else{
            return (
                <div>
                    <h1>No Schedule Data</h1>
                </div>
            )
        }
    }
    function handleFeedingData(){
        if(feedData.length > 0 && feedData){
            console.log(feedData)
            return(
                <div>
                    <h1>Feeding Data</h1>
                    {feedData.map((feeding,index) => (
                        <ul key={index}>
                            <li>
                                Food Item: {feeding.foodItem}
                            </li>
                            <li>
                                Time: {feeding.time}
                            </li>
                        </ul>
                    ))}
                </div>
            )
                    }
        else{
            return(
                <div>
                    <h1>No Feeding Data</h1>
                </div>
            )
        }
    }

    return (
        <div>
        <h1>Reptile Page!</h1>
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
                            <input type="text" name="foodItem" value={newFeedingFoodItem} onChange={(e) => setNewFeedingFoodItem(e.target.value)}/>
                        </label>
                        <button onClick={createFeeding}>Create Feeding</button>
                        </div>
                </div>
                <div>
                    <h1>Create Husbandry Record</h1>
                    <div>
                        <label>
                            Length:
                            <input type="number" id="newHusbandryLength" value={newHusbandryRecordLength} onChange={(e) => setNewHusbandryRecordLength(e.target.value)}/>
                        </label>
                        <label>
                            Weight:
                            <input type="number" id="weight" value={newHusbandryRecordWeight} onChange={(e) => setNewHusbandryRecordWeight(e.target.value)}/>
                        </label>
                        <label>
                            Temperature:
                            <input type="number" id="temperature" value={newHusbandryRecordTemperature} onChange={(e) => setNewHusbandryRecordTemperature(e.target.value)}/>
                        </label>
                        <label>
                            Humidity:
                            <input type="text" id="humidity" value={newHusbandryRecordHumidity} onChange={(e) => setNewHusbandryRecordHumidity(e.target.value)}/>
                        </label>
                        <button onClick={createHusbandryRecord}>Add</button>
                        </div>
                    </div>
                    <div>
                        <h1>Create Schedule</h1>
                        <div>
                            <label>
                                Type:
                                <input type="text" id="type" value={newScheduleType} onChange={(e) => setNewScheduleType(e.target.value)}/>
                            </label>
                            <label>
                                Description:
                                <input type="text" id="description" value={newScheduleDescription} onChange={(e) => setNewScheduleDescription(e.target.value)}/>
                            </label>
                            <label>
                                Monday
                        <input type='checkbox' id="monday" checked={newScheduleMonday} onChange={e => setNewScheduleMonday(e.target.checked)}/>
                            </label>
                            <label>
                                Tuesday
                    <input type='checkbox' id="tuesday" checked={newScheduleTuesday} onChange={e => setNewScheduleTuesday(e.target.checked)}/>
                            </label>
                            <label>
                                Wednesday
                    <input type='checkbox' id="wednesday" checked={newScheduleWednesday} onChange={e => setNewScheduleWednesday(e.target.checked)}/>
                            </label>
                            <label>
                                Thursday
                    <input type='checkbox' id="thursday" checked={newScheduleThursday} onChange={e => setNewScheduleThursday(e.target.checked)}/>
                            </label>
                            <label>
                                Friday
                    <input type='checkbox' id="friday" checked={newScheduleFriday} onChange={e => setNewScheduleFriday(e.target.checked)}/>
                            </label>
                            <label>
                                Saturday
                    <input type='checkbox' id="saturday" checked={newScheduleSaturday} onChange={e => setNewScheduleSaturday(e.target.checked)}/>
                            </label>
                            <label>
                                Sunday
                    <input type='checkbox' id="sunday" checked={newScheduleSunday} onChange={e => setNewScheduleSunday(e.target.checked)}/>
                            </label>
                            <button onClick={createSchedule}>Add</button>
                            </div>
                            </div>
                        

        </div>
    )
}