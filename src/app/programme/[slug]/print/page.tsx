'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getOppositionById, OppositionTeam } from '@/data/opposition-data';
import CoverPage from '@/components/programme/CoverPage';
import { mockSquad, mockLeagueTable, mockResults, mockFixtures, fromCometDate, clubInfo } from '@/data/mock-data';

// Types
interface ProgrammeData {
  opponent: string;
  date: string;
  kickoff: string;
  competition: string;
  coverImage?: string;
  uploadedCover?: string;
  managersNotes?: string;
  startingXI?: number[];
  substitutes?: number[];
  captain?: number | null;
}

// Parse slug to extract date and opponent ID
function parseSlug(slug: string): { date: string; opponent: string } | null {
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (match) {
    return { date: match[1], opponent: match[2] };
  }
  return null;
}

// Traditional print colours
const COLORS = {
  cream: '#fdf8e8',
  navy: '#1e3a5f',
  navyDark: '#0f2847',
  yellow: '#f4c430',
  gold: '#d4a012',
  black: '#1a1a1a',
  gray: '#4a4a4a',
  lightGray: '#e8e4d8',
  border: '#c4b896',
};

// A4 page dimensions at 96 DPI
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

// Base page styles for print
const pageStyle: React.CSSProperties = {
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  backgroundColor: COLORS.cream,
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'Georgia, "Times New Roman", serif',
  pageBreakAfter: 'always',
  pageBreakInside: 'avoid',
};

// Page header component (traditional style)
function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{
      borderBottom: `3px solid ${COLORS.navy}`,
      paddingBottom: 8,
      marginBottom: 16,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 6,
          height: 40,
          backgroundColor: COLORS.yellow,
        }} />
        <div>
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.navy,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              fontSize: 12,
              color: COLORS.gray,
              margin: '4px 0 0 0',
              fontStyle: 'italic',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Sponsor footer for print pages
function SponsorFooter() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: COLORS.navyDark,
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
    }}>
      <span style={{ color: COLORS.yellow, fontSize: 11, fontWeight: 600 }}>
        MAIN SPONSOR: AVONDALE MOTOR PARK
      </span>
      <span style={{ color: '#fff', fontSize: 10 }}>|</span>
      <span style={{ color: '#fff', fontSize: 10 }}>
        Rhino • Coffiology • EnerSys • Endurance
      </span>
    </div>
  );
}

// Page 2: Manager's Notes
function ManagersNotesPage({ programmeData }: { programmeData: ProgrammeData }) {
  const notes = programmeData.managersNotes ||
    `Good afternoon and welcome to the Avondale Motor Park Arena for today's JD Cymru South fixture.

A warm welcome to our visitors and their supporters who have made the journey today. We hope you enjoy your visit to Cwmbran.

The lads have been working hard in training this week and we're looking forward to putting on a good performance for you all today. The spirit in the camp is excellent and we're determined to give you something to cheer about.

Thank you as always for your continued support. Your presence here today means everything to the players and the club.

Up The Celtic!`;

  return (
    <div style={pageStyle}>
      <div style={{ padding: '24px 32px 60px 32px' }}>
        <PageHeader title="Manager's Notes" subtitle="A message from the gaffer" />

        <div style={{
          display: 'flex',
          gap: 24,
          marginBottom: 24,
        }}>
          {/* Manager photo area */}
          <div style={{
            width: 160,
            height: 200,
            backgroundColor: COLORS.lightGray,
            border: `2px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ textAlign: 'center', color: COLORS.gray }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
              <div style={{ fontSize: 11 }}>Manager Photo</div>
            </div>
          </div>

          {/* Manager info */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.navy,
              margin: '0 0 8px 0',
            }}>
              Simon Berry
            </h3>
            <p style={{
              fontSize: 14,
              color: COLORS.gray,
              margin: '0 0 12px 0',
              fontStyle: 'italic',
            }}>
              First Team Manager
            </p>
            <div style={{
              display: 'inline-block',
              backgroundColor: COLORS.yellow,
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.navyDark,
            }}>
              SINCE 2023
            </div>
          </div>
        </div>

        {/* Notes content */}
        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${COLORS.border}`,
          padding: 24,
          fontSize: 13,
          lineHeight: 1.8,
          color: COLORS.black,
          whiteSpace: 'pre-wrap',
        }}>
          {notes}
        </div>

        {/* Signature area */}
        <div style={{
          marginTop: 24,
          textAlign: 'right',
          paddingRight: 40,
        }}>
          <p style={{
            fontSize: 18,
            fontStyle: 'italic',
            color: COLORS.navy,
            margin: 0,
          }}>
            Simon Berry
          </p>
          <p style={{
            fontSize: 11,
            color: COLORS.gray,
            margin: '4px 0 0 0',
          }}>
            First Team Manager
          </p>
        </div>
      </div>
      <SponsorFooter />
    </div>
  );
}

