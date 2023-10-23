import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";


const Sidebar=()=>{
    // Lấy URL từ trình duyệt hoặc bất kỳ nguồn nào khác
    // var url = "http://localhost:3000/sensor#";
    // var linkPart = url.match(/#(.*)/)[1];
    // console.log(linkPart);
    const [currentPage,setCurrentPage]=useState('');
    const navigate=useNavigate()
    const changePage=(page)=>{
        navigate(`/${page}`);
        setCurrentPage(page)
    }
    useEffect(function (){
        // Lấy URL hiện tại
        var currentURL = window.location.href;

        // Lấy phần cuối cùng của đường link (đường dẫn sau ký tự '#')
        var hashIndex = currentURL.lastIndexOf("/");
        var sensorPart = currentURL.substring(hashIndex + 1,currentURL.length-1);
        setCurrentPage(sensorPart)
        
    },[])
    return (
        <div class="sidebar">
            <a href="#" class="logo">
                <i class='bx bx-code-alt'></i>
                <div class="logo-name"><span>Ooki</span>San</div>
            </a>
            <ul class="side-menu">
                <li onClick={()=>{changePage('')}} className={`${currentPage==''?'active':''}`}><a href="#"><i class='bx bxs-dashboard'></i>Dashboard</a></li>
                <li onClick={()=>{changePage('sensor')}} className={`${currentPage=='sensor'?'active':''}`}><a href="#"><i class='bx bxs-data'></i>Sensor Data</a></li>
                <li onClick={()=>{changePage('history')}} className={`${currentPage=='history'?'active':''}`}><a href="#"><i class='bx bx-history'></i>History</a></li>
                <li onClick={()=>{changePage('profile')}} className={`${currentPage=='profile'?'active':''}`}><a href="#"><i class='bx bxs-user-circle'></i>Profile</a></li>
            </ul>
        </div>
    )
}
export default Sidebar;