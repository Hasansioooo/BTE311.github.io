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

const HomeScreen = ({ navigation }) => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await footballApi.getCompetitions();
      
      const popularLeagues = [
        'PL', 'PD', 'SA', 'BL1', 'FL1', 'ELC', 'PPL', 'DED', 'CL', 'EC', 'WC'
      ];
      
      if (!data || !data.competitions) {
        setError('API yanıtı beklenen formatta değil.');
        setCompetitions([]);
        return;
      }
      
      const filtered = data.competitions.filter(comp => 
        popularLeagues.includes(comp.code)
      );
      
      if (filtered.length === 0) {
        setCompetitions(data.competitions.slice(0, 10));
      } else {
        setCompetitions(filtered);
      }
    } catch (err) {
      const errorMessage = err.response 
        ? `API Hatası: ${err.response.status} - ${err.response.statusText}`
        : err.message || 'Ligler yüklenirken bir hata oluştu.';
      setError(errorMessage);
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitionPress = (competition) => {
    navigation.navigate('Matches', { 
      competitionId: competition.id, 
      competitionName: competition.name 
    });
  };

  const getLeagueIcon = (code) => {
    const icons = {
      'PL': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'PD': '🇪🇸',
      'SA': '🇮🇹',
      'BL1': '🇩🇪',
      'FL1': '🇫🇷',
      'CL': '⭐',
      'EC': '🇪🇺',
      'WC': '🌍',
      'PPL': '🇵🇹',
      'DED': '🇳🇱',
      'ELC': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    };
    return icons[code] || '🏆';
  };

  const getLeagueType = (type) => {
    return type === 'CUP' ? '🏆 Turnuva' : '📊 Lig';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingIcon}>⚽</Text>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Ligler Yükleniyor...</Text>
          <Text style={styles.loadingSubtext}>Futbol dünyasına hoş geldiniz</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={loadCompetitions}>
            <Text style={styles.retryButtonText}>🔄 Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#111111', minHeight: '100vh'}}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
        <Text style={styles.heroIcon}>⚽</Text>
        <Text style={styles.heroTitle}>Futbol Merkezi</Text>
        <Text style={styles.heroSubtitle}>Tüm ligler ve maçlar bir arada</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{competitions.length}</Text>
            <Text style={styles.statLabel}>🏆 Lig</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>⚽ Maç</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>👤 Oyuncu</Text>
          </View>
        </View>
      </View>

      {/* Leagues Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🏟️</Text>
        <Text style={styles.sectionTitle}>Popüler Ligler</Text>
      </View>

      {competitions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Lig bulunamadı</Text>
        </View>
      ) : (
        competitions.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.leagueCard, index % 2 === 0 ? styles.leagueCardEven : styles.leagueCardOdd]}
            onPress={() => handleCompetitionPress(item)}
            activeOpacity={0.8}
          >
            <View style={styles.leagueIconContainer}>
              <Text style={styles.leagueIcon}>{getLeagueIcon(item.code)}</Text>
            </View>
            <View style={styles.leagueInfo}>
              <Text style={styles.leagueName}>{item.name}</Text>
              <View style={styles.leagueMeta}>
                {item.area && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>📍 {item.area.name}</Text>
                  </View>
                )}
                <View style={styles.metaItem}>
                  <Text style={styles.metaText}>{getLeagueType(item.type)}</Text>
                </View>
              </View>
              {item.currentSeason && (
                <View style={styles.seasonBadge}>
                  <Text style={styles.seasonText}>
                    📅 {item.currentSeason.startDate?.slice(0, 4)} - {item.currentSeason.endDate?.slice(0, 4)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>▶</Text>
            </View>
          </TouchableOpacity>
        ))
      )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>⚽ Futbol Merkezi - 2024</Text>
          <Text style={styles.footerSubtext}>Powered by Football-Data.org</Text>
        </View>
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
    backgroundColor: '#111111',
    padding: 20,
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
    backgroundColor: 'rgba(183, 28, 28, 0.95)',
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
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  heroIcon: {
    fontSize: 70,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#81C784',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 14,
    color: '#81C784',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#4CAF50',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 8,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#A5D6A7',
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
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A472A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  leagueCardEven: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  leagueCardOdd: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  leagueIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  leagueIcon: {
    fontSize: 30,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  leagueMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    marginRight: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#81C784',
  },
  seasonBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  seasonText: {
    fontSize: 12,
    color: '#A5D6A7',
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 175, 80, 0.3)',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#81C784',
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(129, 199, 132, 0.6)',
    marginTop: 4,
  },
});

export default HomeScreen;
