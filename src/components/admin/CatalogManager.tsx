import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceItem } from '../../types';
import {
  Plus,
  Edit2,
  Check,
  X,
  Power,
  Sparkles,
  DollarSign,
  Clock,
  Star,
  CheckCircle2
} from 'lucide-react';

export const CatalogManager: React.FC = () => {
  const { services, addService, updateService, toggleServiceAvailability } = usePlatform();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // New Service Form
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ServiceItem['category']>('Home Cleaning');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newPrice, setNewPrice] = useState<number>(79);
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newFeatures, setNewFeatures] = useState<string>('Certified technician, 100% Satisfaction Guarantee');

  const handleStartEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setEditPrice(service.price);
  };

  const handleSaveEdit = (service: ServiceItem) => {
    updateService({
      ...service,
      price: editPrice
    });
    setEditingServiceId(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addService({
      name: newName.trim(),
      category: newCategory,
      description: newDesc.trim() || 'Professional on-demand service executed by verified specialists.',
      price: newPrice,
      durationMinutes: newDuration,
      iconName: newCategory === 'Home Cleaning' ? 'Sparkles' : newCategory === 'Express Courier' ? 'Truck' : 'Wrench',
      available: true,
      features: newFeatures.split(',').map(f => f.trim()).filter(Boolean)
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-5">
      
      {/* Catalog Manager Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Service Catalog & Dynamic Pricing Manager</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Instant Sync
            </span>
          </h2>
          <p className="text-xs text-slate-500">Mutate service rates, update availability, or deploy new service offerings live to the customer app.</p>
        </div>

        <button
          id="btn-add-service"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Service Offering</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price (USD)</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Customer Rating</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{service.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">{service.description}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {service.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {editingServiceId === service.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">$</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-white border border-indigo-400 rounded-md text-xs font-bold text-slate-900"
                        />
                        <button
                          onClick={() => handleSaveEdit(service)}
                          className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingServiceId(null)}
                          className="p-1 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">${service.price}.00</span>
                        <button
                          onClick={() => handleStartEdit(service)}
                          className="text-slate-400 hover:text-indigo-600 p-0.5"
                          title="Edit Pricing"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {service.durationMinutes} mins
                  </td>
                  <td className="p-3.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {service.rating} <span className="text-slate-400 font-normal">({service.reviewsCount})</span>
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => toggleServiceAvailability(service.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                        service.available
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      <Power className="w-2.5 h-2.5" />
                      <span>{service.available ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleStartEdit(service)}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Service to Live Catalog</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="E.g., Solar Panel Inverter Diagnostic"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ServiceItem['category'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Home Cleaning">Home Cleaning</option>
                  <option value="Plumbing & Electrical">Plumbing & Electrical</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Tech Support">Tech Support</option>
                  <option value="Express Courier">Express Courier</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe scope of work and tools provided..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Features (Comma-separated)</label>
                <input
                  type="text"
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  placeholder="Licensed pro, 30-day warranty, Genuine parts"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Publish to App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
