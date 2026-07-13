import { useEffect, useState } from 'react'
import { AlertTriangle, TrendingUp, CheckCircle, Info, Brain, Loader2, RefreshCw } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { geminiService } from '../../../services/geminiService'

interface Anomaly {
  id: string
  anomaly_type: string
  severity: string
  description: string
  recommendation: string
  establishments?: { name: string }
  detected_at: string
  is_resolved: boolean
}

interface Insight {
  id: string
  title: string
  description: string
  impact: string
  category: string
}

export default function AIInsights() {


  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    loadCachedData()
  }, [])

  const loadCachedData = async () => {
    setLoading(true)
    
    try {
      // Load cached anomalies from database
      const { data: anomaliesData } = await supabase
        .from('ai_anomalies_cache')
        .select(`
          *,
          establishments (name)
        `)
        .eq('status', 'active')
        .eq('is_resolved', false)
        .order('detected_at', { ascending: false })

      setAnomalies(anomaliesData || [])

      // Load cached insights from database
      const { data: insightsData } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10)

      setInsights(insightsData || [])

      // Get last update time
      const { data: cacheData } = await supabase
        .from('ai_insights_cache')
        .select('generated_at')
        .eq('insight_type', 'recommendations')
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()

      if (cacheData) {
        setLastUpdated(new Date(cacheData.generated_at).toLocaleString())
      }

      // If no data exists, generate fresh data
      if ((!anomaliesData || anomaliesData.length === 0) && (!insightsData || insightsData.length === 0)) {
        await refreshData()
      }

    } catch (error) {
      console.error('Error loading cached data:', error)
    } finally {
      setLoading(false)
    }
  }

   const refreshData = async () => {
    setRefreshing(true)
    try {
      const { insights: newInsights, anomalies: newAnomalies } = await geminiService.refreshAllData()
      
      // Reload cached data
      await loadCachedData()
      
      console.log(`✅ Data refreshed: ${newInsights?.length || 0} insights, ${newAnomalies?.length || 0} anomalies`)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1CA7C9] mx-auto mb-4" />
          <p className="text-gray-600">Loading AI insights...</p>
        </div>
      </div>
    )
  }

      {/* AI Status Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">AI Analysis Active</h2>
            <p className="text-purple-100">
              Powered by Google Gemini AI 
            </p>
          </div>
        </div>
      </div>



