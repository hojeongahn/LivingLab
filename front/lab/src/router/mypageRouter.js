import { Suspense, lazy } from 'react'; // 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연코딩

const Loading = <div>Loading...</div>; // 컴포넌트의 처리가 끝나지 않은 경우 화면에 'Loading...' 메시지 출력
const MyActivity = lazy(() => import('../pages/myPage/activity/MyActivityPage'));
const MyBuyListPage = lazy(() => import('../pages/myPage/activity/MyBuyListPage'));
const MyTeamListPage = lazy(() => import('../pages/myPage/activity/MyTeamListPage'));
const MyMarketListPage = lazy(() => import('../pages/myPage/activity/MyMarketListPage'));
const MyShareRoomListPage = lazy(() => import('../pages/myPage/activity/MyShareRoomListPage'));
const MyCommunityListPage = lazy(() => import('../pages/myPage/activity/MyCommunityListPage'));
const MyReplyListPage = lazy(() => import('../pages/myPage/activity/MyReplyListPage'));
const MyLikeListPage = lazy(() => import('../pages/myPage/activity/MyLikeListPage'));
const MyChat = lazy(() => import('../pages/myPage/chat/MyChatPage'));
const MyInfo = lazy(() => import('../pages/myPage/info/MyInfoPage'));
const MyInfoModify = lazy(() => import('../pages/myPage/info/MyInfoModifyPage'));

const mypageRouter = () => {
  return [
    {
      path: 'activity',
      element: (
        <Suspense fallback={Loading}>
          <MyActivity />
        </Suspense>
      )
    },
    {
      path: 'activity/buy',
      element: (
        <Suspense fallback={Loading}>
          <MyBuyListPage/>
        </Suspense>
      )
    },
    {
      path: 'activity/team',
      element: (
        <Suspense fallback={Loading}>
          <MyTeamListPage/>
        </Suspense>
      )
    },
    {
      path: 'activity/market',
      element: (
        <Suspense fallback={Loading}>
          <MyMarketListPage/>
        </Suspense>
      )
    },
    {
      path: 'activity/community',
      element: (
        <Suspense fallback={Loading}>
          <MyCommunityListPage/>
        </Suspense>
      )
    },
    {
      path: 'activity/shareroom',
      element: (
        <Suspense fallback={Loading}>
          <MyShareRoomListPage/>
        </Suspense>
      )
    },
    {
      path: 'activity/like',
      element: (
        <Suspense fallback={Loading}>
          <MyLikeListPage/>
        </Suspense>
      )
    },
    {
      path: 'activity/reply',
      element: (
        <Suspense fallback={Loading}>
          <MyReplyListPage/>
        </Suspense>
      )
    },
    {
      path: 'chat',
      element: (
        <Suspense fallback={Loading}>
          <MyChat />
        </Suspense>
      )
    },
    {
      path: 'info',
      element: (
        <Suspense fallback={Loading}>
          <MyInfo />
        </Suspense>
      )
    },
    {
      path: 'info/modify',
      element: (
        <Suspense fallback={Loading}>
          <MyInfoModify />
        </Suspense>
      )
    },
  ];
};

export default mypageRouter;
