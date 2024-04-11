import { useEffect, useState } from "react";

export const useKeyPress = (keyTarget) => {
    const [isPressed, setIsPressed] = useState(false)    
    const downHandler = ({key}) => {
        let canvas = document.getElementsByClassName('canvas')[0]
            if(key == '+') {
                Number(canvas.style.height.slice(0,-2))
                Number(canvas.style.width.slice(0,-2))
                canvas.style.height = Number(canvas.style.height.slice(0,-2)*1.05)  + 'px'
                canvas.style.width = Number(canvas.style.width.slice(0,-2)*1.05) + 'px'
            }
            if(key == '-') {
                canvas.style.height = Number(canvas.style.height.slice(0,-2)*0.95) + 'px'
                canvas.style.width = Number(canvas.style.width.slice(0,-2)*0.95) + 'px'
            }      
            if(key == 'j') {
                console.log('ctrl')
            }
    }

    const upHandler = ({key}) => {
        
    }

    useEffect(() => {
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)

        return
    }, [])

    return isPressed
}