// Page 3: Squad Page with tick boxes
function SquadPage() {
  const squad = mockSquad.results;

  const goalkeepers = squad.filter(p => p.position === 'Goalkeeper');
  const defenders = squad.filter(p => ['Right Back', 'Left Back', 'Centre Back'].includes(p.position));
  const midfielders = squad.filter(p => ['Central Midfield', 'Defensive Midfield', 'Attacking Midfield', 'Left Wing', 'Right Wing'].includes(p.position));
  const forwards = squad.filter(p => p.position === 'Striker');

  const renderPlayerRow = (player: typeof squad[0]) => (
    <div key={player.squadNo} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '3px 0',
      borderBottom: `1px dotted ${COLORS.border}`,
    }}>
      {/* Tick box */}
      <div style={{
        width: 14,
        height: 14,
        border: `1.5px solid ${COLORS.navy}`,
        backgroundColor: '#fff',
        flexShrink: 0,
      }} />
      {/* Squad number */}
      <span style={{
        width: 24,
        fontSize: 12,
        fontWeight: 700,
        color: COLORS.navy,
        textAlign: 'right',
      }}>
        {player.squadNo}
      </span>
      {/* Name */}
      <span style={{
        fontSize: 11,
        color: COLORS.black,
        flex: 1,
      }}>
        {player.firstName} {player.lastName}
      </span>
    </div>
  );

  const renderPositionSection = (title: string, players: typeof squad) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        backgroundColor: COLORS.navy,
        color: '#fff',
        padding: '4px 10px',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
      }}>
        {title}
      </div>
      {players.map(renderPlayerRow)}
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={{ padding: '24px 32px 80px 32px' }}>
        <PageHeader title="Cwmbran Celtic Squad" subtitle="Tick the players in today's starting lineup" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}>
          {/* Left column */}
          <div>
            {renderPositionSection('Goalkeepers', goalkeepers)}
            {renderPositionSection('Defenders', defenders)}
            {renderPositionSection('Forwards', forwards)}
          </div>

          {/* Right column */}
          <div>
            {renderPositionSection('Midfielders', midfielders)}

            {/* Substitutes section */}
            <div style={{ marginTop: 20 }}>
              <div style={{
                backgroundColor: COLORS.gold,
                color: COLORS.navyDark,
                padding: '4px 10px',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 10,
              }}>
                Substitutes
              </div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                  borderBottom: `1px dotted ${COLORS.border}`,
                }}>
                  <span style={{ fontSize: 11, color: COLORS.gray, width: 20 }}>{i}.</span>
                  <div style={{
                    flex: 1,
                    borderBottom: `1px solid ${COLORS.border}`,
                    height: 16,
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: 50,
          left: 32,
          right: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `2px solid ${COLORS.navy}`,
          paddingTop: 12,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.navy }}>
            MANAGER: Simon Berry
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.yellow, fontStyle: 'italic' }}>
            #UpTheCeltic
          </span>
        </div>
      </div>
      <SponsorFooter />
    </div>
  );
}

