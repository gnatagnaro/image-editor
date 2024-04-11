import { useEffect, useState } from "react"

function UploadForm({form, handleFormChange, createNewFile, openImage, urlChange, heightChange, widthChange, fileChange}) {

    const closeUploadForm = (e) => {
        handleFormChange('none')
    }

    useEffect(() => {
        document.addEventListener('keydown' ,function(e) {
            if(e.code == 'Escape') {
                closeUploadForm()
            }
        })
    },[])

    if (form == "open") {
        return (
            <div className="upload-form-wrapper">
                <form className="upload-form">
                    <label className="form__pair">
                        Загрузите изображение с вашего компьютера
                        <input onChange={fileChange} type="file"/>
                    </label>
                    <label className="form__pair">
                        Или вставьте ссылку на изображение 
                        <input type="url" onChange={urlChange} placeholder="hhtps://example.com" id="url-input"/>
                    </label>
                    <div className="form__buttons">
                        <button onClick={openImage} className="form__button">
                            Open image
                        </button>
                        <button onClick={closeUploadForm} className="form__button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    if (form == "new") {
        return (
            <div className="upload-form-wrapper">
                <form className="upload-form">
                    <div className="upload-form__height-n-width">
                        <label className="form__pair form__pair--horizontal">
                            Width
                            <input onChange={widthChange} type="number"/>
                        </label>
                        <label className="form__pair form__pair--horizontal">
                            Height
                            <input onChange={heightChange} type="number"/>
                        </label>
                    </div>
                    <div className="form__buttons">
                        <button onClick={createNewFile} className="form__button">
                            Create
                        </button>
                        <button onClick={closeUploadForm} className="form__button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        )
    }    
}

export default UploadForm