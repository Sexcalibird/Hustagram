import './admin.css'
import { Bar as ChartJS } from 'chart.js/auto'
import { Bar }            from 'react-chartjs-2'
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {clearStatistics, fetchPerMonth, fetchStatistics, getChart, getStatistics} from "../../redux/adminSlice";

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ReplayIcon from '@mui/icons-material/Replay';

const Admin = () => {

    const dispatch = useDispatch()
    const statistic = useSelector(getStatistics)
    const chart = useSelector(getChart)
    useEffect(() => {
        dispatch(fetchStatistics())
        dispatch(fetchPerMonth())
        return () => {
            dispatch(clearStatistics())
        }
    },[])

    console.log(chart?.users?.map(u => u.count) )

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Overview</h1>
                <button onClick={() => {
                    dispatch(fetchStatistics())
                    dispatch(fetchPerMonth())
                }}>
                    <ReplayIcon/>
                </button>
            </div>
            <div className="admin-statistic">
                <div className="statistic-box">
                    <PeopleAltIcon sx={{ fontSize: 50, color: 'orange' }}/>
                    <h1>{statistic.countUsers}</h1>
                    <p>Users</p>
                </div>
                <div className="statistic-box">
                    <NoteAddIcon sx={{ fontSize: 50, color: 'green' }}/>
                    <h1>{statistic.countPosts}</h1>
                    <p>Posts</p>
                </div>
                <div className="statistic-box">
                    <FavoriteIcon sx={{ fontSize: 50, color: 'red' }}/>
                    {statistic?.countLikes?.map(l => <h1>{l.total}</h1>)}
                    <p>Likes</p>
                </div>
                <div className="statistic-box">
                    <ChatBubbleIcon sx={{ fontSize: 50, color: 'blue' }}/>
                    {statistic?.countCmts?.map(l => <h1>{l.total}</h1>)}
                    <p>Comments</p>
                </div>
            </div>
            <div >
                <Bar
                    data={{
                        labels: ['October', 'December', 'January', 'February', 'March'],
                        datasets: [
                            {
                                label: "Number of users",
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                data: [1, 2, 5, 9, 1]
                            },
                            {
                                label: "Number of posts",
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                data: [1, 4, 2, 11, 0]
                            },
                        ]
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: false,
                                text: 'Hustagram',
                            },
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default Admin