// Page 4: Today's Match - Team sheets with blank lines for away team
function TodaysMatchPage({ opposition }: { opposition: OppositionTeam }) {
  return (
    <div style={pageStyle}>
      <div style={{ padding: '24px 32px 80px 32px' }}>
        <PageHeader title="Today's Match" subtitle="Team Sheets" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}>
          {/* Home team - Cwmbran Celtic */}
          <div style={{
            border: `2px solid ${COLORS.navy}`,
            backgroundColor: '#fff',
          }}>
            <div style={{
              backgroundColor: COLORS.navy,
              color: '#fff',
              padding: '10px 16px',
              textAlign: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
                Cwmbran Celtic
              </h3>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{
                fontSize: 10,
                color: COLORS.gray,
                margin: '0 0 10px 0',
                fontStyle: 'italic',
              }}>
                Starting XI
              </p>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: `1px dotted ${COLORS.border}`,
                }}>
                  <span style={{
                    width: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.navy,
                  }}>
                    {i}.
                  </span>
                  <div style={{
                    flex: 1,
                    borderBottom: `1px solid ${COLORS.lightGray}`,
                    height: 14,
                  }} />
                </div>
              ))}

              <p style={{
                fontSize: 10,
                color: COLORS.gray,
                margin: '16px 0 8px 0',
                fontStyle: 'italic',
              }}>
                Substitutes
              </p>
              {[12, 13, 14, 15, 16].map(i => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 0',
                  borderBottom: `1px dotted ${COLORS.border}`,
                }}>
                  <span style={{
                    width: 20,
                    fontSize: 10,
                    color: COLORS.gray,
                  }}>
                    {i}.
                  </span>
                  <div style={{
                    flex: 1,
                    borderBottom: `1px solid ${COLORS.lightGray}`,
                    height: 12,
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Away team */}
          <div style={{
            border: `2px solid ${COLORS.gray}`,
            backgroundColor: '#fff',
          }}>
            <div style={{
              backgroundColor: COLORS.gray,
              color: '#fff',
              padding: '10px 16px',
              textAlign: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
                {opposition.name}
              </h3>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{
                fontSize: 10,
                color: COLORS.gray,
                margin: '0 0 10px 0',
                fontStyle: 'italic',
              }}>
                Starting XI
              </p>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: `1px dotted ${COLORS.border}`,
                }}>
                  <span style={{
                    width: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.gray,
                  }}>
                    {i}.
                  </span>
                  <div style={{
                    flex: 1,
                    borderBottom: `1px solid ${COLORS.lightGray}`,
                    height: 14,
                  }} />
                </div>
              ))}

              <p style={{
                fontSize: 10,
                color: COLORS.gray,
                margin: '16px 0 8px 0',
                fontStyle: 'italic',
              }}>
                Substitutes
              </p>
              {[12, 13, 14, 15, 16].map(i => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 0',
                  borderBottom: `1px dotted ${COLORS.border}`,
                }}>
                  <span style={{
                    width: 20,
                    fontSize: 10,
                    color: COLORS.gray,
                  }}>
                    {i}.
                  </span>
                  <div style={{
                    flex: 1,
                    borderBottom: `1px solid ${COLORS.lightGray}`,
                    height: 12,
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Match Officials */}
        <div style={{
          marginTop: 24,
          backgroundColor: COLORS.lightGray,
          border: `1px solid ${COLORS.border}`,
          padding: 16,
        }}>
          <h4 style={{
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.navy,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
          }}>
            Match Officials
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 10, color: COLORS.gray, margin: '0 0 4px 0' }}>Referee</p>
              <div style={{
                borderBottom: `1px solid ${COLORS.border}`,
                height: 16,
                backgroundColor: '#fff',
              }} />
            </div>
            <div>
              <p style={{ fontSize: 10, color: COLORS.gray, margin: '0 0 4px 0' }}>Assistant Referee 1</p>
              <div style={{
                borderBottom: `1px solid ${COLORS.border}`,
                height: 16,
                backgroundColor: '#fff',
              }} />
            </div>
            <div>
              <p style={{ fontSize: 10, color: COLORS.gray, margin: '0 0 4px 0' }}>Assistant Referee 2</p>
              <div style={{
                borderBottom: `1px solid ${COLORS.border}`,
                height: 16,
                backgroundColor: '#fff',
              }} />
            </div>
          </div>
        </div>
      </div>
      <SponsorFooter />
    </div>
  );
}

