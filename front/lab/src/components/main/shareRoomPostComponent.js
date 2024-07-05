import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_SERVER_HOST, getLatestShareRoom } from '../../api/shareRoomApi';

const host = API_SERVER_HOST;

const ShareRoomPostComponent = () => {
    const [latestPosts, setLatestPosts] = useState([]);


    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const pageParam = { page: 1, size: 3 };
                const posts = await getLatestShareRoom(pageParam);
                setLatestPosts(posts);
            } catch (error) {
                console.error('Error :', error);
            }
        };
        fetchLatestPosts();
    }, []);

    return (
        <div>
            <ul className="main-roomlist-container">
                {latestPosts.map((shareRoom) => (
                    <li key={shareRoom.roomNo} className="main-roomlist">
                        <div className="main-roomlist-image">
                            <Link to={`/shareRoom/read/${shareRoom.roomNo}`}>
                                <img className="main-roomlist-thumbnail" src={`${host}/api/shareRoom/display/${shareRoom.uploadFileNames[0]}`} alt={shareRoom.title} />
                            </Link>
                        </div>
                        <div className='main-roomlist-content'>
                            <div className="main-roomlist-title">
                                <Link to={`/shareRoom/read/${shareRoom.roomNo}`}>
                                    {shareRoom.title}
                                </Link>
                            </div>
                            <div className='main-roomlist-optionbox'>
                                <span className='main-roomlist-option'>
                                    옵션
                                </span>
                                {shareRoom.option1}
                            </div>
                            <div className='mb-2 text-sm'>
                                <span className='main-roomlist-option'>
                                    주차
                                </span>
                                {shareRoom.parking}
                            </div>
                            <div>
                                <span className='main-roomlist-charge'>
                                    금액
                                </span>
                                {parseInt(shareRoom.rentFee).toLocaleString()}원 / {shareRoom.days}박

                            </div>
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ShareRoomPostComponent