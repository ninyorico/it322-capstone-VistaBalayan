import { useState, useEffect } from 'react'
import {
  Search,
  MapPin,
  Hotel,
  Utensils,
  Building2,
  TreePine,
  Coffee,
  Loader2,
  Phone,
  Mail,
  Globe,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import React from 'react'

interface Establishment {
  id: string
  name: string
  type: string
  address: string
  contact_number: string
  description: string
  images: string[]
  opening_hours: string
  website_url: string
  email: string
}

export default function TourismHome() {

  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [filtered, setFiltered] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null)

  const categories = [
    { id: 'all', name: 'All', icon: Search },
    { id: 'Resort', name: 'Resorts', icon: Hotel },
    { id: 'Hotel', name: 'Hotels', icon: Building2 },
    { id: 'Inn', name: 'Inns', icon: Coffee },
    { id: 'Food & Beverage Establishment', name: 'Restaurants', icon: Utensils },
    { id: 'Tourist Attraction', name: 'Attractions', icon: TreePine },
  ]

  useEffect(() => {
    fetchEstablishments()
  }, [])

  const fetchEstablishments = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('status', 'active')
      .order('name')

    if (!error && data) {
      setEstablishments(data)
      setFiltered(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    let results = establishments

    if (searchTerm) {
      results = results.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (e.description &&
            e.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedType !== 'all') {
      results = results.filter((e) => e.type === selectedType)
    }

    setFiltered(results)
  }, [searchTerm, selectedType, establishments])

  const getCategoryIcon = (type: string) => {
    const cat = categories.find((c) => c.id === type)
    return cat?.icon || Building2
  }

