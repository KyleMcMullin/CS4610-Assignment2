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
    useEffect(() => {
        console.log(userId)
        getFeedings();
        getHusbandryRecords();
        getSchedules();
    }, [])
    


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
    function getHusbandryRecords(){
    api.get('/husbandry')
    .then(response => response.json())
    .then(data => setHusbandryData((prevHusbandryData) => [...prevHusbandryData, data as HusbandryRecord]))
    };


    function getSchedules(){
        fetch('/schedules')
    }
    // function updateReptile(updatedReptile: Reptile){
    //     api.put('http://localhost:3000/reptile/' + id + '/' + reptileId,{body: JSON.stringify(updatedReptile)})
    // }
    function createFeeding(newFeeding: Feeding){
        api.post('/feeding',{body: JSON.stringify(newFeeding)
        })
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

        // const newRecord = {

        //     id: response.id,
        //     reptileId: response.reptileId as number,
        //     length: response.length as number,
        //     weight: response.weight as number,
        //     temperature: response.temperature as number,
        //     humidity: response.humidity as number
        // }
        setHusbandryData([...husbandryData, response]);
    }

    function createSchedule(newSchedule: Schedule){
        api.post("/schedules",{
            body: JSON.stringify(newSchedule)
        })
    }
    function getFeedings(){
    api.get('/feeding')
    .then(data => setFeedData((prevFeedData) => [...prevFeedData, data as Feeding]))};



    return (
        <div>
        <h1>Reptile Page!</h1>
        <div>
            <h1>Feeding Data</h1>
            <ul>
            {feedData.length > 0 && feedData && feedData?.map(feed => (
                <li key={feed.id}>
                    {feed.foodItem} {feed.time}
                </li>
                ))}
            </ul>
        </div>
        <div>
            <h1>Husbandry Data</h1>
            <ul>
            {husbandryData.length > 0 && husbandryData && husbandryData?.map(husbandry => (
                <li key={husbandry.id}>
                    {husbandry.length} {husbandry.weight} {husbandry.temperature} {husbandry.humidity}
                </li>
                ))}
            </ul>
            </div>
            <div>
                <h1>Schedules</h1>
                <ul>
                {scheduleData.length > 0 && scheduleData.map(schedule => (
                    <li key={schedule.id}>
                        {schedule.type} {schedule.description} {schedule.monday} {schedule.tuesday} {schedule.wednesday} {schedule.thursday} {schedule.friday} {schedule.saturday} {schedule.sunday}
                    </li>
                    ))}
                </ul>
                </div>
                {/* <div>
                    <h1>Update Reptile</h1>
                    <form>
                        <label>
                            Name:
                            <input type="text" name="name" />
                        </label>
                        <label>
                            Species:
                            <input type="text" name="species" />
                        </label>
                        </form>
                </div> */}
                <div>
                    <h1>Create Feeding</h1>
                    <form>
                        <label>
                            Food Item:
                            <input type="text" name="foodItem" />
                        </label>
                        <label>
                            Time:
                            <input type="text" name="time" />
                        </label>
                        </form>
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
                            <input type="number" name="weight" value={newHusbandryRecordWeight} onChange={(e) => setNewHusbandryRecordWeight(e.target.value)}/>
                        </label>
                        <label>
                            Temperature:
                            <input type="number" name="temperature" value={newHusbandryRecordTemperature} onChange={(e) => setNewHusbandryRecordTemperature(e.target.value)}/>
                        </label>
                        <label>
                            Humidity:
                            <input type="text" name="humidity" value={newHusbandryRecordHumidity} onChange={(e) => setNewHusbandryRecordHumidity(e.target.value)}/>
                        </label>
                        <button onClick={createHusbandryRecord}>Add</button>
                        </div>
                    </div>
                    <div>
                        <h1>Create Schedule</h1>
                        <form>
                            <label>
                                Type:
                                <input type="text" name="type" />
                            </label>
                            <label>
                                Description:
                                <input type="text" name="description" />
                            </label>
                            </form>
                            </div>
                        

        </div>
    )
}



//   export const App = (id: String, reptileId: String) =>{

//     useEffect(() => {
//         getFeedings();
//       }, []);







//     return (
//         <div>
//             <div>
//                 <h1>Reptile</h1>
//             </div>
//             <ul>
//             {feedData?.map(feed => (
//                 <li key={feed.id}>
//                     {feed.foodItem} {feed.time}
//                 </li>
//               ))}
//             </ul>
//         </div>
//     )
// }