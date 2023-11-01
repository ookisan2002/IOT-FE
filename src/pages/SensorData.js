import { AgGridReact } from "ag-grid-react";

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise'
import { useEffect, useState } from "react";
import TimeFilter from "../Component/TimeFilter";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';


let stompClient = null;
const SensorData=()=>{
    const [sensorData,setSensorData]=useState([])
    const [sensorDataFilter,setSensorDataFilter]=useState([])
    const [filter,setFilter] = useState('All');
    const [columnDefs,setColumnDefs]=useState([
        {field: 'ID',  sortable: true},
        {field: 'Sensor',  filter: true,enableRowGroup: true},
        {field: 'Temperature',  sortable: true, filter: true},
        {field: 'Humidity', sortable: true, filter: true},
        {field: 'Dust', sortable: true, filter: true},
        {field: 'Light', sortable: true, filter: true},
        {
            field: 'Date',
            sortable: true,
            enableRowGroup: true,
            filter: 'agDateColumnFilter', // Sử dụng filter dạng ngày tháng
            filterParams: {
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                  const cellDate = new Date(cellValue);
                  const newCellDate = new Date(
                    cellDate.getFullYear(),
                    cellDate.getMonth(),
                    cellDate.getDate()
                  );
                  const filterDate = new Date(
                    filterLocalDateAtMidnight.getFullYear(),
                    filterLocalDateAtMidnight.getMonth(),
                    filterLocalDateAtMidnight.getDate()
                  );
              
                  if (newCellDate < filterDate) {
                    return -1;
                  } else if (newCellDate > filterDate) {
                    return 1;
                  } else {
                    return 0;
                  }
                },
                browserDatePicker: true,
                minValidYear: 2000,
                maxValidYear: 2099
              }
        },
        {field: 'Time', sortable: true, filter: TimeFilter},
    ])
    const externalFilter=(type,value)=>{
      if(type=='Tem'){
        setSensorDataFilter(sensorData.filter((data)=> data.Temperature.toString().includes(value)))
      }else if(type=='Hu'){
        setSensorDataFilter(sensorData.filter((data)=> data.Humidity.toString().includes(value)))
      }else if(type=='Du'){
        setSensorDataFilter(sensorData.filter((data)=> data.Dust.toString().includes(value)))
      }else if(type=='Li'){
        setSensorDataFilter(sensorData.filter((data)=> data.Light.toString().includes(value)))
      }else if(type=='Da'){
        setSensorDataFilter(sensorData.filter((data)=> data.Date.toString().includes(value)))
      }else if(type=='Ti'){
        console.log(type,value)

        setSensorDataFilter(sensorData.filter((data)=> data.Time.toString().includes(value)))
      }else if(type=='All'){
        setSensorDataFilter(sensorData)
      }
    }
    useEffect(() => {
      const onConnected = () => {
        stompClient.subscribe('/sensor/sensorData', onMessageReceived);
        stompClient.send("/app/sensorData", {}, '1');
          // console.log('ok');
      }
      const onMessageReceived = (payload)=>{
        const jsonObject = JSON.parse(payload.body);
        var solveArray = jsonObject.map((data_sensor,index)=>{
          return {
            'ID': index+1,
            'Sensor': 'Sensor 1',
            'Temperature': data_sensor.temperature,
            'Humidity': data_sensor.humidity,
            'Dust': data_sensor.dust,
            'Light': data_sensor.light,
            'Date': data_sensor.time.split(' ')[0],
            'Time': data_sensor.time.split(' ')[1]
          }
        })
        setSensorData(solveArray)
        setSensorDataFilter(solveArray)
      }
      const onError = (err) => {
          console.log(err);
          
      }
      const socket = new SockJS('http://IOT-BE-ws-deploy2-dev.ap-southeast-1.elasticbeanstalk.com/ws');
      stompClient= over(socket);
      stompClient.connect({},onConnected, onError);
      
      // Cleanup - Đóng kết nối khi component unmount
      
      return () => {
          socket.close();
      };
  }, []);
    const autoSizeColumns = (gridApi, columnApi) => {
      const allColumnIds = columnApi.getAllColumns().map((column) => column.getColId());
      columnApi.autoSizeColumns(allColumnIds);
    };
    const onRowGroupOpened = (params) => {
      const { api, columnApi } = params;
      console.log(params)
      autoSizeColumns(api, columnApi);
    };
    useEffect(()=>{console.log(sensorDataFilter)},[sensorDataFilter])
    return (
        <div className="relative w-[calc(100%-230px)] left-[230px] flex flex-col  h-screen">
            <h1 className="my-4 text-lg font-bold">Sensor Data</h1>
            <div class="bg-white p-4 rounded-lg flex mb-3 content-center mx-1">
              <div class="relative mt-2 max-w-xs text-gray-500 flex">
                  <div class="inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                      <select class="text-sm outline-none rounded-lg h-full" value={filter} onChange={(e)=>{setFilter(e.target.value)}}>
                          <option value='All'>All</option>
                          <option value='Tem'>Temperature</option>
                          <option value='Hu'>Humidity</option>
                          <option value='Li'>Light</option>
                          <option value='Du'>Dust</option>
                          <option value='Ti'>Time</option>
                          <option value='Da'>Date</option>
                      </select>
                  </div>
                  <input type="text" class="w-full p-2 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg" onChange={(e)=>{externalFilter(filter,e.target.value)}}/>
              </div>
            </div>
            <div className="ag-theme-alpine mx-2 p-3 bg-slate-400 rounded-lg h-full">
                <div className="w-full h-full text-left">
                    <AgGridReact
                        rowGroupPanelShow="always"
                        onRowGroupOpened={onRowGroupOpened}
                        rowData={sensorDataFilter}
                        animateRows={true}
                        columnDefs={columnDefs}
                        defaultColDef={{flex:1}}
                        pagination={true}
                        paginationPageSize={10}
                        resizable={true}
      
                        enableCellTextSelection={true}
                    />
                </div>
            </div>
        </div>
    )
}
export default SensorData;