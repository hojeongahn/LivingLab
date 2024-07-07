import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_SERVER_HOST, getLatestTeam } from '../../api/teamApi';
import PersonImg from '../../resources/images/person_num.png';


const host = API_SERVER_HOST;

const TeamPostComponent = () => {
    const [latestPosts, setLatestPosts] = useState([]);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const pageParam = { page: 1, size: 4 };
                const posts = await getLatestTeam(pageParam);
                setLatestPosts(posts);
            } catch (error) {
                console.error('Error :', error);
            }
        };

        fetchLatestPosts();
    }, []);

    const formatDeadline = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);

        const padZero = (num) => num.toString().padStart(2, '0'); //숫자를 2자리 문자열로 반환
        const isToday = (date) => {
            return date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate();
        };

        const hours = deadlineDate.getHours();
        const minutes = padZero(deadlineDate.getMinutes());
        const amPm = hours < 12 ? '오전' : '오후';
        const displayHours = padZero(hours % 12 || 12); // 24시간 포맷을 12시간 포맷으로 변경

        if (isToday(deadlineDate)) {
            return `오늘 ${amPm} ${displayHours}:${minutes}까지`;
        } else {
            const year = deadlineDate.getFullYear();
            const month = padZero(deadlineDate.getMonth() + 1);
            const day = padZero(deadlineDate.getDate());
            return `${year}-${month}-${day} ${amPm} ${displayHours}:${minutes}까지`;
        }
    };

    return (
        <div>
            <ul>
                {latestPosts.map((team, index) => (
                    <li key={team.teamNo}  >
                        <div className="wrap1">
                            <div className="card1">
                                <div className="front1">
                                    <div className="max-w-2xl mx-auto">
                                        <div className="flex gap-3 bg-white rounded overflow-hidden items-center justify-start">

                                            <div className="relative w-32 h-32 flex-shrink-0">
                                                <img className="absolute left-0 top-0 w-full h-full object-cover object-center transition duration-50" alt="..." loading="lazy" src={`${host}/api/team/display/${team.uploadFileNames[0]}`} />
                                            </div>

                                            <div className="flex flex-col w-full gap-2 py-2 mr-3">

                                                <p className="text-xl font-bold">
                                                    <Link to={`/team/read/${team.teamNo}`}>
                                                        {team.title}
                                                    </Link>
                                                </p>
                                                <p className="text-gray-500">
                                                    <Link to={`/team/read/${team.teamNo}`}>
                                                        {team.location}
                                                    </Link>
                                                </p>
                                                <div className="flex justify-start text-gray-500">
                                                    <span className="flex items-center justify-start text-gray-500">
                                                        {formatDeadline(team.deadline)}
                                                    </span>
                                                    <span className="flex items-center justify-start text-gray-500 ml-auto mr-6">
                                                        <img className="main-person-num" src={PersonImg} alt="..."/> {team.current}/{team.max}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    {index !== latestPosts.length - 1 && <hr className="latestPost-hr"></hr>}
                                </div>
                                <div className="back1">
                                    <div className='max-w-2xl mx-auto'>
                                        <div className="flex gap-3 bg-gray-100 overflow-hidden items-center justify-start">
                                            <div className="flex flex-col w-full h-[142px] gap-2 py-2 mr-3">
                                                <p className="text-xl font-bold text-center">
                                                    <Link to={`/team/read/${team.teamNo}`}>
                                                        {team.title}
                                                    </Link>
                                                </p>
                                                <p className="main-teamlist-content2">
                                                    <Link to={`/team/read/${team.teamNo}`}>
                                                        {team.content}
                                                    </Link>
                                                </p>
                                                <div className="flex justify-start text-gray-500">
                                                    <span className="flex items-center justify-start text-gray-500">
                                                        
                                                    </span>
                                                    <div className="flex w-20 items-center justify-center rounded-sm bg-gray-800 opacity-80 ml-auto mr-6">
                                                        <span className='text-white text-center'>
                                                            <Link to={`/team/read/${team.teamNo}`}>
                                                                참여하기
                                                            </Link>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default TeamPostComponent