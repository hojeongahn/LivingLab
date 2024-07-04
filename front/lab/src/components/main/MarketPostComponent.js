import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_SERVER_HOST, getLatestMarket } from '../../api/marketApi';


const host = API_SERVER_HOST;

const MarketPostComponent = () => {
    const [latestPosts, setLatestPosts] = useState([]);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const pageParam = { page: 1, size: 8 };
                const posts = await getLatestMarket(pageParam);
                setLatestPosts(posts);
            } catch (error) {
                console.error('Error :', error);
            }
        };
        fetchLatestPosts();
    }, []);

    return (
        <>
            <ul className="main-common-container">
                {latestPosts.slice(0, 2).map((market) => (
                    <li key={market.marketNo} className="main-marketlist">
                        <div className="main-marketlist-image">
                            <Link to={`/market/read/${market.marketNo}`}>
                                <img className="main-marketlist-thumbnail" src={`${host}/api/market/display/${market.uploadFileNames[0]}`} alt={market.title} />
                            </Link>
                        </div>
                        <div className="main-marketlist-titlebox">
                            <span className='main-marketlist-category'>
                                {market.marketCategory === '1' && '구매'}
                                {market.marketCategory === '2' && '판매'}
                                {market.marketCategory === '3' && '교환'}
                                {market.marketCategory === '4' && '나눔'}
                            </span>
                            <Link to={`/market/read/${market.marketNo}`}>
                                <span className='main-marketlist-title'>
                                    {market.title}
                                </span>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
            <ul className="main-common-container">
                {latestPosts.slice(2, 4).map((market) => (
                    <li key={market.marketNo} className="main-marketlist">
                        <div className="main-marketlist-image">
                            <Link to={`/market/read/${market.marketNo}`}>
                                <img className="main-marketlist-thumbnail" src={`${host}/api/market/display/${market.uploadFileNames[0]}`} alt={market.title} />
                            </Link>
                        </div>
                        <div className="main-marketlist-titlebox">
                            <span className='main-marketlist-category'>
                                {market.marketCategory === '1' && '구매'}
                                {market.marketCategory === '2' && '판매'}
                                {market.marketCategory === '3' && '교환'}
                                {market.marketCategory === '4' && '나눔'}
                            </span>
                            <Link to={`/market/read/${market.marketNo}`}>
                                <span className='main-marketlist-title'>
                                    {market.title}
                                </span>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
            <ul className="main-common-container">
                {latestPosts.slice(4, 6).map((market) => (
                    <li key={market.marketNo} className="main-marketlist">
                        <div className="main-marketlist-image">
                            <Link to={`/market/read/${market.marketNo}`}>
                                <img className="main-marketlist-thumbnail" src={`${host}/api/market/display/${market.uploadFileNames[0]}`} alt={market.title} />
                            </Link>
                        </div>
                        <div className="main-marketlist-titlebox">
                            <span className='main-marketlist-category'>
                                {market.marketCategory === '1' && '구매'}
                                {market.marketCategory === '2' && '판매'}
                                {market.marketCategory === '3' && '교환'}
                                {market.marketCategory === '4' && '나눔'}
                            </span>
                            <Link to={`/market/read/${market.marketNo}`}>
                                <span className='main-marketlist-title'>
                                    {market.title}
                                </span>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>

        </>
    )
}

export default MarketPostComponent