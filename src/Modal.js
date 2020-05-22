import React, { useState } from 'react'
import './Modal.css'

function Modal(props) {

    let [ seconds, setSeconds ] = useState(0)
    let [ increment, setIncrement ] = useState(0)
    let [ isDisabled, setIsDisabled ] = useState(true)

    const closeModal = () => {
        const modal = document.querySelector('.modal')
        const modalOverlay = document.querySelector('.modal-overlay')

        modal.classList.remove('modal__is-open')
        modalOverlay.classList.remove('modal__is-overlay-active')
        props.watchModalState(false)
    }

    const sendCustomTimerToParent = () => {
        props.watchCustomTimer(seconds, increment)
        closeModal()

        // clear input fields and props
        setIsDisabled(true)
        document.querySelector('.modal-timer-input input').value = ""
        document.querySelector('.modal-increment-input input').value = ""
    }

    const filterTimerValue = (e) => {
        const timerInput = document.querySelector('.modal-timer-input input')

        if (!/[0-9]/.test(Number(e.key)) || e.key === " ") {
            e.preventDefault()
            return false
        }

        let value = timerInput.value
        if (timerInput.value.length === 2) value = timerInput.value + ":"
        timerInput.value = value
    }

    const handleInputChange = (e) => {
        let value = e.target.value

        if (value.length !== 5) {
            setIsDisabled(true)
            return
        }

        let min = value.slice(0, 2)
        let sec = value.slice(3, 6)
        let total = Number(min) * 60 + Number(sec)
        
        setSeconds(total)
        setIsDisabled(false)
    }

    const validateIncrement = (e) => {
        const incrementInput = document.querySelector('.modal-increment-input input')

        if (!/[0-9]/.test(Number(e.key)) || e.key === " ") {
            e.preventDefault()
            return false
        }
        let value = incrementInput.value
        incrementInput.value = value
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h1>Custom time control</h1>
                <div className="modal-content">
                    <div className="modal-timer-input">
                        <label>Timer (mm:ss) </label>
                        <input
                            type="text"
                            onChange={ handleInputChange }
                            onKeyPressCapture={ filterTimerValue }
                            placeholder="00:00"
                            maxLength="5"
                        />
                    </div>
                    <div className="modal-increment-input">
                        <label>Increment (ss) </label>
                        <input
                            type="text"
                            placeholder="00"
                            maxLength="2"
                            onKeyPressCapture={ validateIncrement }
                            onChange={ (e) => { setIncrement(e.target.value) } }
                        />
                    </div>
                </div>
                <div className="modal-actions">
                    <button id="modal-close-button" onClick={ closeModal }>Close</button>
                    <button
                        id="modal-save-button"
                        onClick={ sendCustomTimerToParent }
                        disabled={ isDisabled }
                    >Save</button>
                </div>
            </div>
        </div>
    )
}

export default Modal