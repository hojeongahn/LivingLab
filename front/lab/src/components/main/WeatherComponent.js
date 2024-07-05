import { useEffect, useState } from 'react';
import Marker from '../../resources/images/weather_loc.png';

const WeatherComponent = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLocation({ lat, lon });
        });
    };

    const getWeatherByCurrentLocation = async (lat, lon) => {
        if (lat && lon) {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e27fff32b5ae37415c983ad15930dd82&units=metric&lang=kr`;
            const response = await fetch(url);
            const data = await response.json();
            setWeather(data);
        }
    };

    // const todayData = () => {
    //     let now = new Date();
    //     let todayMonth = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
    //     let todayDate = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();
    //     return todayMonth + '/' + todayDate;
    // };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (location.lat && location.lon) {
            getWeatherByCurrentLocation(location.lat, location.lon);
        }
    }, [location]);

    return (
        <div>

            {weather ? (
                <div>
                    <div className='flex '>
                        <div className='flex '>
                            {/* <div className='text-3xl flex justify-end weather-font mr-1'>
                                {todayData()}
                            </div> */}

                            <div className='flex'>
                                <img
                                    className='weather-icon'
                                    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                    alt={weather.weather[0].description} />
                                <div className='weather-temp'>
                                    {Math.round(weather.main.temp)}°
                                </div>
                            </div>
                            <div className='flex ml-10'>
                                <img className='weather-marker'
                                    src={Marker}
                                    alt="marker" />
                                <div className=' weather-font '>
                                    {weather.name}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <div className='text-left'></div>
            )}
        </div>
    );
};

export default WeatherComponent;
