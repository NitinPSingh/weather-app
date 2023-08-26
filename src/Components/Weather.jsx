import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {convertTime, ctoF, timeToAMPM, degToCompass} from "../Converters/converters";
import {isPM, getTime, getAMPM, getVisibility, getWindSpeed} from "../Converters/utils";
export default function Weather() {

    const [location,
        setLocation] = useState("Mumbai");
    const [weatherData,
        setWeatherData] = useState("");
    const [newLocation,
        setNewLocation] = useState("");
    const [systemUsed,
        setSystemUsed] = useState("metric")
    var weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    
    useEffect(() => {
        const getWeatherData = async() => {

            const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=66131a4acc7d5f029d996178c078add1`)
    
            setWeatherData({
                ...data
            });
            
        }
        getWeatherData();
        

    },[location]);

    function addItem(e) {
        if (e.keyCode === 13) {
            setLocation(newLocation)
            
        }

    }
    function system() {
        systemUsed === "metric"
            ? setSystemUsed("imperial")
            : setSystemUsed("metric");
        console.log(systemUsed)

    }

    return weatherData && !weatherData.message
        ? (
            <div>

                
                <div class="grid-container">
                    <div class="grid-left">
                        <h1
                            style={{
                            margin: "0px"
                        }}>{weatherData.name}, {weatherData.sys.country}</h1>
                        <h3
                            style={{
                            margin: "0px"
                        }}>{weatherData.weather[0].main}</h3>
                        <img
                            alt="weatherIcon"
                            src={`/icons/${weatherData.weather[0].icon}.svg`}
                            height="300px"
                            width="300px"/>
                        <h1
                            style={{
                            margin: "0px"
                        }}>{systemUsed === "metric"
                                ? Math.round(weatherData.main.temp)
                                : Math.round(ctoF(weatherData.main.temp))}
                            °{systemUsed === "metric"
                                ? "C"
                                : "F"}</h1>
                        feels like :
                        <h3
                            style={{
                            margin: "0px",
                            display: "inline"
                        }}>
                            {systemUsed === "metric"
                                ? Math.round(weatherData.main.feels_like)
                                : Math.round(ctoF(weatherData.main.feels_like))}
                            °{systemUsed === "metric"
                                ? "C"
                                : "F"}</h3>
                        <Temperature
                            systemUsed={systemUsed === "metric"
                            ? "metric"
                            : "imperial"}
                            tempmin={weatherData.main.temp_min}
                            tempmax={weatherData.main.temp_max}/>

                    </div>
                    <div class="grid-right">

                        <div class="grid-right-up">
                            <h1 >
                                {weekday[new Date(convertTime(weatherData.dt, weatherData.timezone).input).getUTCDay()]}
                                ,{" "} {systemUsed === "metric"
                                    ? parseInt(convertTime(weatherData.dt, weatherData.timezone)[0].split(":")[0])
                                    : timeToAMPM(convertTime(weatherData.dt, weatherData.timezone)[0]).split(":")[0]}
                                :00{" "} {systemUsed === "imperial"
                                    ? isPM(convertTime(weatherData.dt, weatherData.timezone)[0])
                                    : ""}
                            </h1>
                            <div>
                        <input
                                class="input"
                                type="text"
                                placeholder="Search a city..."
                                onChange={(e) => setNewLocation(e.target.value)}
                                onFocus={(e) => {
                                    e.target.value = "";
                                    e.target.placeholder = "Search a city...";
                                }}
                                onKeyDown={(e) => {
                                addItem(e)
                                e.target.placeholder = "Search a city...";
                                }}/></div>

                        </div>
                        <div class="grid-right-down">
                            <div class="grid-box">
                                <div class="grid-box">

                                    <Box
                                        title={"Humidity"}
                                        img={"/icons/025-humidity.png"}
                                        data={weatherData.main.humidity}
                                        unit={"%"}/>
                                </div>

                            </div>

                            <div class="grid-box">
                                <div class="grid-box">

                                    <Box
                                        title={"Wind Speed"}
                                        img={"/icons/017-wind.png"}
                                        data={getWindSpeed(systemUsed, weatherData.wind.speed)}
                                        unit={systemUsed === "metric"
                                        ? "m/s"
                                        : "m/h"}/>
                                </div>

                            </div>
                            <div class="grid-box">
                                <div class="grid-box">

                                    <Box
                                        title={"Wind Direction"}
                                        img={"/icons/014-compass.png"}
                                        data={degToCompass(weatherData.wind.deg)}/>
                                </div>
                            </div>
                            <div class="grid-box">

                                <Box
                                    title={"Visibility"}
                                    img={"/icons/binocular.png"}
                                    data={getVisibility(systemUsed, weatherData.visibility)}
                                    unit={systemUsed === "metric"
                                    ? "km"
                                    : "miles"}/>
                            </div>
                            <div class="grid-box">
                                <Box
                                    title={"Sunrise"}
                                    img={"/icons/040-sunrise.png"}
                                    data={getTime(systemUsed, weatherData.sys.sunrise, weatherData.timezone)}
                                    unit={getAMPM(systemUsed, weatherData.sys.sunset, weatherData.timezone)}/>
                            </div>
                            <div class="grid-box">
                                <Box
                                    title={"Sunset"}
                                    img={"/icons/041-sunset.png"}
                                    data={getTime(systemUsed, weatherData.sys.sunset, weatherData.timezone)}
                                    unit={getAMPM(systemUsed, weatherData.sys.sunset, weatherData.timezone)}/>
                            </div>

                        </div>
                        <div>
                            <button className="reset btn-gradient-2" onClick={system}>
                                {systemUsed}
                                {" "}system
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        ): 
         weatherData && weatherData.message? (
            <div >
              <div>
                <h1 style={{ marginBottom: "30px" }}>City not found, try again!</h1>
                
              </div>
            </div>
          ) :
         (
            <div >
                <h1>Loading data...</h1>
            </div>
        );
}

function Box(props) {

    return (
        <div className="box">
            <p
                style={{
                display: "block",
                margin: "0px",
                textAlign: "center"
            }}>{props.title}</p>
            <div className="box-in">
                <div >
                    <img src={props.img} alt="lost img" height="100px" width="100px" id="image"/>

                </div>
                <div>
                    <h1 style={{
                        marginBottom: "0px"
                    }}>{props.data}
                    </h1>
                    <h3 style={{
                        marginTop: "0px"
                    }}>{props.unit}</h3>
                </div>
            </div>
        </div>
    )
}
function Temperature(props) {

    return (
        <div className="temp-box">
            <div className="temp-int">
                <img
                alt="lost img"
                    style={{
                    paddingTop: "20%"
                }}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAD/UlEQVRoge2aTUxcVRiGn+/OHWhqoqmAMggmGraaKNoEZ8aoC5uGGUbipgmJdasxjdTGnYo/CyXxpwvqSl11KVCYgZh0QcKPUcGNdWXaaEu5SDURqxFm7pzPBTMJaQcGzpz+JfOuzsw57/udd777nXvm3CvcAASp5EHUvIInXcCDpa8vYnQRT0/FJuZ/cB1TXAsG6eTbqA7uoK2ovhPLzb3vMq7nUmwlncyg+i5QBIZVeWLd9w+s+/4BNfokyimgiMh7K6lE2mVs36WYqg5sNuRYLDfz+TXdC8BCkE78jDKswgAw4Sq204wAjwE0mPzp7QY0/rev3Pe4y8CujdwN0DT13d/bDbj37Nk1AJR7XAZ2beSWoW7kdoPT+0iQSmgN9NlYdjZpS76dMlLLj+D2PlJGLDu7Y6bLmas2bi+4nTJSE25IRnaLa2qqXiNwizNSr5EKuOkZ+eXw4Ua4CtzhNdK5umq26bqzakQWFwtBKgHUa6Qi6jVii3qNVEG9RmxRr5EqcJaRpb6DTRSqj9taI8Vovrl99Ps/XcR3kpHlnuShSKHhXOnjxV1QLgFECg3nltNPPe9iDjUbCdLJl0U0C7QijJiIl6jGMREvLjAKtIp6uaAnfrTWedS0/K2kEylVxgBPVY+35eY+2wt/OZ0cENWPgSJoJpadm7Sdi7WRK4eSsTDKT6BNAq+3ZmdP2uiUzHwC/BEx/iP3TU6v2OhYX1phVD8AbQL92tYEQNvEzKely6w59ArWjxqsjFzOPN0BvASsq9E3bIOXob5/HNgQkaNXeuNtNhpWRryiHgF8VUbbJud/s9HYitjY9K8gYyjRgpEjVnOyC63PAojIiB2/AsSMbGrynA3dyojAowD4kQUbfsWJGNnU0pL2Xvk2JIUmgPW/sFphKiG/vxiUmi02fNtVqwBwV4u7Lc7+f0y01Mzb8G2NBAD5f0OrFaYSNnyvrHXZhm9r5DyAH6HLkn891NvUEi7Y0G2N5ABUJWPJvw4iJS0jORu+lZFi0T8DhKB9v/ckHrbR2IrV3u5OlAwQhhKO22hYGWmfml4S+ApoMKJDNhpbYUxkCGgQ5YuO7Lc3tUaIeDoIXAV5MehJWG9TgnT8hEIfwpqn/qCtjrWRlvG5ZYF+wCB8ZGMmSMdPoPIhYDDSb7vzBQcPQ4NU/DWQk4CHMOKF5s37p+bP78RZ7e3uNCYypNAHGOBYLDs7XMs8nJwrlf5gnWbzzYc8whmBMUPxR39f4xJAuL7RjnpdgryAkEGJIqxhpD+Wm7FaqbbC2QHZcvqZZjR8S+BVqh9qhCJ8GcnLYMs3M0GVsbuC8/e1LqW6H/DV70VIgT4EdJS7EC5gJBdKOG67Om2H/wEFuXn4J3TGHAAAAABJRU5ErkJggg=="/>
                <h2>{props.systemUsed === "metric"
                        ? Math.round(props.tempmax)
                        : Math.round(ctoF(props.tempmax))}
                    °{props.systemUsed === "metric"
                        ? "C"
                        : "F"}</h2>
            </div>
            <div className="temp-int">

                <img
                alt="lost img"
                    style={{
                    paddingTop: "20%"
                }}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAD/ElEQVRoge2aTWwbVRSFvztjuwEhqioB2nECAmVLJWhhAyzSOAWhQojYVAoiVHWIQKgipWIHhJ8FVOKnSClqOwnqokvStJAKiK1s2DVlQ1k2ok0cR+JHBNQAsWcui9hSVDlxcj1tU8ln42e/d85913fOnfGMheuA5qz/aKi8AroD5N6lT/UKyIWQ8Ohc6uXzUceUqAW9jP82MLCKtgr6Ti7V+36UcZ0oxbzxE53Au0AAMqiO7ky47paE627RUB4BjgKBIu95Wf+ZKGPHohQTh35VENUDuY70F9dMTwKTXsb/GRhE6Qe+jip2pBVRlYcA/incdmqlNQ0alOcejjJ2pIkAdwL88fQLf620YKqjb7403Bxl4KgTuWmoJ7LREOl5xMv4WgP9h9lU+gkreSNVpJYvIdrzSBmzqfSqlS5Xrtq69WAjVaQmXJeKrBXXeKruEbjJFal7pAJueEVaz32+aaE0vqU9svnuTeEKU7eWRy7s7Ct4GR+oe6Qi6h6xou6RKqh7xIq6R6ogsookMycblULVdcs9IsSbcqme36OIH0lFto0ff1IpXCy9vbIGyjSAUrjoZYd2R7GHmhNJZodeEnG+AbaKMELgPF6VFDiPgZ4GtqI6lsz4PbXuo6b2l8wc36M4o4CjIgfz7fs/Wxd/3O9X4WMgcBztnNnVe866F3Mi9317bFsh5v4ENCq8nk+lj1h0Ssl8AvxWcN0Hf23bN2fRMR9ahZj7AdAo8JU1CYBcR/rT0mHWFA8C86MGUyLed8MtwIvAv6HwhjV4GaEbOwj8B/S0fD/kWTRsFXF0LxBD5XS+PX3ZpLEMc237fgFGgXjosNe0JQtJRNuWXsMRC7+ipsoIgKK7LHxTIopuBwjc2KSFXwlFkbLWdgvfaHZpBGgAU4ephPjtd+RLw7ssfGvXKgBcZSGyS5yFPxfjpeGihW9NJA+QCOKmDlMJDe7VslbOwreZHS4BqMgOC78S1I2VtaYsfKvZx5YG0mnhV4KgnQCiJe11wlYRlzNAEei6JzP8gEVjOZon/FagEyiKkzhr0TAlkmvrnUH4EkjECA9bNJYjDPQwkFAYmmnvuXEeAXADGQD+Vng+mTlhvkzxsv4hkC5gvui6A1YdcyLTu/fPInQDoSIfWZLxsv4hlA+BUJRu65UvRPAw1Mv6r6EcARwRRhyCN6fb+y6txmme8FuXDifpAkLQA7Op3sFa9hHJfaXSD6xTLP3zYRE4gzJKGPxYSBRnAOKLseZSi32u1KHiwLwo3bmOtKlTLUdkN8i8iWNNBLG3QF+l+k2NoiDDsWJx4PJTffkqa9eEyP+v1Zw9mdRw8dkQ2SPC/UBLaWoamBLVMXESZ63daSX8D3x6ZiNl+NitAAAAAElFTkSuQmCC"/>
                <h2>{props.systemUsed === "metric"
                        ? Math.round(props.tempmin)
                        : Math.round(ctoF(props.tempmin))}
                    °{props.systemUsed === "metric"
                        ? "C"
                        : "F"}</h2>

            </div>

        </div>
    )
}