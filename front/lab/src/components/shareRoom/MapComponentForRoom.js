import React, { useEffect, useState } from 'react';
import "./MapComponentForRoom.css";

const { kakao } = window;

const MapComponent = ({ location }) => {
  const [map, setMap] = useState(null);
  const [placeOverlay, setPlaceOverlay] = useState(new kakao.maps.CustomOverlay({ zIndex: 1 }));
  const [markers, setMarkers] = useState([]);
  const [currCategory, setCurrCategory] = useState('');

  useEffect(() => {
    if (!location) return;

    const mapContainer = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 기본 중심좌표를 서울로 설정
      level: 5,
    };

    const mapInstance = new kakao.maps.Map(mapContainer, options);
    setMap(mapInstance);

    const mapTypeControl = new kakao.maps.MapTypeControl();
    mapInstance.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    const zoomControl = new kakao.maps.ZoomControl();
    mapInstance.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(location, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const marker = new kakao.maps.Marker({
          map: mapInstance,
          position: coords,
        });

        const infowindow = new kakao.maps.InfoWindow({
          content: '<div style="width:150px;text-align:center;padding:6px 0;">위치</div>',
        });
        infowindow.open(mapInstance, marker);

        mapInstance.setCenter(coords);
      }
    });

    kakao.maps.event.addListener(mapInstance, 'idle', () => {
      if (currCategory) {
        searchPlaces();
      }
    });

    const contentNode = document.createElement('div');
    contentNode.className = 'placeinfo_wrap';

    addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
    addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

    placeOverlay.setContent(contentNode);
    setPlaceOverlay(placeOverlay);

    addCategoryClickEvent();

  }, [location]);

  useEffect(() => {
    if (map) {
      if (currCategory) {
        searchPlaces();
      } else {
        removeMarker();
      }
    }
  }, [currCategory, map]);

  const addEventHandle = (target, type, callback) => {
    if (target.addEventListener) {
      target.addEventListener(type, callback);
    } else {
      target.attachEvent('on' + type, callback);
    }
  };

  const searchPlaces = () => {
    if (!currCategory || !map) {
      return;
    }

    placeOverlay.setMap(null);
    removeMarker();

    const ps = new kakao.maps.services.Places(map);
    ps.categorySearch(currCategory, placesSearchCB, { useMapBounds: true });
  };

  const placesSearchCB = (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      displayPlaces(data);
    }
  };

  const displayPlaces = (places) => {
    const order = document.getElementById(currCategory).getAttribute('data-order');

    const newMarkers = places.map((place) => {
      const marker = addMarker(new kakao.maps.LatLng(place.y, place.x), order);
      kakao.maps.event.addListener(marker, 'click', () => displayPlaceInfo(place));
      return marker;
    });
    setMarkers(newMarkers);
  };

  const addMarker = (position, order) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png',
      imageSize = new kakao.maps.Size(27, 28),
      imgOptions = {
        spriteSize: new kakao.maps.Size(72, 208),
        spriteOrigin: new kakao.maps.Point(10, order * 36),
        offset: new kakao.maps.Point(11, 28)
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position,
        image: markerImage
      });

    marker.setMap(map);
    return marker;
  };

  const removeMarker = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const displayPlaceInfo = (place) => {
    const content = `<div className="placeinfo">
                        <a className="title" href="${place.place_url}" target="_blank" title="${place.place_name}">${place.place_name}</a>
                        ${place.road_address_name ?
        `<span title="${place.road_address_name}">${place.road_address_name}</span>
                        <span className="jibun" title="${place.address_name}">(지번 : ${place.address_name})</span>` :
        `<span title="${place.address_name}">${place.address_name}</span>`}
                        <span className="tel">${place.phone}</span>
                    </div>
                    <div className="after"></div>`;

    placeOverlay.setContent(content);
    placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
    placeOverlay.setMap(map);
  };

  const addCategoryClickEvent = () => {
    const category = document.getElementById('category');
    Array.from(category.children).forEach(child => {
      child.onclick = onClickCategory;
    });
  };

  const onClickCategory = (e) => {
    const id = e.currentTarget.id;
    const className = e.currentTarget.className;

    placeOverlay.setMap(null);

    if (className === 'on') {
      setCurrCategory('');
      changeCategoryClass();
    } else {
      setCurrCategory(id);
      changeCategoryClass(e.currentTarget);
    }
  };

  const changeCategoryClass = (el) => {
    const category = document.getElementById('category');
    Array.from(category.children).forEach(child => {
      child.className = '';
    });

    if (el) {
      el.className = 'on';
    }
  };

  return (
    <div>
      <div
        id="map"
        style={{
          width: '100%',
          height: '500px',
        }}
      >
      </div>
      <ul id="category" >
        <li id='BK9' data-order="0" >
          <span className="category_bg bank"></span>
          은행
        </li>
        <li id='MT1' data-order="1" >
          <span className="category_bg mart"></span>
          마트
        </li>
        <li id='PM9' data-order="2" >
          <span className="category_bg pharmacy"></span>
          약국
        </li>
        <li id='OL7' data-order="3" >
          <span className="category_bg oil"></span>
          주유소
        </li>
        <li id='CE7' data-order="4" >
          <span className="category_bg cafe"></span>
          카페
        </li>
        <li id='CS2' data-order="5" >
          <span className="category_bg store"></span>
          편의점
        </li>
      </ul>
    </div>
  );
};

export default MapComponent;
