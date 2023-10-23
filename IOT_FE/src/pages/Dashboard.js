import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import Loader from "./Loader";

const Dashboard = ()=>{
    const [buld,setBuld]=useState(false);
    const [conditioner,setConditioner]=useState(false);
    const [fan,setFan]=useState(false);
    const [dataSensor,setDataSnesor]=useState([{temperature:0,humidity:0,dust:77,light:0}]);
    const [isLoading,setIsLoading]=useState(true);
    const chartRef = useRef();
    useEffect(()=>{
            setTimeout(()=>{
                setIsLoading(false);
            },2100)
    },[])

    const data = {
            labels: ['14s', '12s', '10s', '8s', '6s', '4s', '2s'],
            datasets: [
              {
                label: 'Humidity',
                data: dataSensor.map(data => data.humidity),
                borderColor: '#2980b9',
                backgroundColor: '#2980b9',
                order: 1
              },
              {
                label: 'Temperature',
                data:   dataSensor.map(data => data.temperature) ,
                borderColor: '#ef3b36',
                backgroundColor: '#ef3b36',
                type: 'line',
                order: 0
              },
              {
                label: 'Dust',
                data:   dataSensor.map(data => data.dust) ,
                borderColor: 'yellow',
                backgroundColor: 'yellow',
                yAxisID: 'light-y-axis',
                type: 'line',
                order: 3
              }
            ]
          };
    const turnLight=(device)=>{
        var status= device==1 ?(buld?0:1) :(device==2 ?(conditioner?0:1) :(fan?0:1));
        fetch(`http://localhost:8080/onChange/${device}${status}`)
                .then((res) => res.json())
                .then((data) => {
                    
                    if(device==1){
                        if(data){setBuld(prevBuld=> !prevBuld)}
                    }else if(device==2){
                        if(data){setConditioner(prevConditioner=> !prevConditioner)}
                    }else{
                        if(data){setFan(prevFan=> !prevFan)}
                    }
                })
                .catch((err) => console.log(err))
        
    }
    useEffect(() => {
        Chart.register(...registerables);
        var config = {
            type: "line",
            data: data,
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: 'white',
                            font: {
                                size: 20
                            },
                        }
                    }
                },
                scales: {
                    y: {
                        min:0,
                        max:100,
                        ticks: {
                            font: {
                                size: 20
                            },
                            color: 'white'
                        }
                    },
                    'light-y-axis': {
                        position: 'right',
                        min: 0,
                        max: 100,
                        ticks: {
                            font: {
                            size: 20
                            },
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 20
                            },
                            color: 'white'
                        }
                    }
                }
            }

        }
        var revenueChart = new Chart(chartRef.current, config);
        return () => { revenueChart.destroy(); }
    }, [dataSensor])
    useEffect(()=>{
        const getData=setInterval(()=>{
            fetch("http://localhost:8080/datas")
                .then((res) => res.json())
                .then((data) => {
                    setDataSnesor(data)
                })
                .catch((err) => console.log(err))
        },2100)
        return ()=>{
            clearInterval(getData);
        }
    },[])
    return (
        
        <div className="relative w-[calc(100%-230px)] left-[230px] flex flex-col  h-full">   

            <div className={`absolute w-full bg-white z-50 h-full top-0 left-0 ${isLoading?"":'hidden'}`}><Loader /></div>
            <h1 className="my-4 text-lg font-bold">Sensor Data</h1>
            <div className="flex justify-between mx-2 p-3 bg-slate-400 rounded-lg flex-wrap">
                <div className={`card_sensor !bg-gradient-to-tl ${dataSensor[0].temperature>10 ?(dataSensor[0].temperature>20 ?(dataSensor[0].temperature>30 ?'!from-red-700' :'!from-red-600') :'!from-red-500') :'!from-red-400'} !to-white`}>
                    <p className="card__title ">Temperature</p>
                    <p className="card__description !text-white !text-4xl ">{dataSensor[0].temperature+'℃'}</p>
                </div>
                <div className={`card_sensor !bg-gradient-to-tl ${dataSensor[0].humidity>10 ?(dataSensor[0].humidity>20 ?(dataSensor[0].humidity>30 ?'!from-blue-700' :'!from-blue-600') :'!from-blue-500') :'!from-blue-400'} !via-blue-300 !to-white`}>
                    <p className="card__title ">Humidity</p>
                    <p className="card__description !text-white !text-4xl ">{dataSensor[0].humidity+'%'}</p>
                </div>
                <div className={`card_sensor !bg-gradient-to-tl ${dataSensor[0].light>10 ?(dataSensor[0].light>20 ?(dataSensor[0].light>30 ?'!from-yellow-700' :'!from-yellow-600') :'!from-yellow-500') :'!from-yellow-400'} !to-white`}>
                    <p className="card__title ">Light</p>
                    <p className="card__description !text-white !text-4xl ">{dataSensor[0].light+' LUX'}</p>
                </div>
                <div className={`card_sensor !bg-gradient-to-tl ${dataSensor[0].dust>10 ?(dataSensor[0].dust>20 ?(dataSensor[0].dust>30 ?(dataSensor[0].dust>70 ?'danger_dust':'!from-violet-700') :'!from-violet-600') :'!from-violet-500') :'!from-violet-400'} !to-white `}>
                    <p className="card__title ">Dust</p>
                    <p className="card__description !text-white !text-4xl ">{dataSensor[0].dust+'m3'}</p>
                </div>
                <div className="w-full flex mt-4">
                    {/* <h1 className="text-white text-5xl font-bold mt-4">Chart data</h1> */}
                    <canvas className="!w-3/4 mt-auto" ref={chartRef} id="canvas"></canvas> 
                    <div className="w-1/4 p-2">
                        <div className="card mt-3 !w-full">
                            <i className={`bx bxs-sun text-5xl ${buld ?'text-yellow-400':''}`}></i>
                            <div className="card__content flex flex-col">
                                <p className="card__title">Light buld</p>
                                    <label className="containerbtn mt-7 mx-auto">
                                        <input type="checkbox" className="checkbox" onChange={()=>{turnLight(1)}} checked={buld} />
                                        <div className="checkmark"></div>
                                    </label>
                            </div>
                        </div>
                        <div className="card mt-3 !w-full">
                            <i className={`bx bx-wind text-5xl ${conditioner ?'text-blue-400':''}`}></i>
                            <div className="card__content flex flex-col">
                                <p className="card__title">Air Conditioner</p>
                                    <label className="containerbtn mt-7 mx-auto">
                                        <input type="checkbox" className="checkbox" onChange={()=>{turnLight(2)}} checked={conditioner} />
                                        <div className="checkmark"></div>
                                    </label>
                            </div>
                        </div>
                        <div className="card mt-3 !w-full">
                            <i className={`bx bxs-buoy text-5xl ${fan ?'text-green-400 active_fan':''}`}></i>
                            <div className="card__content flex flex-col">
                                <p className="card__title">Fan</p>
                                    <label className="containerbtn mt-7 mx-auto">
                                        <input type="checkbox" className="checkbox" onChange={()=>{turnLight(3)}} checked={fan} />
                                        <div className="checkmark"></div>
                                    </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard;