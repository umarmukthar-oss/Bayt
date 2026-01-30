'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Package, Plus, Minus, Edit2, Save, X } from 'lucide-react'
import { Flavor } from '@/lib/types'

export default function InventoryPage() {
    const [flavors, setFlavors] = useState<Flavor[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<Flavor>>({})
    const supabase = createClient()

    const fetchFlavors = async () => {
        const { data } = await supabase
            .from('flavors')
            .select('*')
            .order('name')
        setFlavors((data as Flavor[]) || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchFlavors()
    }, [])

    const handleStockChange = async (flavorId: string, change: number) => {
        const flavor = flavors.find((f) => f.id === flavorId)
        if (!flavor) return

        const newStock = Math.max(0, flavor.in_stock + change)

        const { error } = await supabase
            .from('flavors')
            .update({ in_stock: newStock })
            .eq('id', flavorId)

        if (!error) {
            setFlavors((prev) =>
                prev.map((f) => (f.id === flavorId ? { ...f, in_stock: newStock } : f))
            )

            // Log inventory change
            await supabase.from('inventory_log').insert({
                flavor_id: flavorId,
                change,
                reason: change > 0 ? 'Manual restock' : 'Manual adjustment',
            })
        }
    }

    const startEdit = (flavor: Flavor) => {
        setEditingId(flavor.id)
        setEditForm({
            name: flavor.name,
            description: flavor.description,
            price_single: flavor.price_single,
            price_double: flavor.price_double,
            in_stock: flavor.in_stock,
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    const saveEdit = async () => {
        if (!editingId) return

        const { error } = await supabase
            .from('flavors')
            .update(editForm)
            .eq('id', editingId)

        if (!error) {
            setFlavors((prev) =>
                prev.map((f) => (f.id === editingId ? { ...f, ...editForm } as Flavor : f))
            )
            cancelEdit()
        }
    }

    const getStockColor = (stock: number) => {
        if (stock === 0) return 'text-red-600 bg-red-50'
        if (stock <= 5) return 'text-yellow-600 bg-yellow-50'
        return 'text-green-600 bg-green-50'
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-maroon flex items-center gap-2">
                    <Package size={28} />
                    Inventory Management
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price (Single)</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price (Double)</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {flavors.map((flavor) => (
                            <motion.tr
                                key={flavor.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">
                                    {editingId === flavor.id ? (
                                        <input
                                            type="text"
                                            value={editForm.name || ''}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="px-3 py-2 border rounded-lg w-full"
                                        />
                                    ) : (
                                        <div>
                                            <p className="font-medium text-gray-900">{flavor.name}</p>
                                            <p className="text-sm text-gray-500">{flavor.description}</p>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === flavor.id ? (
                                        <input
                                            type="number"
                                            value={editForm.price_single || 0}
                                            onChange={(e) => setEditForm({ ...editForm, price_single: parseInt(e.target.value) })}
                                            className="px-3 py-2 border rounded-lg w-24"
                                        />
                                    ) : (
                                        <span className="font-medium">₹{flavor.price_single}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === flavor.id ? (
                                        <input
                                            type="number"
                                            value={editForm.price_double || 0}
                                            onChange={(e) => setEditForm({ ...editForm, price_double: parseInt(e.target.value) })}
                                            className="px-3 py-2 border rounded-lg w-24"
                                        />
                                    ) : (
                                        <span className="font-medium">₹{flavor.price_double}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleStockChange(flavor.id, -1)}
                                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                            disabled={flavor.in_stock === 0}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className={`px-3 py-1 rounded-full font-medium ${getStockColor(flavor.in_stock)}`}>
                                            {flavor.in_stock}
                                        </span>
                                        <button
                                            onClick={() => handleStockChange(flavor.id, 1)}
                                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === flavor.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveEdit}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                            >
                                                <Save size={18} />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(flavor)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
