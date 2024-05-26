import { useLocation, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 80vh; 
`;

const GameOver = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: white; 
`;

const Winner = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: white; 
`;

const Info = styled.p`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: hsl(217, 72%, 86%); 
`;

const PlayAgainButton = styled.button`
  text-decoration: none;
  text-transform: uppercase;
  padding: 1rem 2rem;
  border: 1px solid white;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: transparent;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: white;
    color: #1f3756
  }
`;

const GameResults = () => {
	const location = useLocation();
	const gameResults = location.state;

	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/");
		window.location.reload();
	};

	if (!gameResults) {
		return (
			<ResultsContainer>
				<Info>Loading results...</Info>
			</ResultsContainer>
		);
	}

	return (
		<ResultsContainer>
			<GameOver>Game Over!</GameOver>
			<Info>Bet Amount: {gameResults.betAmount} CSPR</Info>
			<Info>Rounds: {gameResults.rounds}</Info>
			<Info>Your Score: {gameResults.player1Score}</Info>
			<Info>Opponent Score: {gameResults.player2Score}</Info>
			<Info>Winner: {gameResults.winner}</Info>
			<PlayAgainButton onClick={handleClick}>Play Again</PlayAgainButton>
		</ResultsContainer>
	);
};

export default GameResults;
