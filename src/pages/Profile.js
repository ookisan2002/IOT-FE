const Profile=()=>{
    return(
        <div className="relative w-[calc(100%-230px)] left-[230px] flex flex-col p-5 h-full items-center ">
            <img src="https://wallup.net/wp-content/uploads/2015/12/97685-Kurosaki_Ichigo-Bleach-anime_boys-weapon-orange_hair.jpg" className="w-full rounded-lg h-80"/>
            <div className=" w-11/12 mt-[-64px] bg-slate-50 rounded-lg p-3 flex flex-wrap">
                <img src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.6435-9/122119557_3309801399136682_7557715404852980936_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=JdLfulmVyUIAX9ABUaJ&_nc_oc=AQlpyKQEXLjNKzL14BDEIYz9DRUP30eSda9bw_e1SMVs342UjuHJicl9yrawqbQTlxk&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfC74iTev_WGwZh8oPwXdk4knxRFmuXV50jN8iVTLkUdyw&oe=65203CB2" className=" rounded-full object-cover border-2 w-[74px] h-[74px]"/>
                <div className="p-2">
                    <h1 className="block text-left text-xl font-bold text-slate-500">Trần Huy Bách Đại</h1>
                    <h2 className="block text-left text-base text-slate-300">B20DCCN167</h2>
                </div>
                <div className="w-full p-3 text-left text-base text-slate-400">

                    <h1 className="mb-3 font-bold text-slate-600">Profile information</h1>
                    <p className="text-slate-400 mb-6">As an undergraduate student at PTIT University, i am proud to have 25 years of experience in the programming industry at the age of 21.</p>
                    <div className="flex items-center mb-3">
                        <h1 className="font-bold text-slate-600 mr-2 text-lg ">Full name:</h1>
                        <p className="text-slate-400 justify-center">Trần Huy Bách Đại</p>
                    </div>
                    <div className="flex items-center mb-3">
                        <h1 className="font-bold text-slate-600 mr-2 text-lg ">Mobile:</h1>
                        <p className="text-slate-400 justify-center">0981073391</p>
                    </div>
                    <div className="flex items-center mb-3">
                        <h1 className="font-bold text-slate-600 mr-2 text-lg ">Email:</h1>
                        <p className="text-slate-400 justify-center">dainam826@gmail.com</p>
                    </div>
                    <div className="flex items-center">
                        <h1 className="font-bold text-slate-600 mr-2 text-lg ">Social:</h1>
                        <a href="https://www.facebook.com/ookisan.2002/" class='bx bxl-facebook-square text-slate-400 hover:text-blue-500'></a>
                    </div>
                </div>     
            </div> 
        </div>
    )
}
export default Profile