import { useState, useEffect} from 'react'
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Reptile = () => {
    const api = useApi();
    const { id, reptileId } = useParams();
    const [feedData, setFeedData] = useState({} as Feeding[])
    const [husbandryData, setHusbandryData] = useState({} as HusbandryRecord[])
    const [scheduleData, setScheduleData] = useState({} as Schedule[])

    useEffect(() => {
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
    api.get('http://localhost:3000/reptile/' + id + '/' + reptileId + '/husbandry')
    .then(response => response.json())
    .then(data => setHusbandryData((prevHusbandryData) => [...prevHusbandryData, data as HusbandryRecord]))
    };


    function getSchedules(){
        fetch('http://localhost:3000/reptile/' + id + '/' + reptileId + '/schedules')
    }
    // function updateReptile(updatedReptile: Reptile){
    //     api.put('http://localhost:3000/reptile/' + id + '/' + reptileId,{body: JSON.stringify(updatedReptile)})
    // }
    function createFeeding(newFeeding: Feeding){
        api.post('http://localhost:3000/reptile/' + id + '/' + reptileId + '/feeding',{body: JSON.stringify(newFeeding)
        })
    }
    function createHusbandryRecord(newHusbandryRecord: HusbandryRecord){
        api.post("http://localhost:3000/reptile/" + id + "/" + reptileId + "/husbandry",{
            body: JSON.stringify(newHusbandryRecord)
        })
    }
    function createSchedule(newSchedule: Schedule){
        api.post("http://localhost:3000/reptile/" + id + "/" + reptileId + "/schedules",{
            body: JSON.stringify(newSchedule)
        })
    }
    function getFeedings(){
    api.get('http://localhost:3000/reptile/' + id + '/' + reptileId + '/feeding')
    .then(data => setFeedData((prevFeedData) => [...prevFeedData, data as Feeding]))};



    return (
        <div>
        <h1>Reptile Page!</h1>
        <div>
            <h1>Feeding Data</h1>
            <ul>
            {feedData?.map(feed => (
                <li key={feed.id}>
                    {feed.foodItem} {feed.time}
                </li>
                ))}
            </ul>
        </div>
        <div>
            <h1>Husbandry Data</h1>
            <ul>
            {husbandryData?.map(husbandry => (
                <li key={husbandry.id}>
                    {husbandry.length} {husbandry.weight} {husbandry.temperature} {husbandry.humidity}
                </li>
                ))}
            </ul>
            </div>
            <div>
                <h1>Schedules</h1>
                <ul>
                {scheduleData?.map(schedule => (
                    <li key={schedule.id}>
                        {schedule.type} {schedule.description} {schedule.monday} {schedule.tuesday} {schedule.wednesday} {schedule.thursday} {schedule.friday} {schedule.saturday} {schedule.sunday}
                    </li>
                    ))}
                </ul>
                </div>
                <div>
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
                </div>
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
                    <form>
                        <label>
                            Length:
                            <input type="text" name="length" />
                        </label>
                        <label>
                            Weight:
                            <input type="text" name="weight" />
                        </label>
                        <label>
                            Temperature:
                            <input type="text" name="temperature" />
                        </label>
                        <label>
                            Humidity:
                            <input type="text" name="humidity" />
                        </label>
                    </form>
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
