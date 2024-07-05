import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLatestComm } from '../../api/communityApi';

const CommunityPostComponent = () => {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const pageParam = { page: 1, size: 8 }; 
        const posts = await getLatestComm(pageParam);
        setLatestPosts(posts);
      } catch (error) {
        console.error('Error :', error);
      }
    };

    fetchLatestPosts();
  }, []);

  const typeColor = (type) => {
    switch (type) {
      case '1':
        return 'type1';
      case '2':
        return 'type2';
      case '3':
        return 'type3';
      case '4':
        return 'type4';
      default:
        return '';
    }
  };

  const toCommunity = (type) => {
    switch (type) {
      case '1':
        return '/community/tip/list';
      case '2':
        return '/community/qna/list';
      case '3':
        return '/community/review/list';
      case '4':
        return '/community/help/list';
      default:
        return '#';
    }
  };

  const toRead = (type, commNo) => {
    let typePath = '';
    switch (type) {
      case '1':
        typePath = 'tip';
        break;
      case '2':
        typePath = 'qna';
        break;
      case '3':
        typePath = 'review';
        break;
      case '4':
        typePath = 'help';
        break;
      default:
        typePath = '';
    }
    return `/community/${typePath}/read/${commNo}?page=1&size=10`;
  };

  return (
    <div>
      {/* <div className="main-headline"> 커뮤니티</div> */}
      <ul>
        {latestPosts.map((comm, index) => (
          <li key={comm.commNo}>
            <div className="latestPost-container">
              <div className='w-1/5 ml-3'>
                <Link to={toCommunity(comm.type)} className='latestPost-type' >
                  {comm.type === '1' && '자취TIP공유'}
                  {comm.type === '2' && '질문게시판'}
                  {comm.type === '3' && '리뷰게시판'}
                  {comm.type === '4' && '도움요청'}
                </Link>
              </div>
              <div className='main-comm-title'>
                <Link to={toRead(comm.type, comm.commNo)} >
                  <span className='latestPost-title'>{comm.title}</span>
                </Link>
              </div>
              <span className="latestPost-hit">{comm.commHit}</span>
            </div>
            {index !== latestPosts.length - 1 && <hr className="latestPost-hr"></hr>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityPostComponent;
