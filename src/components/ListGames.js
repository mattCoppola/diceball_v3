import React from 'react';

const rows = [];

class ListGames extends React.Component {
	componentDidUpdate () {
		const games = this.props.gamesList;

		games.forEach(function (game) {
			rows.push(
				<tr key={game._id}>
					<td>{game._id}</td>
					<td>{game.date}</td>
					<td>{game.homeTeam}</td>
					<td>{game.awayTeam}</td>
					<td>{game.homeScore}</td>
					<td>{game.awayScore}</td>
				</tr>
			);
		});
	}

	render () {
		return (
			<div className="teaminfo">
				<h1>Games in DB</h1>
				<div className="team-info">
					<table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Date</th>
								<th>homeTeam</th>
								<th>awayTeam</th>
								<th>homeScore</th>
								<th>awayScore</th>
							</tr>
						</thead>
						<tbody>{rows}</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default ListGames;