// Page 5: Club History
function ClubHistoryPage() {
  return (
    <div style={pageStyle}>
      <div style={{ padding: '24px 32px 60px 32px' }}>
        <PageHeader title="Our History" subtitle="100 Years of Cwmbran Celtic" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Timeline entries */}
          {[
            { year: '1925', title: 'The Beginning', text: 'Cwmbran Celtic AFC was founded in 1925, establishing itself as a cornerstone of the local footballing community. The club was formed by a group of passionate locals who wanted to bring organised football to the Cwmbran area.' },
            { year: '1940s', title: 'Post-War Era', text: 'After the Second World War, the club reformed and began competing in local leagues, building a reputation for competitive football and strong community ties.' },
            { year: '2000s', title: 'Modern Era', text: 'The club progressed through the Welsh football pyramid, achieving promotion to the Cymru South league. Investment in facilities saw the development of Celtic Park.' },
            { year: 'NOW', title: 'Looking Forward', text: 'Today, Cwmbran Celtic fields men\'s, women\'s, and youth teams. The club continues to develop local talent while competing at a high level in Welsh football.' },
          ].map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: 16,
            }}>
              <div style={{
                width: 60,
                height: 60,
                backgroundColor: COLORS.navy,
                color: COLORS.yellow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {item.year}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.navy,
                  margin: '0 0 6px 0',
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: COLORS.black,
                  margin: 0,
                }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote banner */}
        <div style={{
          marginTop: 24,
          backgroundColor: COLORS.yellow,
          padding: '16px 24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 16,
            fontStyle: 'italic',
            fontWeight: 600,
            color: COLORS.navyDark,
            margin: 0,
          }}>
            "Building on a century of tradition, looking forward to the next hundred years"
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {[
            { value: '101', label: 'YEARS' },
            { value: '3', label: 'TEAMS' },
            { value: 'Tier 3', label: 'LEVEL' },
            { value: '1', label: 'COMMUNITY' },
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: COLORS.navy,
              padding: '12px 8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.yellow }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 9, color: '#fff', letterSpacing: 1 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SponsorFooter />
    </div>
  );
}

