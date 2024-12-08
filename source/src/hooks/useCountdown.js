import { selectCacheByName } from "@selectors/cache";
import { cacheActions } from "@store/actions";

const { useEffect, useState, useRef } = require("react");
const { useDispatch, useSelector } = require("react-redux");

const useCountdown = (initialTime,execute, interval = 1000) => {
    const [ time,setTime ] = useState(initialTime);
    useEffect(() => {
        const customInterval = setInterval(() => {
            if(time>0) setTime((prev) => prev - interval);
            
        },interval);
        if(time===0){
            execute();
        } 
        return () => clearInterval(customInterval);
    },[ time ]);


    return  time ;
};

export default useCountdown;
