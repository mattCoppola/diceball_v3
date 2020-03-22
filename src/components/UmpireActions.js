import React from 'react';

import randomDiceRoll from '../diceroll/diceroll';

class UmpireActions extends React.Component {
	constructor (props) {
		super(props);
		this.handleAddInningAction = this.handleAddInningAction.bind(this);
		this.handleSubtractInningAction = this.handleSubtractInningAction.bind(this);
		this.handleAddOutAction = this.handleAddOutAction.bind(this);
		this.handleSubtractOutAction = this.handleSubtractOutAction.bind(this);
		this.handleDiceRollAction = this.handleDiceRollAction.bind(this);
		this.handleInningResetAction = this.handleInningResetAction.bind(this);
		this.handleAddStrikeAction = this.handleAddStrikeAction.bind(this);
		this.handleSubtractStrikeAction = this.handleSubtractStrikeAction.bind(this);
		this.handleAddBallAction = this.handleAddBallAction.bind(this);
		this.handleSubtractBallAction = this.handleSubtractBallAction.bind(this);
		this.handleDatabaseUpdate = this.handleDatabaseUpdate.bind(this);
	}

	handleAddInningAction () {
		let result = { output: 'Half Inning Added.', inning: 0.5 };
		this.props.onUmpireAction(result);
	}

	handleSubtractInningAction () {
		let result = { output: 'Half Inning Subtracted.', inning: -0.5 };
		this.props.onUmpireAction(result);
	}

	handleAddOutAction () {
		let result = { output: 'Out added.', out: 1 };
		this.props.onUmpireAction(result);
	}

	handleSubtractOutAction () {
		let result = { output: 'Out Subtracted.', out: -1 };
		this.props.onUmpireAction(result);
	}

	handleAddStrikeAction () {
		let result = { output: 'Strike Added', strike: 1 };
		this.props.onUmpireAction(result);
	}

	handleSubtractStrikeAction () {
		let result = { output: 'Strike Subtracted', strike: -1 };
		this.props.onUmpireAction(result);
	}

	handleAddBallAction () {
		let result = { output: 'Ball Added', ball: 1 };
		this.props.onUmpireAction(result);
	}

	handleSubtractBallAction () {
		let result = { output: 'Ball Subtracted', ball: -1 };
		this.props.onUmpireAction(result);
	}

	handleDiceRollAction () {
		let result = { output: `Umpire Rolls a ${randomDiceRoll()}` };
		this.props.onUmpireAction(result);
	}

	handleInningResetAction () {
		let result = { output: 'Resetting Inning', resetInning: true };
		this.props.onUmpireAction(result);
	}

	handleDatabaseUpdate () {
		let result = { output: 'Updating game stats to Database', updateDatabase: true };
		this.props.onUmpireAction(result);
	}

	render () {
		return (
			// <div className="ui column raised container">
			<div className="umpire-actions">
				<h1>Umpire Actions</h1>
				<div className="action-card">
					<button onClick={this.handleAddInningAction} className="ui six wide column button">
						+ Inning
					</button>
					<button onClick={this.handleSubtractInningAction} className="ui six wide column button">
						- Inning
					</button>
					<button onClick={this.handleAddOutAction} className="ui six wide column button">
						+ Out
					</button>
					<button onClick={this.handleSubtractOutAction} className="ui six wide column button">
						- Out
					</button>
					<button onClick={this.handleAddStrikeAction} className="ui six wide column button">
						+ Strike
					</button>
					<button onClick={this.handleSubtractStrikeAction} className="ui six wide column button">
						- Strike
					</button>
					<button onClick={this.handleAddBallAction} className="ui six wide column button">
						+ Balls
					</button>
					<button onClick={this.handleSubtractBallAction} className="ui six wide column button">
						- Balls
					</button>
					<button onClick={this.handleDiceRollAction} className="ui six wide column button">
						Dice Roll
					</button>
					<button onClick={this.handleInningResetAction} className="ui six wide column button">
						Reset Inning
					</button>
					<button onClick={this.handleDatabaseUpdate} className="ui six wide column button">
						Update DB
					</button>
				</div>
			</div>
		);
	}
}

export default UmpireActions;