// Page 6: Today's Visitors
function VisitorsPage({ opposition }: { opposition: OppositionTeam }) {
  return (
    <div style={pageStyle}>
      <div style={{ padding: '24px 32px 60px 32px' }}>
        <PageHeader title="Today's Visitors" subtitle={opposition.name} />

        {/* Club info cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 24,
        }}>
          {/* Club Info */}
          <div style={{
            backgroundColor: '#fff',
            border: `1px solid ${COLORS.border}`,
            padding: 20,
          }}>
            <h4 style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.navy,
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              borderBottom: `2px solid ${COLORS.yellow}`,
              paddingBottom: 8,
            }}>
              Club Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <span style={{ fontSize: 10, color: COLORS.gray }}>Founded</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.black, margin: '2px 0 0 0' }}>
                  {opposition.founded}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 10, color: COLORS.gray }}>Ground</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.black, margin: '2px 0 0 0' }}>
                  {opposition.ground}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 10, color: COLORS.gray }}>Colours</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.black, margin: '2px 0 0 0' }}>
                  {opposition.colours}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 10, color: COLORS.gray }}>Nickname</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.black, margin: '2px 0 0 0' }}>
                  {opposition.nickname || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Head to Head */}
          <div style={{
            backgroundColor: '#fff',
            border: `1px solid ${COLORS.border}`,
            padding: 20,
          }}>
            <h4 style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.navy,
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              borderBottom: `2px solid ${COLORS.yellow}`,
              paddingBottom: 8,
            }}>
              Head to Head
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              textAlign: 'center',
            }}>
              <div style={{
                backgroundColor: COLORS.navy,
                padding: '12px 8px',
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.yellow }}>
                  {opposition.headToHead?.celticWins || 0}
                </div>
                <div style={{ fontSize: 9, color: '#fff' }}>CELTIC WINS</div>
              </div>
              <div style={{
                backgroundColor: COLORS.lightGray,
                padding: '12px 8px',
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.black }}>
                  {opposition.headToHead?.draws || 0}
                </div>
                <div style={{ fontSize: 9, color: COLORS.gray }}>DRAWS</div>
              </div>
              <div style={{
                backgroundColor: COLORS.gray,
                padding: '12px 8px',
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                  {opposition.headToHead?.oppositionWins || 0}
                </div>
                <div style={{ fontSize: 9, color: '#ddd' }}>THEIR WINS</div>
              </div>
            </div>
          </div>
        </div>

        {/* About Cwmbran Celtic */}
        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${COLORS.border}`,
          padding: 20,
          marginBottom: 24,
        }}>
          <h4 style={{
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.navy,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
          }}>
            About Cwmbran Celtic
          </h4>
          <p style={{
            fontSize: 11,
            lineHeight: 1.7,
            color: COLORS.black,
            margin: 0,
          }}>
            Cwmbran Celtic AFC, founded in 1925, is one of the most established football clubs in South Wales.
            Playing at the Avondale Motor Park Arena, the club competes in the JD Cymru South league and has a
            proud history of developing local talent. With men's, women's, and youth teams, Celtic is at the
            heart of the Cwmbran community.
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}>
          <div style={{
            backgroundColor: COLORS.navy,
            padding: '16px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.yellow }}>1925</div>
            <div style={{ fontSize: 10, color: '#fff', letterSpacing: 1 }}>FOUNDED</div>
          </div>
          <div style={{
            backgroundColor: COLORS.navy,
            padding: '16px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.yellow }}>3</div>
            <div style={{ fontSize: 10, color: '#fff', letterSpacing: 1 }}>TEAMS</div>
          </div>
          <div style={{
            backgroundColor: COLORS.navy,
            padding: '16px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.yellow }}>Tier 3</div>
            <div style={{ fontSize: 10, color: '#fff', letterSpacing: 1 }}>LEAGUE LEVEL</div>
          </div>
        </div>
      </div>
      <SponsorFooter />
    </div>
  );
}

// Page 7: League Table
function LeagueTablePage({ opposition }: { opposition: OppositionTeam }) {
  const table = mockLeagueTable.results;

  return (
    <div style={pageStyle}>
      <div style={{ padding: '24px 32px 80px 32px' }}>
        <PageHeader title="JD Cymru South Table" />

        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 40px 40px 40px 40px 50px 50px',
            backgroundColor: COLORS.yellow,
            padding: '8px 12px',
            fontSize: 10,
            fontWeight: 700,
            color: COLORS.navyDark,
          }}>
            <span>Pos</span>
            <span>Club</span>
            <span style={{ textAlign: 'center' }}>P</span>
            <span style={{ textAlign: 'center' }}>W</span>
            <span style={{ textAlign: 'center' }}>D</span>
            <span style={{ textAlign: 'center' }}>L</span>
            <span style={{ textAlign: 'center' }}>GD</span>
            <span style={{ textAlign: 'center' }}>Pts</span>
          </div>

          {/* Table rows */}
          {table.map((team, index) => {
            const isCeltic = team.club === 'Cwmbran Celtic';
            const isOpposition = team.club === opposition.name;

            return (
              <div key={team.club} style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 40px 40px 40px 40px 50px 50px',
                padding: '6px 12px',
                fontSize: 10,
                backgroundColor: index % 2 === 0 ? '#fff' : COLORS.cream,
                borderLeft: isCeltic ? `3px solid ${COLORS.navy}` : isOpposition ? `3px solid ${COLORS.gold}` : 'none',
              }}>
                <span style={{ fontWeight: 600, color: COLORS.navy }}>{team.position}</span>
                <span style={{
                  fontWeight: isCeltic || isOpposition ? 700 : 400,
                  color: isCeltic ? COLORS.navy : isOpposition ? COLORS.gold : COLORS.black,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  {team.club}
                  {isCeltic && <span style={{ width: 6, height: 6, backgroundColor: COLORS.navy, borderRadius: '50%' }} />}
                  {isOpposition && <span style={{ width: 6, height: 6, backgroundColor: COLORS.gold, borderRadius: '50%' }} />}
                </span>
                <span style={{ textAlign: 'center' }}>{team.played}</span>
                <span style={{ textAlign: 'center' }}>{team.won}</span>
                <span style={{ textAlign: 'center' }}>{team.drawn}</span>
                <span style={{ textAlign: 'center' }}>{team.lost}</span>
                <span style={{ textAlign: 'center', color: team.gd > 0 ? '#16a34a' : team.gd < 0 ? '#dc2626' : COLORS.black }}>
                  {team.gd > 0 ? '+' : ''}{team.gd}
                </span>
                <span style={{ textAlign: 'center', fontWeight: 700, color: COLORS.navy }}>{team.points}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 16,
          display: 'flex',
          gap: 24,
          fontSize: 10,
          color: COLORS.gray,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, backgroundColor: COLORS.navy, borderRadius: '50%' }} />
            <span>Cwmbran Celtic</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, backgroundColor: COLORS.gold, borderRadius: '50%' }} />
            <span>{opposition.name}</span>
          </div>
          <span style={{ marginLeft: 'auto' }}>
            Table as of January 2026
          </span>
        </div>
      </div>
      <SponsorFooter />
    </div>
  );
}

// Page 8: Results & Fixtures
function ResultsFixturesPage() {
  const results = mockResults.results.slice(0, 5);
  const fixtures = mockFixtures.results
    .filter(f => f.homeTeam.includes('Cwmbran Celtic') || f.awayTeam.includes('Cwmbran Celtic'))
    .slice(0, 5);

  return (
    <div style={pageStyle}>
      <div style={{ padding: '24px 32px 60px 32px' }}>
        {/* Action photo placeholder */}
        <div style={{
          height: 180,
          backgroundColor: COLORS.lightGray,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${COLORS.border}`,
        }}>
          <span style={{ color: COLORS.gray, fontSize: 12 }}>Action Photo</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}>
          {/* Recent Results */}
          <div>
            <div style={{
              backgroundColor: COLORS.navy,
              color: '#fff',
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Recent Results
            </div>
            {results.map((result, index) => {
              const isCelticHome = result.homeTeam.includes('Cwmbran Celtic');
              const celticScore = isCelticHome ? result.homeScore : result.awayScore;
              const oppScore = isCelticHome ? result.awayScore : result.homeScore;
              const opponent = isCelticHome ? result.awayTeam : result.homeTeam;
              const resultType = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';

              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                  borderBottom: `1px solid ${COLORS.lightGray}`,
                  fontSize: 10,
                }}>
                  <span style={{
                    width: 20,
                    height: 20,
                    backgroundColor: resultType === 'W' ? '#16a34a' : resultType === 'L' ? '#dc2626' : COLORS.gray,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 9,
                  }}>
                    {resultType}
                  </span>
                  <span style={{ flex: 1 }}>{opponent}</span>
                  <span style={{ fontWeight: 700, color: COLORS.navy }}>
                    {celticScore}-{oppScore}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Upcoming Fixtures */}
          <div>
            <div style={{
              backgroundColor: COLORS.gold,
              color: COLORS.navyDark,
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Up Next
            </div>
            {fixtures.map((fixture, index) => {
              const isCelticHome = fixture.homeTeam.includes('Cwmbran Celtic');
              const opponent = isCelticHome ? fixture.awayTeam : fixture.homeTeam;
              const venue = isCelticHome ? 'H' : 'A';
              const date = fromCometDate(fixture.date);

              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                  borderBottom: `1px solid ${COLORS.lightGray}`,
                  fontSize: 10,
                }}>
                  <span style={{ flex: 1 }}>{opponent}</span>
                  <span style={{
                    fontSize: 9,
                    color: venue === 'H' ? COLORS.navy : COLORS.gray,
                    fontWeight: 600,
                  }}>
                    ({venue})
                  </span>
                  <span style={{
                    backgroundColor: COLORS.navy,
                    color: '#fff',
                    padding: '2px 6px',
                    fontSize: 8,
                  }}>
                    {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <SponsorFooter />
    </div>
  );
}

// Page 9: Celtic Bond
function CelticBondPage() {
  return (
    <div style={{ ...pageStyle, backgroundColor: COLORS.yellow }}>
      <div style={{ padding: '32px 40px' }}>
        {/* Header badge */}
        <div style={{
          display: 'inline-block',
          backgroundColor: COLORS.navy,
          color: '#fff',
          padding: '6px 16px',
          fontSize: 10,
          fontWeight: 600,
          marginBottom: 16,
        }}>
          SUPPORT YOUR CLUB
        </div>

        <h2 style={{
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.navyDark,
          margin: '0 0 8px 0',
          letterSpacing: 2,
        }}>
          CELTIC BOND
        </h2>
        <p style={{
          fontSize: 18,
          color: COLORS.navy,
          margin: '0 0 24px 0',
          fontStyle: 'italic',
        }}>
          Help Build Our Future
        </p>

        {/* Explanation card */}
        <div style={{
          backgroundColor: '#fff',
          padding: 20,
          marginBottom: 24,
          border: `2px solid ${COLORS.navy}`,
        }}>
          <p style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: COLORS.black,
            margin: 0,
          }}>
            The Celtic Bond is our monthly lottery supporting club development. For just £5 per month,
            you could win cash prizes while directly contributing to youth development, facility
            improvements, and community programmes.
          </p>
        </div>

        {/* Prize boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}>
          {[
            { amount: '£100', label: 'First Prize' },
            { amount: '£50', label: 'Second Prize' },
            { amount: '£25', label: 'Third Prize' },
          ].map((prize, index) => (
            <div key={index} style={{
              backgroundColor: COLORS.navyDark,
              padding: '20px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.yellow }}>
                {prize.amount}
              </div>
              <div style={{ fontSize: 10, color: '#fff' }}>
                {prize.label}
              </div>
            </div>
          ))}
        </div>

        {/* What your support funds */}
        <div style={{
          backgroundColor: '#fff',
          padding: 16,
          marginBottom: 24,
          border: `1px solid ${COLORS.border}`,
        }}>
          <h4 style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.navy,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
          }}>
            Your Support Helps Fund:
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            fontSize: 11,
          }}>
            {['Youth Academy Development', 'Kit & Equipment', 'Facility Improvements', 'Community Programmes'].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: COLORS.navy, fontWeight: 700 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to join */}
        <div style={{
          backgroundColor: COLORS.navy,
          padding: 20,
          color: '#fff',
        }}>
          <h4 style={{
            fontSize: 12,
            fontWeight: 700,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
          }}>
            How to Join
          </h4>
          <p style={{
            fontSize: 11,
            lineHeight: 1.6,
            margin: 0,
          }}>
            Speak to a committee member on match day or visit our website at cwmbranceltic.com
            to sign up. Monthly payments can be made via standing order or direct debit.
          </p>
        </div>

        {/* Footer message */}
        <p style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 14,
          fontStyle: 'italic',
          color: COLORS.navyDark,
        }}>
          Thank you for being part of the Celtic family!
        </p>
      </div>
    </div>
  );
}

