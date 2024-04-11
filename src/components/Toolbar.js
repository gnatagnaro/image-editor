import React from 'react'
import { useState, useEffect } from 'react'

function Toolbar({ onChange }) {

    const [tools, setTools] = useState([])
    const [selectedTool, setSelectedTool] = useState('') 

    const getTools = () => {
        let toolsList = document.getElementsByClassName('toolbar__tool')
        setTools(toolsList)
    }

    const selectTool = (e) => {
        for(let i = 0; i < tools.length; i++) {
            tools[i].className = 'toolbar__tool'
        }

        let selected = document.getElementById(e.currentTarget.id)
        selected.className = 'toolbar__tool toolbar__tool--selected'
        onChange(e.currentTarget.id)
        setSelectedTool(e.currentTarget.id)
    }

    useEffect(() => {
        onChange('hand')        
        getTools()
    }, [])    

	return (
		<div className='toolbar'>
			<ul className='toolbar__tools'>
                <li className='toolbar__tool toolbar__tool--selected' id='hand' onClick={selectTool}>
                    <img src='/images/hand-drag.svg' className='toolbar__icon'/>
				</li>
				<li className='toolbar__tool' id='brush' onClick={selectTool}>
                    <img src='/images/brush.svg' className='toolbar__icon'/>
				</li>
				<li className='toolbar__tool' id='select' onClick={selectTool}>
                    <img className='toolbar__icon'/>
				</li>
				<li className='toolbar__tool' id='stamp' onClick={selectTool}>
                    <img className='toolbar__icon'/>
				</li>
			</ul>
		</div>
	)
}

export default Toolbar