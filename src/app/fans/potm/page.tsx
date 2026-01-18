'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo?: string;
}

interface Vote {
  matchId: string;
  playerId: number;
  timestamp: number;
}

// Sample squad - in production would come from API
const squad: Player[] = [
  { id: 1, name: 'Lewis Watkins', position: 'GK', number: 1 },
  { id: 2, name: 'Oliver Berry', position: 'DEF', number: 2 },
  { id: 3, name: 'Luke Edwards', position: 'DEF', number: 3 },
  { id: 4, name: 'Josh Hinwood', position: 'DEF', number: 4 },
  { id: 5, name: 'Andrew Larcombe', position: 'DEF', number: 5 },
  { id: 6, name: 'Jac Evans', position: 'DEF', number: 6 },
  { id: 7, name: 'Finley Hayman', position: 'MID', number: 7 },
  { id: 8, name: 'Isaac Powell', position: 'MID', number: 8 },
  { id: 9, name: 'Tom Berry', position: 'FWD', number: 9 },
  { id: 10, name: 'Efan Fletcher', position: 'MID', number: 10 },
  { id: 11, name: 'Tom Dean', position: 'MID', number: 11 },
  { id: 12, name: 'Josh Gibson', position: 'FWD', number: 12 },
  { id: 14, name: 'Mario van Dieren', position: 'MID', number: 14 },
  { id: 15, name: 'Sam Powell', position: 'DEF', number: 15 },
  { id: 18, name: 'Joseph Bowen', position: 'MID', number: 18 },
  { id: 19, name: 'Alex McDowell', position: 'MID', number: 19 },
  { id: 20, name: 'Cole Doolan', position: 'MID', number: 20 },
  { id: 22, name: 'Arthur Furness', position: 'FWD', number: 22 },
];

// Current match info - would come from API in production
const currentMatch = {
  id: 'mens-2026-01-20',
  opponent: 'Llantwit Major',
  date: '2026-01-20',
  competition: 'JD Cymru South',
  result: null as { home: number; away: number } | null, // null = match not yet played
  votingOpen: true,
  votingEnds: '2026-01-21T23:59:59',
};

