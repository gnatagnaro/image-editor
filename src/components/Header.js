import React, { useEffect, useState } from 'react'


function Header({ handleFormChange }) {


    const showUploadForm = (e) => {
        handleFormChange(e.target.id)
    }

    return (
        <div className='header'>
          <ul className='header__list'>
              <li className='header__item'>
                  <p className='header__dropdown'>File</p>
                  <div className='header__buttons'>
                      <button id='new' onClick={showUploadForm} className='header__button'>
                          New
                      </button>
                      <button id='open' onClick={showUploadForm} className='header__button'>
                          Open
                      </button>
                      <button id='Save' onClick={showUploadForm} className='header__button'>
                          Save
                      </button>
                  </div>
              </li>
              <li className='header__item'>
                  <p className='header__dropdown'>Filter</p>
                  <div className='header__buttons'>
                      <button className='header__button'>
                          Gaussian blure
                      </button>
                      <button className='header__button'>
                          Black and White
                      </button>
                      <button className='header__button'>
                          Color changes
                      </button>
                  </div>
              </li>
          </ul>
        </div>
      )
}

export default Header