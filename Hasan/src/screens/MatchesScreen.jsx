import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import footballApi from '../services/footballApi';

const MatchesScreen = ({ route, navigation }) => {
  const { competitionId, competitionName } = route.params;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMatches();
  }, [competitionId]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await footballApi.getMatches(competitionId);
      setMatches(data.matches || []);
    } catch (err) {
      setError('Maçlar yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchPress = (match) => {
    navigation.navigate('MatchDetail', { matchId: match.id });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
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
      'SCHEDULED': { text: 'Planlandı', icon: '📅', color: '#3498db', bg: 'rgba(52, 152, 219, 0.2)' },
      'LIVE': { text: 'CANLI', icon: '🔴', color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.2)' },
      'IN_PLAY': { text: 'OYNANIYYOR', icon: '⚽', color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.2)' },
      'PAUSED': { text: 'Devre Arası', icon: '⏸️', color: '#f39c12', bg: 'rgba(243, 156, 18, 0.2)' },
      'FINISHED': { text: 'Bitti', icon: '✅', color: '#27ae60', bg: 'rgba(39, 174, 96, 0.2)' },
      'POSTPONED': { text: 'Ertelendi', icon: '⏳', color: '#95a5a6', bg: 'rgba(149, 165, 166, 0.2)' },
      'SUSPENDED': { text: 'Askıya Alındı', icon: '⚠️', color: '#e67e22', bg: 'rgba(230, 126, 34, 0.2)' },
      'CANCELED': { text: 'İptal', icon: '❌', color: '#c0392b', bg: 'rgba(192, 57, 43, 0.2)' },
    };
    return statusMap[status] || { text: status, icon: '⚽', color: '#95a5a6', bg: 'rgba(149, 165, 166, 0.2)' };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingIcon}>🏟️</Text>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Maçlar Yükleniyor...</Text>
          <Text style={styles.loadingSubtext}>Skorlar getiriliyor</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMatches}>
            <Text style={styles.retryButtonText}>🔄 Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Maçları duruma göre grupla
  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PLAY');
  const scheduledMatches = matches.filter(m => m.status === 'SCHEDULED');
  const finishedMatches = matches.filter(m => m.status === 'FINISHED');
  const otherMatches = matches.filter(m => 
    !['LIVE', 'IN_PLAY', 'SCHEDULED', 'FINISHED'].includes(m.status)
  );

  const renderMatchCard = (item) => {
    const statusInfo = getStatusInfo(item.status);
    const isLive = item.status === 'LIVE' || item.status === 'IN_PLAY';
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.matchCard, isLive && styles.matchCardLive]}
        onPress={() => handleMatchPress(item)}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.matchHeader}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.matchDate}>📅 {formatDate(item.utcDate)}</Text>
            <Text style={styles.matchTime}>⏰ {formatTime(item.utcDate)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          </View>
        </View>

        {/* Teams */}
        <View style={styles.teamsContainer}>
          {/* Home Team */}
          <View style={styles.teamBox}>
            <View style={styles.teamIconCircle}>
              <Text style={styles.teamIcon}>🏠</Text>
            </View>
            <Text style={styles.teamName} numberOfLines={2}>{item.homeTeam?.name || 'TBA'}</Text>
            {(item.score?.fullTime?.home !== null && item.score?.fullTime?.home !== undefined) && (
              <Text style={[styles.score, isLive && styles.scoreLive]}>{item.score.fullTime.home}</Text>
            )}
          </View>

          {/* VS */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>⚽</Text>
            <Text style={styles.vsLabel}>VS</Text>
          </View>

          {/* Away Team */}
          <View style={styles.teamBox}>
            <View style={styles.teamIconCircle}>
              <Text style={styles.teamIcon}>✈️</Text>
            </View>
            <Text style={styles.teamName} numberOfLines={2}>{item.awayTeam?.name || 'TBA'}</Text>
            {(item.score?.fullTime?.away !== null && item.score?.fullTime?.away !== undefined) && (
              <Text style={[styles.score, isLive && styles.scoreLive]}>{item.score.fullTime.away}</Text>
            )}
          </View>
        </View>

        {/* Footer */}
        {item.matchday && (
          <View style={styles.matchFooter}>
            <Text style={styles.matchday}>🏆 Hafta {item.matchday}</Text>
            <Text style={styles.viewDetails}>Detaylar ▶</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (title, icon, matchList, emptyText) => {
    if (matchList.length === 0) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{icon}</Text>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionCount}>{matchList.length}</Text>
          </View>
        </View>
        {matchList.map(renderMatchCard)}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#0D1B0E', minHeight: '100vh'}}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.heroSection}>
        <Text style={styles.heroIcon}>🏆</Text>
        <Text style={styles.heroTitle}>{competitionName || 'Maçlar'}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{matches.length}</Text>
            <Text style={styles.statLabel}>Toplam Maç</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{liveMatches.length}</Text>
            <Text style={styles.statLabel}>🔴 Canlı</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{finishedMatches.length}</Text>
            <Text style={styles.statLabel}>✅ Biten</Text>
          </View>
        </View>
      </View>

        {matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Bu ligde maç bulunamadı</Text>
          </View>
        ) : (
          <>
            {renderSection('Canlı Maçlar', '🔴', liveMatches)}
            {renderSection('Planlanmış Maçlar', '📅', scheduledMatches)}
            {renderSection('Tamamlanan Maçlar', '✅', finishedMatches)}
            {renderSection('Diğer Maçlar', '📋', otherMatches)}
          </>
        )}
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
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#81C784',
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
  heroSection: {
    backgroundColor: '#1A472A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  heroIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFD700',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#81C784',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#4CAF50',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    backgroundColor: '#1A472A',
    borderRadius: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#81C784',
  },
  matchCard: {
    backgroundColor: '#1A472A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  matchCardLive: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.3)',
  },
  dateTimeContainer: {
    flex: 1,
  },
  matchDate: {
    fontSize: 13,
    color: '#81C784',
    fontWeight: '600',
  },
  matchTime: {
    fontSize: 12,
    color: 'rgba(129, 199, 132, 0.7)',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
  },
  teamIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamIcon: {
    fontSize: 24,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFD700',
  },
  scoreLive: {
    color: '#e74c3c',
  },
  vsContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 24,
  },
  vsLabel: {
    fontSize: 12,
    color: '#81C784',
    fontWeight: '700',
    marginTop: 4,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 175, 80, 0.3)',
  },
  matchday: {
    fontSize: 13,
    color: '#81C784',
  },
  viewDetails: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default MatchesScreen;
