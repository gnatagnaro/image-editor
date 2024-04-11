import React, { useEffect, useState } from 'react'
import UploadForm from './UploadForm'
import { useKeyPress } from './useKeyPress'

function WorkSpace({tool, form, handleFormChange}) {

    const [canvas, setCanvas] = useState()
    const [context, setContext] = useState()
    const [mouseState, setMouseState] = useState(false)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [url, setUrl] = useState('')
    const [image, setImage] = useState('')
    const [control, setControl] = useState()
    const [coorinates, setCoordinates] = useState([0,0])
    const [pixelColor, setPixelColor] = useState() 
    const [blob, setBlob] = useState()
    const [lastCoords, setLastCoords] = useState([[],[]])
    const [message, setMessage] = useState()


    let lastX = []
    let lastY = []

    let offsetX
    let offsetY

    const zoomIn = useKeyPress('-')
    const zoomOut = useKeyPress('+')

    const mouseMove = (e) => { 
        lastX.push(e.pageX)
        if(lastX.length > 3) {
            offsetX = lastX[lastX.length-1] - lastX[lastX.length-2]
            lastX.shift()
        }

        lastY.push(e.pageY)

        if(lastY.length > 2) {
            offsetY = lastY[lastY.length-1] - lastY[lastY.length-2]
            lastY.shift()
        }

        if(mouseState && tool == 'hand' && form == 'none') {
            canvas.style.top = Number(canvas.style.top.slice(0,-2)) + (offsetY) + 'px'
            canvas.style.left = Number(canvas.style.left.slice(0,-2)) + (offsetX) + 'px'                
        }
    }

    const mouseDown = (e) => {
        setMouseState(true)
    }

    const mouseUp = (e) => {
        setMouseState(false)
    }

    const downHandler = (e) => {
        if(e.key == 'Control') {
            setControl(true)
        }
    }

    const upHandler = (e) => {
        if(e.key == 'Control') {
            setControl(false)     
        }
    }
    
    const mouseScroll = (e) => {
        if(control) {
            console.log(e.deltaY)
            canvas.style.height = Number(canvas.style.height.slice(0,-2) * (1 + (e.deltaY * -1)/800)) + 'px'
            canvas.style.width = Number(canvas.style.width.slice(0,-2) * (1 + (e.deltaY * -1)/800))+ 'px'
        } else {
            canvas.style.top = Number(canvas.style.top.slice(0,-2)) + (e.deltaY * -1) + 'px'    
            canvas.style.left = Number(canvas.style.left.slice(0,-2)) + (e.deltaX * -1) + 'px' 
        }
    }

    const getCanvas = () => {
        const cnv = document.getElementsByClassName('canvas')[0]
        let ctx = cnv.getContext('2d')
        setContext(ctx)
        setCanvas(cnv)
    }

    const widthChange = (e) => {
        setWidth(e.target.value)
    } 

    const heightChange = (e) => {
        setHeight(e.target.value)
    }

    const urlChange = (e) => {
        setUrl(e.target.value)
        setImage(null)
    }

    const fileChange = async (e) => {
        let img = await createImageBitmap(e.target.files[0]).then((resp) => {
            return resp
        })
        console.log(img)
        setImage(img)
        setUrl(null)
    }

    const createNewFile = (e) => {
        e.preventDefault()

        if(width <= 0 || height <= 0) {
            setMessage('Высота и ширина изображения не могут быть меньше нуля')
        }

        handleFormChange('none')

        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        canvas.width = width
        canvas.height = height

        context.fillStyle = "rgb(255,255,255)"
        if(!canvas.style.top) {
            let workspace = document.getElementsByClassName('workspace')[0]

            const w = workspace.offsetWidth
            const h = workspace.offsetHeight
            const cw = canvas.offsetWidth
            const ch = canvas.offsetHeight
             
            canvas.style.top = (h/2 - ch/2) + "px"
            canvas.style.left = (w/2 - cw/2) + "px"
        }
        context.fillRect(0,0,canvas.width,canvas.height)
    }

    const submitForm = async (e) => {
        e.preventDefault()
        
        if(!image && !url) {
            setMessage('Выберите изображение или вставьте ссылку на него')
            return    
        }
        
        if(image) {
            openImage()
            setMessage('')
            return
        } else if(url) {
            fetchImage()
            setMessage('')
        }
    }

    const openImage = () => {
        canvas.width = image.width
        canvas.height = image.height
        canvas.style.width = image.width + "px"
        canvas.style.height = image.height + "px"
        if(!canvas.style.top) {
            let workspace = document.getElementsByClassName('workspace')[0]

            const w = workspace.offsetWidth
            const h = workspace.offsetHeight
            const cw = canvas.offsetWidth
            const ch = canvas.offsetHeight
            
            canvas.style.top = (h/2 - ch/2) + "px"
            canvas.style.left = (w/2 - cw/2) + "px"
        }
        context.drawImage(image, 0, 0, image.width, image.height)
        canvas.toBlob((blob) => {
            console.log(blob)
            setBlob(blob)
        })
        handleFormChange('none')
    }

    const fetchImage = async () => {
        var RegExp = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

        if(!RegExp.test(url)){ 
            setMessage('Введите корректную ссылку')
            return
        }
        
        try {
            let response = await fetch(url)
            const blob = await response.blob()
            if(blob.type.split('/')[0] != 'image') {
                setMessage('Введите ссылку на изображение')
                return
            }
            setBlob(blob)
            const fileReader = new FileReader()
            fileReader.readAsDataURL(blob)
            fileReader.onloadend = () => {
                let img = new Image()
                img.src = URL.createObjectURL(blob)

                img.onload = () => {
                    canvas.width = img.width
                    canvas.height = img.height
                    canvas.style.width = img.width + "px"
                    canvas.style.height = img.height + "px"

                    console.log(img)
                    context.drawImage(img, 0, 0)
                }
            }
        } catch(error) {
            console.log(error)
            setMessage('Введите корректную ссылку')
            return
        }
        handleFormChange('none')

    }

    const getCoordinate = (e) => {
        let x = canvas.width
        let y = canvas.height
        let w = Number(canvas.style.width.slice(0,-2))
        let h = Number(canvas.style.height.slice(0,-2))
        
        let coordinateX = Math.round((e.nativeEvent.offsetX * x) / w)
        let coordinateY = Math.round((e.nativeEvent.offsetY * y) / h)

        let arr = new Array(lastCoords)
        arr[0][0].push(coordinateX)
        arr[0][1].push(coordinateY)
        if(arr[0][0].length > 3) arr[0][0].shift()
        if(arr[0][1].length > 3) arr[0][1].shift()
        setLastCoords(arr[0])

        if(mouseState && tool=='brush') {            
            let arr = new Array(lastCoords)
            arr[0][0].push(coordinateX)
            arr[0][1].push(coordinateY)
            if(arr[0][0].length > 3) arr[0][0].shift()
            if(arr[0][1].length > 3) arr[0][1].shift()
            setLastCoords(arr[0])

            console.log(`${lastCoords[0][lastCoords.length -1]}, ${lastCoords[1][lastCoords.length -1]}`)

            context.beginPath();
            context.moveTo(lastCoords[0][lastCoords.length -2], lastCoords[1][lastCoords.length -2]);
            context.lineTo(coordinateX,coordinateY);
            context.stroke();
            context.closePath();
        }

        let pixelData = context.getImageData(coordinateX, coordinateY, 1, 1).data
        let rgbColor = `${pixelData[0]},${pixelData[1]},${pixelData[2]}`
        setPixelColor(rgbColor)

        setCoordinates([coordinateX, coordinateY])
    }
    


    useEffect(() => {
        getCanvas()
        let workspace = document.getElementsByClassName('workspace')[0]
        workspace.onmousemove = mouseMove   
        workspace.onmousedown = mouseDown
        workspace.onmouseup = mouseUp
        workspace.onwheel = mouseScroll
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)
    },[canvas, mouseState, tool, control, lastCoords])  


    return (
        <div className='workspace'> 
            <div className='canvas__wrapper'>
                <canvas onMouseMove={getCoordinate} className='canvas'/>
            </div>
            <UploadForm form={form} handleFormChange={handleFormChange} createNewFile={createNewFile} submitForm={submitForm} widthChange={widthChange} heightChange={heightChange} urlChange={urlChange} fileChange={fileChange} message={message}/>
            <div className='workspace__coordinates'>
                <p className='workspace__coordinate'>X: {coorinates[0]}</p>
                <p className='workspace__coordinate'>Y: {coorinates[1]}</p>
                <div className='workspace__pixel-color' style={{background: `rgb(${pixelColor})`}}></div>
            </div>
        </div>
    )
}

export default WorkSpace