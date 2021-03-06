import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './Clock.js'
import './Navigation.css'
import { FaBars, FaVolumeUp, FaVolumeMute, FaStopwatch, FaPen } from 'react-icons/fa'
import { AiFillFire, AiFillThunderbolt } from 'react-icons/ai'

import Modal from './Modal.js'

function App() {

  let [ timeControl, setTimeControl ] = useState(300)
  let [ increment, setIncrement ] = useState(3)
  let [ muted, setMuted ] = useState(false)
  let [ timeControlsList, setTimeControlsList ] = useState([
    { id: 0, title: 'Bullet', seconds: 60, increment: 0, icon: <AiFillFire /> },
    { id: 1, title: 'Blitz', seconds: 180, increment: 2, icon: <AiFillThunderbolt /> },
    { id: 2, title: 'Blitz', seconds: 300, increment: 3, icon: <AiFillThunderbolt /> },
    { id: 3, title: 'Rapid', seconds: 900, increment: 10, icon: <FaStopwatch /> },
    { id: 4, title: 'Rapid', seconds: 1500, increment: 10, icon: <FaStopwatch /> },
    { id: 5, title: 'Custom', seconds: 0, increment: 0, icon: <FaPen /> }
  ])
  let [ selectedTimeControl, setSelectedTimeControl ] = useState(2)
  let [ isDrawerOpen, setIsDrawerOpen ] = useState(false)
  let [ isModalOpen, setIsModalOpen ] = useState(false)

  useEffect(() => {
    for (let elem of document.getElementsByClassName('time-control')) {
      if (Number(elem.id) === Number(selectedTimeControl)) {
        elem.classList.add('active')
      } else {
        elem.classList.remove('active')
      }
    }
    for (let elem of document.getElementsByClassName('drawer-item')) {
      if (Number(elem.id) === Number(selectedTimeControl)) {
        elem.classList.add('active')
      } else {
        elem.classList.remove('active')
      }
    }
  })

  useEffect(() => {
    const modal = document.querySelector('.modal')
    const modalOverlay = document.querySelector('.modal-overlay')

    if (isModalOpen) {
      modal.classList.add('modal__is-open')
      modalOverlay.classList.add('modal__is-overlay-active')
    } else {
      modal.classList.remove('modal__is-open')
      modalOverlay.classList.remove('modal__is-overlay-active')
    }
  })

  const watchModalState = (bool) => {
    setIsModalOpen(bool)
  }
  const watchCustomTimer = (timerModal, incrementModal) => {
    setTimeControl(Number(timerModal))
    setIncrement(Number(incrementModal))
    
    setTimeControlsList(timeControlsList.map(item => item.id === 5
      ? { id: 5, title: 'Custom', seconds: Number(timerModal), increment: Number(incrementModal), icon: <FaPen /> }
      : item
    ))

    setSelectedTimeControl(5)
  }

  const openDrawer = () => {
    document.querySelector('.drawer').style.width = "250px"
    document.getElementById('main').style.marginLeft = "250px"
    document.querySelector('.nav').style.transform = "translate(250px)"
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    document.querySelector('.drawer').style.width = "0"
    document.getElementById('main').style.marginLeft = "0"
    document.querySelector('.nav').style.transform = "translate(0px)"
    setIsDrawerOpen(false)
  }

  const setTimeControlConfig = (e) => {
    if (Number(e.currentTarget.id) === 5) {
      setIsModalOpen(true)
      return
    }

    let index = e.currentTarget.id
    setTimeControl(timeControlsList[index].seconds)
    setIncrement(timeControlsList[index].increment)
    setSelectedTimeControl(index)
  }

  const timeControls = timeControlsList.map(item => (
    <li
        className={ selectedTimeControl === item.id
            ? 'time-control active'
            : 'time-control' }
        id={ item.id }
        key={ item.id }
        onClick={ setTimeControlConfig }
      >
        <span className="time-control-icon">{ item.icon }</span>
        <span className="time-control-title">{ item.title }</span>
        <div className="time-control-timer">{ Math.round(item.seconds / 60) }+{ item.increment }</div>
      </li>
  ))

  const timeControlsDrawer = timeControlsList.map(item => (
    <li
        className={ selectedTimeControl === item.id
            ? 'drawer-item active'
            : 'drawer-item' }
        key={ item.id }
        onClick={ setTimeControlConfig }
        id={ item.id }
      >
        <div className="drawer-icon">
          { item.icon }
        </div>
        <div className="drawer-text">
          <span className="drawer-item-title">{ item.title }</span>
        <div className="drawer-item-timer">{ Math.round(item.seconds / 60) }+{ item.increment }</div>
        </div>
      </li>
  ))

  return (
    <div className="App">

      <Modal watchModalState={ watchModalState } watchCustomTimer={ watchCustomTimer } />

      <div id="main">
        <div className="drawer">
          <span id="close-drawer-button" onClick={ closeDrawer }>&times;</span>
          <ul>
            { timeControlsDrawer }
          </ul>
        </div>
        
        <div className="nav">
          <div className="nav-title">
            <FaBars className="drawer-button" onClick={ isDrawerOpen ? closeDrawer : openDrawer } />
            <span className="chess-title">CHESS<strong className="clock-title">CLOCK</strong></span>
          </div>
          <div className="nav-menu">
            <ul>
              { timeControls }
            </ul>
          </div>
        </div>

        <Clock timeControl={ timeControl } increment={ increment } muted={ muted }/>

        <footer>
          <div className="copyright">&copy; { new Date().getFullYear() }</div>
          <div className="press-space">
            <p>Press <span style={{color: "#d35400"}}>SPACE</span> to pass turn</p>
          </div>
          <div className="mute-button">
            { 
              muted
              ? <FaVolumeMute onClick={ () => setMuted(!muted) } />
              : <FaVolumeUp onClick={ () => setMuted(!muted) } />
            }
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App;