export default function PlayerOfTheMatchPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [results, setResults] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Check if user has already voted
    const votes = localStorage.getItem('potm-votes');
    if (votes) {
      const parsedVotes: Vote[] = JSON.parse(votes);
      const existingVote = parsedVotes.find(v => v.matchId === currentMatch.id);
      if (existingVote) {
        setHasVoted(true);
        setSelectedPlayer(existingVote.playerId);
      }
    }

    // Load results
    const savedResults = localStorage.getItem(`potm-results-${currentMatch.id}`);
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const submitVote = () => {
    if (!selectedPlayer || hasVoted) return;

    // Save vote
    const votes = localStorage.getItem('potm-votes');
    const parsedVotes: Vote[] = votes ? JSON.parse(votes) : [];
    parsedVotes.push({
      matchId: currentMatch.id,
      playerId: selectedPlayer,
      timestamp: Date.now(),
    });
    localStorage.setItem('potm-votes', JSON.stringify(parsedVotes));

    // Update results
    const newResults = { ...results };
    newResults[selectedPlayer] = (newResults[selectedPlayer] || 0) + 1;
    setResults(newResults);
    localStorage.setItem(`potm-results-${currentMatch.id}`, JSON.stringify(newResults));

    setHasVoted(true);
    setVoteSubmitted(true);
    setShowResults(true);
  };

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
  const sortedResults = Object.entries(results)
    .map(([playerId, votes]) => ({
      player: squad.find(p => p.id === Number(playerId)),
      votes,
      percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  const positionGroups = {
    GK: squad.filter(p => p.position === 'GK'),
    DEF: squad.filter(p => p.position === 'DEF'),
    MID: squad.filter(p => p.position === 'MID'),
    FWD: squad.filter(p => p.position === 'FWD'),
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-celtic-blue via-celtic-blue to-celtic-blue-dark py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-60 h-60 border-4 border-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-celtic-yellow text-celtic-dark px-4 py-2 rounded-full mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="font-semibold">Fan Vote</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display uppercase mb-4 text-white">Player of the Match</h1>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            Vote for your Man of the Match after each game
          </p>
        </div>
      </section>

      {/* Match Info */}
      <section className="py-6 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{currentMatch.competition}</p>
            <h2 className="text-xl font-bold text-celtic-dark mb-1">
              Cwmbran Celtic vs {currentMatch.opponent}
            </h2>
            <p className="text-gray-600">
              {new Date(currentMatch.date).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {currentMatch.votingOpen && (
              <p className="text-sm text-green-600 mt-2">
                Voting is open until {new Date(currentMatch.votingEnds).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Voting Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {voteSubmitted ? (
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-celtic-dark mb-2">Thanks for voting!</h2>
                <p className="text-gray-600 mb-4">
                  You voted for <strong>{squad.find(p => p.id === selectedPlayer)?.name}</strong>
                </p>
              </div>
            ) : hasVoted ? (
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  You&apos;ve already voted for <strong>{squad.find(p => p.id === selectedPlayer)?.name}</strong>
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-celtic-dark text-center mb-2">Cast Your Vote</h2>
                <p className="text-center text-gray-600 mb-8">Select the player you think deserves the award</p>
              </>
            )}

            {/* Toggle Results */}
            {hasVoted && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="text-celtic-blue font-semibold hover:underline"
                >
                  {showResults ? 'Hide Results' : 'View Current Results'}
                </button>
              </div>
            )}

            {/* Results */}
            {showResults && totalVotes > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="font-bold text-lg mb-4 text-celtic-dark">Current Results</h3>
                <p className="text-sm text-gray-500 mb-4">{totalVotes} votes cast</p>
                <div className="space-y-3">
                  {sortedResults.slice(0, 5).map((result, idx) => (
                    <div key={result.player?.id} className="flex items-center gap-4">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-celtic-yellow text-celtic-dark' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-celtic-dark">{result.player?.name}</span>
                          <span className="text-sm text-gray-600">{result.votes} votes ({result.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${idx === 0 ? 'bg-celtic-yellow' : 'bg-celtic-blue'}`}
                            style={{ width: `${result.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Player Selection */}
            {!hasVoted && (
              <>
                {Object.entries(positionGroups).map(([position, players]) => (
                  <div key={position} className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      {position === 'GK' ? 'Goalkeepers' :
                       position === 'DEF' ? 'Defenders' :
                       position === 'MID' ? 'Midfielders' : 'Forwards'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {players.map(player => (
                        <button
                          key={player.id}
                          onClick={() => setSelectedPlayer(player.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedPlayer === player.id
                              ? 'border-celtic-blue bg-celtic-blue/5'
                              : 'border-gray-200 hover:border-celtic-blue/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              selectedPlayer === player.id
                                ? 'bg-celtic-blue text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {player.number}
                            </div>
                            <div>
                              <p className="font-semibold text-celtic-dark text-sm">{player.name}</p>
                              <p className="text-xs text-gray-500">{player.position}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <div className="text-center mt-8">
                  <button
                    onClick={submitVote}
                    disabled={!selectedPlayer}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                      selectedPlayer
                        ? 'bg-celtic-blue text-white hover:bg-celtic-blue-dark'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Vote
                  </button>
                  {selectedPlayer && (
                    <p className="text-sm text-gray-500 mt-2">
                      Voting for: <strong>{squad.find(p => p.id === selectedPlayer)?.name}</strong>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Previous Winners */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-celtic-dark text-center mb-8">Recent POTM Winners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow">
                <div className="w-16 h-16 bg-celtic-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-celtic-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">vs Carmarthen Town</p>
                <p className="font-bold text-lg text-celtic-dark">Isaac Powell</p>
                <p className="text-xs text-gray-400">11 Jan 2026</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow">
                <div className="w-16 h-16 bg-celtic-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-celtic-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">vs Treowen Stars</p>
                <p className="font-bold text-lg text-celtic-dark">Mario van Dieren</p>
                <p className="text-xs text-gray-400">2 Jan 2026</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow">
                <div className="w-16 h-16 bg-celtic-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-celtic-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">vs Ynyshir Albions</p>
                <p className="font-bold text-lg text-celtic-dark">Lewis Watkins</p>
                <p className="text-xs text-gray-400">27 Dec 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/fans" className="text-celtic-blue font-semibold hover:underline">
            Back to Fans Hub
          </Link>
        </div>
      </section>
    </>
  );
}
