'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Tag, Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { Offer } from '@/lib/types'

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [form, setForm] = useState<Partial<Offer>>({
        title: '',
        description: '',
        type: 'bundle',
        active: true,
    })
    const supabase = createClient()

    const fetchOffers = async () => {
        const { data } = await supabase
            .from('offers')
            .select('*')
            .order('created_at', { ascending: false })
        setOffers((data as Offer[]) || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchOffers()
    }, [])

    const toggleActive = async (offerId: string, currentActive: boolean) => {
        const { error } = await supabase
            .from('offers')
            .update({ active: !currentActive })
            .eq('id', offerId)

        if (!error) {
            setOffers((prev) =>
                prev.map((o) => (o.id === offerId ? { ...o, active: !currentActive } : o))
            )
        }
    }

    const deleteOffer = async (offerId: string) => {
        if (!confirm('Are you sure you want to delete this offer?')) return

        const { error } = await supabase
            .from('offers')
            .delete()
            .eq('id', offerId)

        if (!error) {
            setOffers((prev) => prev.filter((o) => o.id !== offerId))
        }
    }

    const saveOffer = async () => {
        if (editingId) {
            const { error } = await supabase
                .from('offers')
                .update(form)
                .eq('id', editingId)

            if (!error) {
                setOffers((prev) =>
                    prev.map((o) => (o.id === editingId ? { ...o, ...form } as Offer : o))
                )
                setEditingId(null)
                setForm({})
            }
        } else {
            const { data, error } = await supabase
                .from('offers')
                .insert(form)
                .select()
                .single()

            if (!error && data) {
                setOffers((prev) => [data as Offer, ...prev])
                setShowAddForm(false)
                setForm({ title: '', description: '', type: 'bundle', active: true })
            }
        }
    }

    const startEdit = (offer: Offer) => {
        setEditingId(offer.id)
        setForm({
            title: offer.title,
            description: offer.description,
            type: offer.type,
            value: offer.value,
            bundle_qty: offer.bundle_qty,
            bundle_price: offer.bundle_price,
            min_order_amount: offer.min_order_amount,
            active: offer.active,
        })
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-maroon flex items-center gap-2">
                    <Tag size={28} />
                    Offer Management
                </h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90"
                >
                    <Plus size={20} />
                    Add Offer
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-bold mb-4">Create New Offer</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title || ''}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                        <select
                            value={form.type || 'bundle'}
                            onChange={(e) => setForm({ ...form, type: e.target.value as Offer['type'] })}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="bundle">Bundle</option>
                            <option value="percentage">Percentage</option>
                            <option value="flat">Flat Discount</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Description"
                            value={form.description || ''}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="px-4 py-2 border rounded-lg col-span-2"
                        />
                        {form.type === 'percentage' && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Percentage Value"
                                    value={form.value || ''}
                                    onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) })}
                                    className="px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="number"
                                    placeholder="Min Order Amount"
                                    value={form.min_order_amount || ''}
                                    onChange={(e) => setForm({ ...form, min_order_amount: parseInt(e.target.value) })}
                                    className="px-4 py-2 border rounded-lg"
                                />
                            </>
                        )}
                        {form.type === 'bundle' && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Bundle Quantity"
                                    value={form.bundle_qty || ''}
                                    onChange={(e) => setForm({ ...form, bundle_qty: parseInt(e.target.value) })}
                                    className="px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="number"
                                    placeholder="Bundle Price"
                                    value={form.bundle_price || ''}
                                    onChange={(e) => setForm({ ...form, bundle_price: parseInt(e.target.value) })}
                                    className="px-4 py-2 border rounded-lg"
                                />
                            </>
                        )}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={saveOffer}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setShowAddForm(false)
                                setForm({})
                            }}
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Offers List */}
            <div className="space-y-4">
                {offers.map((offer) => (
                    <motion.div
                        key={offer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${offer.active ? 'border-green-500' : 'border-gray-300'
                            }`}
                    >
                        {editingId === offer.id ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={form.title || ''}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                                <input
                                    type="text"
                                    value={form.description || ''}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveOffer}
                                        className="p-2 bg-green-100 text-green-600 rounded-lg"
                                    >
                                        <Save size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null)
                                            setForm({})
                                        }}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900">{offer.title}</h3>
                                    <p className="text-gray-500 text-sm">{offer.description}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${offer.type === 'bundle' ? 'bg-blue-100 text-blue-700' :
                                            offer.type === 'percentage' ? 'bg-purple-100 text-purple-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {offer.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(offer.id, offer.active)}
                                        className={`p-2 rounded-lg ${offer.active ? 'text-green-600' : 'text-gray-400'
                                            }`}
                                    >
                                        {offer.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                    </button>
                                    <button
                                        onClick={() => startEdit(offer)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteOffer(offer.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
