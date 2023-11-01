import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { DateFilter } from 'ag-grid-community';

import {over} from 'stompjs';
import SockJS from 'sockjs-client';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import RangeStringFilter from "../Component/TimeFilter";

let stompClient = null;
const History = () => {
    const [historyData, setHistoryData] = useState([]);
    const [historyDataFilter, setHistoryDataFilter] = useState([]);
    const [filter,setFilter] = useState('All');
    const [columnDefs, setColumnDefs] = useState([
        { field: 'ID', sortable: true },
        { field: 'Sensor', filter: true },
        { field: 'Device', filter: true },
        {
            field: 'Date',
            sortable: true,
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
                maxValidYear: 2099,
              }
        },
        {
            field: 'Time',
            sortable: true,
            filter: RangeStringFilter,
        },
        { field: 'Information', filter: true }
    ]);
    const externalFilter=(type,value)=>{
      if(type=='Da'){
        setHistoryDataFilter(historyData.filter((data)=> data.Date.toString().includes(value)))
      }else if(type=='Ti'){
        setHistoryDataFilter(historyData.filter((data)=> data.Time.toString().includes(value)))
      }else if(type=='All'){
        setHistoryDataFilter(historyData)
      }
      // console.log(historyData.filter((data)=> data.Time==value))
      console.log(type,value)
    }
    useEffect(() => {
        const onConnected = () => {
            stompClient.subscribe('/sensor/history', onMessageReceived);
            stompClient.send("/app/history", {}, '1');
            // console.log('ok');
        }
        const onMessageReceived = (payload)=>{
          const jsonObject = JSON.parse(payload.body);
          var solverArray=jsonObject.map((data_change, index) => {
            return {
                'ID': index + 1,
                'Sensor': 'Sensor 1',
                'Device': data_change.device,
                'Date': data_change.time_change.split(' ')[0],
                'Time': data_change.time_change.split(' ')[1],
                'Information': `${data_change.data_change === 1 ? 'Turn on' : 'Turn off'}`
              }
            })
            console.log(solverArray)
          setHistoryData(solverArray)
          setHistoryDataFilter(solverArray)
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
    return (
        <div className="relative w-[calc(100%-230px)] left-[230px] flex flex-col h-screen">
            <h1 className="my-4 text-lg font-bold">History control</h1>
            <div class="bg-white p-4 rounded-lg flex mb-3 content-center">
              <div class="relative mt-2 max-w-xs text-gray-500 flex">
                  <div class="inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                      <select class="text-sm outline-none rounded-lg h-full" value={filter} onChange={(e)=>{setFilter(e.target.value)}}>
                          <option value='All'>All</option>
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
                        rowData={historyDataFilter}
                        animateRows={true}
                        columnDefs={columnDefs}
                        defaultColDef={{ flex: 1 }}
                        pagination={true}
                        paginationPageSize={10}
                    />
                </div>
            </div>
        </div>
    )
}

export default History;
