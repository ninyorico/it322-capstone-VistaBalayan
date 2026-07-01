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

   return (
    <div className="min-h-screen bg-gray-50">
      {/*Hero Section and Search Bar*/}
      <div className="relative bg-gradient-to-r from-[#0F4C75] via-[#1293B8] to-[#1CA7C9] text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Balayan, Batangas
          </h1>

          <p className="text-xl md:text-2xl mb-8">
            Explore the best tourist establishments in our municipality
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, location, or description..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/*Category Filter Buttons*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedType(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  selectedType === cat.id
                    ? 'bg-[#1CA7C9] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

 main
