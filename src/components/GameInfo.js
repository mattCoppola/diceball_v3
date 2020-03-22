import React from 'react';

class GameInfo extends React.Component {
	render () {
		const gameInfo = this.props.gameInfo;

		return (
			<div className="teaminfo">
				<h1>Game Info</h1>
				<div className="team-info">
					<p>
						<b>Home Team:</b> {gameInfo.homeTeam}
					</p>
					<p>
						<b>Home Score:</b> {gameInfo.homeScore}
					</p>
					<p>
						<b>Away Team:</b> {gameInfo.awayTeam}
					</p>
					<p>
						<b>Away Score:</b> {gameInfo.awayScore}
					</p>
				</div>
			</div>
		);
	}
}

export default GameInfo;
