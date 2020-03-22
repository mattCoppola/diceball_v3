import React from 'react';
import ReactDom from 'react-dom';

// Import Components
import DefenseActions from './components/DefenseActions';
import OffenseActions from './components/OffenseActions';
import UmpireActions from './components/UmpireActions';
import GameOutput from './components/GameOutput';
import GameStats from './components/GameStats';
import GameInfo from './components/GameInfo';
import ListGames from './components/ListGames';

import { umpIndicator, pitchCount } from './umpire/pitchLogic';
import { outsTracker } from './umpire/gameFlow';

import './style.css';

class GameConsole extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			gameInfo: {},
			gamesList: {},
			stats: {
				inning: 0.5,
				strikes: 0,
				balls: 0,
				outs: 0
			},
			output: [
				'Waiting on first pitch to begin the game...'
			],
			umpireOverwrite: false
		};

		this.handleDefenseAction = this.handleDefenseAction.bind(this);
		this.handleOffenseAction = this.handleOffenseAction.bind(this);
		this.handleUmpireAction = this.handleUmpireAction.bind(this);
		this.updateToDatabase = this.updateToDatabase.bind(this);
	}

	async componentDidMount () {
		const gamesData = await fetch(`https://diceball-api.herokuapp.com/game?homeTeam=XXX`);
		const gamesList = await gamesData.json();
		this.setState({ gamesList: gamesList });
		console.log(gamesList);

		const data = await fetch('https://diceball-api.herokuapp.com/game/5e41e894543782192509942a');
		const gameData = await data.json();
		const gameStats = gameData[0];
		this.setState({
			gameInfo: {
				_id: gameStats._id,
				date: gameStats.date,
				homeTeam: gameStats.homeTeam,
				awayTeam: gameStats.awayTeam,
				homeScore: gameStats.homeScore,
				awayScore: gameStats.awayScore
			},
			stats: {
				inning: gameStats.inning,
				strikes: gameStats.strikes,
				balls: gameStats.balls,
				outs: gameStats.outs
			}
		});
	}

	componentDidUpdate () {
		let endOfInning = outsTracker(this.state.stats.outs);
		if (endOfInning) {
			let inningOver = "[ UMPIRE ] Three outs.  Inning is over.  Click 'Pitch' to start new Inning.";
			this.setState((state) => {
				state.stats.outs = 0;
				state.stats.inning += 0.5;
				state.stats.strikes = 0;
				state.stats.balls = 0;

				const output = [
					inningOver,
					...state.output
				];
				return { output };
			});
		}

		if (this.state.umpireOverwrite) {
			this.handleDefenseAction({ text: 'Umpire Overwrite', defenseType: 'umpireOverwrite' });
			this.setState((state) => {
				state.umpireOverwrite = false;
			});
		}
	}

	handleDefenseAction (defenseAction) {
		let defense = '[ DEFENSE ] ';
		let pitchCall = 'Umpire Overwrites Balls or Strikes';

		if (defenseAction.defenseType === 'fielder' || defenseAction.defenseType === 'pick-off') {
			this.setState((state) => {
				const output = [
					defense.concat(defenseAction.text),
					...state.output
				];
				return { output };
			});
		} else if (defenseAction.defenseType === 'pitcher' || defenseAction.defenseType === 'umpireOverwrite') {
			this.setState((state) => {
				if (defenseAction.defenseType === 'pitcher') {
					let pitchResults = pitchCount(defenseAction.roll, this.state.stats);

					state.stats.balls = pitchResults.balls;
					state.stats.strikes = pitchResults.strikes;
					pitchCall = pitchResults.pitchCall;
				}

				const currentBatter = umpIndicator(this.state.stats);
				const batterReset = 'resetting balls and strikes based on umpIndicator...';

				if (currentBatter.walk || currentBatter.strikeout) {
					state.stats.balls = 0;
					state.stats.strikes = 0;
				}

				if (currentBatter.strikeout === true) {
					state.stats.outs += 1;
				}

				const output = [
					!currentBatter.text
						? defense.concat(defenseAction.text, ' >>> ', pitchCall)
						: defense.concat(
								defenseAction.text,
								' -- ',
								pitchCall,
								' -- ',
								currentBatter.text,
								' -- ',
								batterReset
							),
					...state.output
				];

				return { output };
			});
		}
	}

	handleOffenseAction (offenseAction) {
		let offense = '[ OFFENSE ] ';
		this.setState((state) => {
			const output = [
				offense.concat(offenseAction),
				...state.output
			];
			return { output };
		});
	}

	handleUmpireAction (umpireAction) {
		let umpire = '[ UMPIRE ] ';

		this.setState((state) => {
			const output = [
				umpire.concat(umpireAction.output),
				...state.output
			];
			if (umpireAction.inning) {
				state.stats.inning < 0 ? (state.stats.inning = 0) : (state.stats.inning += umpireAction.inning);
			} else if (umpireAction.out) {
				state.stats.outs < 0 ? (state.stats.outs = 0) : (state.stats.outs += umpireAction.out);
			} else if (umpireAction.strike) {
				state.stats.strikes < 0 ? (state.stats.strikes = 0) : (state.stats.strikes += umpireAction.strike);
				state.umpireOverwrite = true;
			} else if (umpireAction.ball) {
				state.stats.balls < 0 ? (state.stats.balls = 0) : (state.stats.balls += umpireAction.ball);
				state.umpireOverwrite = true;
			} else if (umpireAction.resetInning) {
				state.stats.outs = 0;
				state.stats.balls = 0;
				state.stats.strikes = 0;
			} else if (umpireAction.updateDatabase) {
				let data = this.state.stats;
				this.updateToDatabase(data);
			}
			return { output };
		});
	}

	async updateToDatabase (data) {
		let id = '5e41e894543782192509942a';
		console.log(data);
		const response = await fetch(`https://diceball-api.herokuapp.com/game/update/${id}`, {
			method: 'PUT',
			mode: 'cors',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		console.log(response);
	}

	render () {
		return (
			<div>
				<header>Diceball!</header>
				{/* <div className="ui four column grid container segment"> */}
				<div className="gameconsole">
					<div className="actions">
						<UmpireActions onUmpireAction={this.handleUmpireAction} />
						<OffenseActions onOffenseAction={this.handleOffenseAction} />
						<DefenseActions onDefenseAction={this.handleDefenseAction} />
						<GameStats stats={this.state.stats} />
					</div>
					{/* <div className="ui two column centered grid container segment"> */}
					<div className="playinfo">
						<GameOutput output={this.state.output} />
					</div>
					<div className="break" />
					<div>
						<GameInfo gameInfo={this.state.gameInfo} />
						<ListGames gamesList={this.state.gamesList} />
					</div>
				</div>
			</div>
		);
	}
}

ReactDom.render(<GameConsole />, document.querySelector('#root'));
