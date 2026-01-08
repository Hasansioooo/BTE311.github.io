import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import footballApi from '../services/footballApi';

const MatchDetailScreen = ({ route }) => {
  const { matchId } = route.params;
  const [match, setMatch] = useState(null);
  const [homeTeamPlayers, setHomeTeamPlayers] = useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMatchDetails();
  }, [matchId]);

  const loadMatchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const matchData = await footballApi.getMatchDetails(matchId);
      setMatch(matchData);

      if (matchData.homeTeam?.id) {
        try {
          const homePlayers = await footballApi.getTeamPlayers(matchData.homeTeam.id);
          setHomeTeamPlayers(homePlayers);
        } catch (err) {
          console.warn('Ev sahibi takım oyuncuları yüklenemedi:', err);
        }
      }

      if (matchData.awayTeam?.id) {
        try {
          const awayPlayers = await footballApi.getTeamPlayers(matchData.awayTeam.id);
          setAwayTeamPlayers(awayPlayers);
        } catch (err) {
          console.warn('Deplasman takım oyuncuları yüklenemedi:', err);
        }
      }
    } catch (err) {
      setError('Maç detayları yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'SCHEDULED': { text: 'Planlandı', icon: '📅', color: '#3498db' },
      'LIVE': { text: 'CANLI', icon: '🔴', color: '#e74c3c' },
      'IN_PLAY': { text: 'OYNANIYOR', icon: '⚽', color: '#e74c3c' },
      'PAUSED': { text: 'Devre Arası', icon: '⏸️', color: '#f39c12' },
      'FINISHED': { text: 'Bitti', icon: '✅', color: '#27ae60' },
      'POSTPONED': { text: 'Ertelendi', icon: '⏳', color: '#95a5a6' },
      'SUSPENDED': { text: 'Askıya Alındı', icon: '⚠️', color: '#e67e22' },
      'CANCELED': { text: 'İptal', icon: '❌', color: '#c0392b' },
    };
    return statusMap[status] || { text: status, icon: '⚽', color: '#95a5a6' };
  };

  const getPositionIcon = (position) => {
    const icons = {
      'Goalkeeper': '🧤',
      'Defence': '🛡️',
      'Defender': '🛡️',
      'Midfield': '⚙️',
      'Midfielder': '⚙️',
      'Offence': '⚡',
      'Forward': '⚡',
      'Attacker': '⚡',
    };
    return icons[position] || '👤';
  };

  const renderPlayers = (players, teamName, isHome) => {
    if (!players || players.length === 0) {
      return (
        <View style={styles.noPlayersContainer}>
          <Text style={styles.noPlayersIcon}>👥</Text>
          <Text style={styles.noPlayersText}>Oyuncu bilgisi bulunamadı</Text>
        </View>
      );
    }

    // Pozisyona göre grupla
    const grouped = {
      'Goalkeeper': [],
      'Defence': [],
      'Midfield': [],
      'Offence': [],
      'Other': [],
    };

    players.forEach(player => {
      const pos = player.position;
      if (pos === 'Goalkeeper') grouped['Goalkeeper'].push(player);
      else if (pos === 'Defence' || pos === 'Defender') grouped['Defence'].push(player);
      else if (pos === 'Midfield' || pos === 'Midfielder') grouped['Midfield'].push(player);
      else if (pos === 'Offence' || pos === 'Forward' || pos === 'Attacker') grouped['Offence'].push(player);
      else grouped['Other'].push(player);
    });

    return (
      <View style={[styles.playersSection, isHome ? styles.playersSectionHome : styles.playersSectionAway]}>
        <View style={styles.playersSectionHeader}>
          <Text style={styles.playersSectionIcon}>{isHome ? '🏠' : '✈️'}</Text>
          <Text style={styles.playersSectionTitle}>{teamName} Kadrosu</Text>
        </View>
        
        {Object.entries(grouped).map(([position, posPlayers]) => {
          if (posPlayers.length === 0) return null;
          const positionLabels = {
            'Goalkeeper': '🧤 Kaleciler',
            'Defence': '🛡️ Defans',
            'Midfield': '⚙️ Orta Saha',
            'Offence': '⚡ Forvet',
            'Other': '👤 Diğer',
          };
          return (
            <View key={position} style={styles.positionGroup}>
              <Text style={styles.positionTitle}>{positionLabels[position]}</Text>
              <View style={styles.playersGrid}>
                {posPlayers.map((player) => (
                  <View key={player.id} style={styles.playerCard}>
                    <Text style={styles.playerIcon}>{getPositionIcon(player.position)}</Text>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      {player.nationality && (
                        <Text style={styles.playerNationality}>🌍 {player.nationality}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingIcon}>⚽</Text>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Maç Detayları Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error || 'Maç bulunamadı'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMatchDetails}>
            <Text style={styles.retryButtonText}>🔄 Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusInfo = getStatusInfo(match.status);
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY';

  return (
    <View style={{flex: 1, backgroundColor: '#111111', minHeight: '100vh'}}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Match Card */}
        <View style={[styles.matchCard, isLive && styles.matchCardLive]}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>

        {/* Date & Time */}
        <View style={styles.dateTimeSection}>
          <Text style={styles.matchDate}>📅 {formatDate(match.utcDate)}</Text>
          <Text style={styles.matchTime}>⏰ {formatTime(match.utcDate)}</Text>
        </View>

        {/* Teams & Score */}
        <View style={styles.teamsSection}>
          {/* Home Team */}
          <View style={styles.teamBox}>
            <View style={styles.teamBadge}>
              <Text style={styles.teamBadgeIcon}>🏠</Text>
            </View>
            <Text style={styles.teamName}>{match.homeTeam?.name || 'TBA'}</Text>
            <Text style={styles.teamLabel}>Ev Sahibi</Text>
          </View>

          {/* Score */}
          <View style={styles.scoreBox}>
            {match.score?.fullTime?.home !== null && match.score?.fullTime?.home !== undefined ? (
              <>
                <View style={styles.scoreNumbers}>
                  <Text style={[styles.scoreMain, isLive && styles.scoreLive]}>
                    {match.score.fullTime.home}
                  </Text>
                  <Text style={styles.scoreSeparator}>-</Text>
                  <Text style={[styles.scoreMain, isLive && styles.scoreLive]}>
                    {match.score.fullTime.away}
                  </Text>
                </View>
                <Text style={styles.scoreLabel}>Maç Sonucu</Text>
              </>
            ) : (
              <>
                <Text style={styles.vsIcon}>⚽</Text>
                <Text style={styles.vsText}>VS</Text>
              </>
            )}
          </View>

          {/* Away Team */}
          <View style={styles.teamBox}>
            <View style={styles.teamBadge}>
              <Text style={styles.teamBadgeIcon}>✈️</Text>
            </View>
            <Text style={styles.teamName}>{match.awayTeam?.name || 'TBA'}</Text>
            <Text style={styles.teamLabel}>Deplasman</Text>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.matchInfoSection}>
          {match.matchday && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🏆</Text>
              <Text style={styles.infoText}>Hafta {match.matchday}</Text>
            </View>
          )}
          {match.venue && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🏟️</Text>
              <Text style={styles.infoText}>{match.venue}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Score Details */}
      {match.score && (match.score.halfTime || match.score.extraTime || match.score.penalties) && (
        <View style={styles.scoreDetailsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>Skor Detayları</Text>
          </View>
          
          {match.score.halfTime && (
            <View style={styles.scoreRow}>
              <Text style={styles.scoreRowIcon}>⏱️</Text>
              <Text style={styles.scoreRowLabel}>İlk Yarı</Text>
              <Text style={styles.scoreRowValue}>
                {match.score.halfTime.home} - {match.score.halfTime.away}
              </Text>
            </View>
          )}

          {match.score.fullTime && (
            <View style={styles.scoreRow}>
              <Text style={styles.scoreRowIcon}>⚽</Text>
              <Text style={styles.scoreRowLabel}>Maç Sonucu</Text>
              <Text style={styles.scoreRowValue}>
                {match.score.fullTime.home} - {match.score.fullTime.away}
              </Text>
            </View>
          )}

          {match.score.extraTime && (
            <View style={styles.scoreRow}>
              <Text style={styles.scoreRowIcon}>⏰</Text>
              <Text style={styles.scoreRowLabel}>Uzatmalar</Text>
              <Text style={styles.scoreRowValue}>
                {match.score.extraTime.home} - {match.score.extraTime.away}
              </Text>
            </View>
          )}

          {match.score.penalties && (
            <View style={styles.scoreRow}>
              <Text style={styles.scoreRowIcon}>🥅</Text>
              <Text style={styles.scoreRowLabel}>Penaltılar</Text>
              <Text style={styles.scoreRowValue}>
                {match.score.penalties.home} - {match.score.penalties.away}
              </Text>
            </View>
          )}
        </View>
      )}

        {/* Players */}
        {renderPlayers(homeTeamPlayers, match.homeTeam?.name || 'Ev Sahibi', true)}
        {renderPlayers(awayTeamPlayers, match.awayTeam?.name || 'Deplasman', false)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#111111',
  },
  loadingContainer: {
    flex: 1,
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111111',
  },
  loadingCard: {
    backgroundColor: '#1A472A',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  errorCard: {
    backgroundColor: '#7D1A1A',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  matchCard: {
    backgroundColor: '#1A472A',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  matchCardLive: {
    borderColor: '#e74c3c',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  dateTimeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  matchDate: {
    fontSize: 16,
    color: '#81C784',
    fontWeight: '600',
  },
  matchTime: {
    fontSize: 14,
    color: 'rgba(129, 199, 132, 0.7)',
    marginTop: 4,
  },
  teamsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
  },
  teamBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamBadgeIcon: {
    fontSize: 32,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamLabel: {
    fontSize: 11,
    color: '#81C784',
  },
  scoreBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scoreNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreMain: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFD700',
  },
  scoreLive: {
    color: '#e74c3c',
  },
  scoreSeparator: {
    fontSize: 36,
    color: '#81C784',
    marginHorizontal: 12,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#81C784',
    marginTop: 8,
  },
  vsIcon: {
    fontSize: 40,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#81C784',
    marginTop: 8,
  },
  matchInfoSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 175, 80, 0.3)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#A5D6A7',
  },
  scoreDetailsCard: {
    backgroundColor: '#1A472A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.3)',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.2)',
  },
  scoreRowIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  scoreRowLabel: {
    fontSize: 14,
    color: '#81C784',
    flex: 1,
  },
  scoreRowValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  playersSection: {
    backgroundColor: '#1A472A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  playersSectionHome: {
    borderColor: '#4CAF50',
  },
  playersSectionAway: {
    borderColor: '#2196F3',
  },
  playersSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.3)',
  },
  playersSectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  playersSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  positionGroup: {
    marginBottom: 16,
  },
  positionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#81C784',
    marginBottom: 12,
  },
  playersGrid: {
    gap: 8,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  playerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  playerNationality: {
    fontSize: 12,
    color: '#81C784',
    marginTop: 2,
  },
  noPlayersContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#1A472A',
    borderRadius: 16,
    marginBottom: 16,
  },
  noPlayersIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  noPlayersText: {
    fontSize: 14,
    color: '#81C784',
  },
});

export default MatchDetailScreen;
