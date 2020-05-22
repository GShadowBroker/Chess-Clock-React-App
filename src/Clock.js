import React, { Component } from 'react'
import './Clock.css'
import moment from 'moment'
import { BsFillPauseFill, BsFillPlayFill, BsFillSkipBackwardFill } from 'react-icons/bs'

class Clock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gameStarted: false,
            gameFinished: false,
            paused: false,
            blackTimer: this.props.timeControl,
            whiteTimer: this.props.timeControl,
            increment: this.props.increment,
            toPlay: 'white',
            turn: 1,
            muted: this.props.muted
        }
        this.tickBlackClock = this.tickBlackClock.bind(this)
        this.tickWhiteClock = this.tickWhiteClock.bind(this)
        this.togglePause = this.togglePause.bind(this)
        this.passTurn = this.passTurn.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
        this.runWhiteTimer = null
        this.runBlackTimer = null
        this.passTurnAudio = new Audio('http://192.168.0.104:3000/button.wav')
        this.playButtonAudio = this.playButtonAudio.bind(this)
        this.timeoutAudio = new Audio('http://192.168.0.104:3000/timeout.wav')
        this.playTimeoutAudio = this.playTimeoutAudio.bind(this)
    }

    componentDidMount() {
        document.addEventListener('keyup', (e) => {
            e.preventDefault()
            if (e.keyCode === 32 && !this.state.gameFinished) {
                this.passTurn()
            }
        })
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', (e) => {
            e.preventDefault()
            if (e.keyCode === 32 && !this.state.gameFinished) {
                this.passTurn()
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.timeControl !== this.props.timeControl) {
            this.setState({
                whiteTimer: this.props.timeControl,
                blackTimer: this.props.increment
            })
            this.resetTimer()
        }
        if (prevProps.muted !== this.props.muted) {
            this.setState({
                muted: this.props.muted
            })
        }
    }

    resetTimer() {
        clearInterval(this.runBlackTimer)
        clearInterval(this.runWhiteTimer)
        this.setState({
            gameStarted: false,
            gameFinished: false,
            whiteTimer: this.props.timeControl,
            blackTimer: this.props.timeControl,
            increment: this.props.increment,
            muted: this.props.muted,
            toPlay: 'white',
            turn: 1,
            paused: false
        })
    }

    playButtonAudio() {
        if (this.state.muted) return
        this.passTurnAudio.play()
    }
    playTimeoutAudio() {
        if (this.state.muted) return
        this.timeoutAudio.play()
    }

    tickBlackClock() {
        if (this.state.blackTimer > 0) {
            this.setState((state) => ({
                blackTimer: state.blackTimer - 1
            }))
        } else {
            clearInterval(this.runWhiteTimer)
            clearInterval(this.runBlackTimer)
            this.setState({
                gameFinished: true
            })
            if (!this.state.muted) this.playTimeoutAudio()
        }
    }

    tickWhiteClock() {
        if (this.state.whiteTimer > 0) {
            this.setState((state) => ({
                whiteTimer: state.whiteTimer - 1
            }))
        } else {
            clearInterval(this.runWhiteTimer)
            clearInterval(this.runBlackTimer)
            this.setState({
                gameFinished: true
            })
            if (!this.state.muted) this.playTimeoutAudio()
        }
    }

    togglePause() {
        if (!this.state.gameStarted) return

        if (!this.state.paused) {
            clearInterval(this.runWhiteTimer)
            clearInterval(this.runBlackTimer)
        } else {
            this.state.toPlay === 'white'
                ? this.runWhiteTimer = setInterval(this.tickWhiteClock, 1000)
                : this.runBlackTimer = setInterval(this.tickBlackClock, 1000)
        }

        this.setState(state => ({
            paused: !state.paused
        }))
    }

    passTurn() {
        const { gameStarted, toPlay } = this.state

        if (!gameStarted) {
            this.setState({
                gameStarted: true,
                toPlay: 'black',
                paused: false
            })

            this.runBlackTimer = setInterval(this.tickBlackClock, 1000)
            this.playButtonAudio()

        } else if (toPlay === 'white') {
            this.setState(state => ({
                toPlay: 'black',
                whiteTimer: state.whiteTimer + state.increment,
                paused: false
            }))

            this.runBlackTimer = setInterval(this.tickBlackClock, 1000)
            clearInterval(this.runWhiteTimer)
            this.playButtonAudio()

        } else {
            this.setState(state => ({
                toPlay: 'white',
                blackTimer: state.blackTimer + state.increment,
                turn: state.turn + 1,
                paused: false
            }))

            this.runWhiteTimer = setInterval(this.tickWhiteClock, 1000)
            clearInterval(this.runBlackTimer)
            this.playButtonAudio()
        }
    }

    render() {

        let rightSwitchClass = "right-switch"
        let leftSwitchClass = "left-switch"

        if (this.state.toPlay === 'white') {
            rightSwitchClass += " right-switch-pressed"
        } else {
            leftSwitchClass += " left-switch-pressed"
        }   

        return (
            <div className="clock" key={ this.props.timeControl }>
                <div className="clock-body">
                    <div className="white-player-clock">
                        <h1
                            style={ this.state.whiteTimer < 10 ? { color: '#e74c3c' } : {}}
                        >{ moment.utc(this.state.whiteTimer * 1000).format('mm.ss') }</h1>
                    </div>
                    <div className="black-player-clock">
                        <h1
                            style={ this.state.blackTimer < 10 ? { color: '#e74c3c' } : {}}
                        >{ moment.utc(this.state.blackTimer * 1000).format('mm.ss') }</h1>
                    </div>
                    <div className="controls">
                        <button
                            className="pause-button"
                            onClick={ this.togglePause }
                            disabled={ this.state.gameFinished || !this.state.gameStarted }
                        >
                            {
                                this.state.paused
                                ? <span><BsFillPlayFill/> Unpause</span>
                                : <span><BsFillPauseFill/> Pause</span>
                            }
                        </button>
                        <button
                            className="to-play-button"
                            onClick={ this.passTurn }
                            disabled={ this.state.gameFinished }
                        >
                            Turn { this.state.turn }:
                            { this.state.toPlay === 'white' ? ' White To Play' : ' Black To Play' }
                        </button>
                        <button
                            className="reset-button"
                            onClick={ this.resetTimer }
                        >
                            <span>Reset<BsFillSkipBackwardFill/></span>
                        </button>
                        
                    </div>
                    <div className="roof"/>
                    <div className={ leftSwitchClass }/>
                    <div className={ rightSwitchClass }/>
                </div>

                {/* mobile */}

                <div className="mobile-clock">
                    <div
                        className="player-clock white-player-clock-mobile"
                        onClick={ this.passTurn }
                        style={ this.state.toPlay === 'white'
                            ? { backgroundColor: '#d35400' }
                            : { background: '#2c3e50' } }
                    >
                        <h1>{ moment.utc(this.state.whiteTimer * 1000).format('mm.ss') }</h1>
                    </div>
                    <div
                        className="player-clock black-player-clock-mobile"
                        onClick={ this.passTurn }
                        style={ this.state.toPlay === 'black'
                            ? { backgroundColor: '#d35400' }
                            : { background: '#2c3e50' } }
                    >
                        <h1>{ moment.utc(this.state.blackTimer * 1000).format('mm.ss') }</h1>
                    </div>

                    <div className="mobile-controls">
                    <button
                            className="pause-button-mobile"
                            onClick={ this.togglePause }
                            disabled={ this.state.gameFinished || !this.state.gameStarted }
                        >
                            {
                                this.state.paused
                                ? <span><BsFillPlayFill/> Unpause</span>
                                : <span><BsFillPauseFill/> Pause</span>
                            }
                        </button>
                        <button
                            className="reset-button-mobile"
                            onClick={ this.resetTimer }
                        >
                            <span>Reset <BsFillSkipBackwardFill/></span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

Clock.defaultProps = {
    timeControl: 300,
    increment: 3,
    muted: false
}

export default Clock