// Page 10: Back Cover
function BackCoverPage() {
  return (
    <div style={{
      ...pageStyle,
      background: `linear-gradient(180deg, ${COLORS.navyDark} 0%, ${COLORS.navy} 100%)`,
      pageBreakAfter: 'avoid',
    }}>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 48px',
      }}>
        {/* Club crest area */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
        }}>
          <div style={{
            width: 120,
            height: 120,
            margin: '0 auto 20px',
            position: 'relative',
          }}>
            <Image
              src="/images/club-logo.webp"
              alt="Cwmbran Celtic"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h2 style={{
            fontSize: 28,
            fontWeight: 800,
            color: COLORS.yellow,
            margin: 0,
            letterSpacing: 2,
          }}>
            CWMBRAN CELTIC AFC
          </h2>
          <p style={{
            fontSize: 12,
            color: '#fff',
            margin: '8px 0 0 0',
            fontStyle: 'italic',
            opacity: 0.8,
          }}>
            Established 1925
          </p>
        </div>

        {/* Info columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          flex: 1,
        }}>
          {/* Our Ground */}
          <div>
            <h4 style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.yellow,
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              borderBottom: `2px solid ${COLORS.yellow}`,
              paddingBottom: 8,
            }}>
              Our Ground
            </h4>
            <div style={{ fontSize: 12, color: '#fff', lineHeight: 1.8 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {clubInfo.ground.name}
              </p>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
                {clubInfo.ground.address.street}<br />
                {clubInfo.ground.address.town}<br />
                {clubInfo.ground.address.county}<br />
                {clubInfo.ground.address.postcode}
              </p>
            </div>
          </div>

          {/* Admission & Social */}
          <div>
            <h4 style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.yellow,
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              borderBottom: `2px solid ${COLORS.yellow}`,
              paddingBottom: 8,
            }}>
              Admission Prices
            </h4>
            <div style={{ fontSize: 11, color: '#fff', lineHeight: 2 }}>
              <p style={{ margin: 0 }}>Adults: £{clubInfo.admission.adults}</p>
              <p style={{ margin: 0 }}>Concessions: £{clubInfo.admission.concessions}</p>
              <p style={{ margin: 0 }}>Under 16s: FREE</p>
              <p style={{ margin: 0 }}>Programme: £{clubInfo.admission.programme}</p>
            </div>

            <h4 style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.yellow,
              margin: '24px 0 12px 0',
              textTransform: 'uppercase',
            }}>
              Follow Us
            </h4>
            <div style={{ fontSize: 11, color: '#fff', lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>@cwmbranceltic</p>
              <p style={{ margin: '4px 0 0 0' }}>cwmbranceltic.com</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          borderTop: `1px solid rgba(255,255,255,0.2)`,
          paddingTop: 20,
        }}>
          <p style={{
            fontSize: 11,
            color: '#fff',
            margin: 0,
            opacity: 0.8,
          }}>
            Thank you for supporting Cwmbran Celtic AFC
          </p>
          <p style={{
            fontSize: 16,
            fontWeight: 700,
            color: COLORS.yellow,
            margin: '8px 0 0 0',
            fontStyle: 'italic',
          }}>
            #UpTheCeltic
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PrintProgrammePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [programmeData, setProgrammeData] = useState<ProgrammeData | null>(null);
  const [opposition, setOpposition] = useState<OppositionTeam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    if (slug) {
      // First try localStorage (for when user previews from admin)
      if (typeof window !== 'undefined') {
        const programmeKey = `programme-${slug}`;
        const stored = localStorage.getItem(programmeKey);
        if (stored) {
          const data = JSON.parse(stored);
          setProgrammeData(data);
          const opp = getOppositionById(data.opponent);
          setOpposition(opp || null);
          setLoading(false);
          return;
        }
      }

      // Fallback: parse the slug directly for Puppeteer/direct access
      const parsed = parseSlug(slug);
      if (parsed) {
        const kickoff = searchParams.get('kickoff') || '15:00';
        const competition = searchParams.get('competition') || 'JD Cymru South';
        const coverImage = searchParams.get('coverImage') || undefined;
        const uploadedCover = searchParams.get('uploadedCover') || undefined;

        const data: ProgrammeData = {
          opponent: parsed.opponent,
          date: parsed.date,
          kickoff,
          competition,
          coverImage,
          uploadedCover,
        };
        setProgrammeData(data);
        const opp = getOppositionById(parsed.opponent);
        setOpposition(opp || null);
      }
      setLoading(false);
    }
  }, [params.slug, searchParams]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (!programmeData || !opposition) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Programme not found</div>;
  }

  return (
    <div style={{
      backgroundColor: '#333',
      minHeight: '100vh',
      padding: 20,
    }}>
      {/* Page 1: Cover */}
      <CoverPage
        uploadedCover={programmeData.uploadedCover}
        opposition={opposition}
        date={programmeData.date}
        kickoff={programmeData.kickoff}
        coverImage={programmeData.coverImage}
        forPrint={true}
      />

      {/* Page 2: Manager's Notes */}
      <ManagersNotesPage programmeData={programmeData} />

      {/* Page 3: Squad Page */}
      <SquadPage />

      {/* Page 4: Today's Match */}
      <TodaysMatchPage opposition={opposition} />

      {/* Page 5: Club History */}
      <ClubHistoryPage />

      {/* Page 6: Today's Visitors */}
      <VisitorsPage opposition={opposition} />

      {/* Page 7: League Table */}
      <LeagueTablePage opposition={opposition} />

      {/* Page 8: Results & Fixtures */}
      <ResultsFixturesPage />

      {/* Page 9: Celtic Bond */}
      <CelticBondPage />

      {/* Page 10: Back Cover */}
      <BackCoverPage />
    </div>
  );
}
