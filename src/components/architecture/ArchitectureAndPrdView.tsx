import React, { useState } from 'react';
import { ARCHITECTURE_COMPONENTS, PRD_SECTIONS } from '../../mockData';
import { ArchitectureComponent, PRDSection } from '../../types';
import {
  FileCode2,
  Layers,
  Server,
  Database,
  Cpu,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

export const ArchitectureAndPrdView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'prd'>('architecture');
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent>(ARCHITECTURE_COMPONENTS[0]);
  const [selectedPrdSection, setSelectedPrdSection] = useState<PRDSection>(PRD_SECTIONS[0]);

  const layers = [
    'Client Applications',
    'API Gateway & Security',
    'Core Microservices',
    'Data & Persistence',
    'External Gateways'
  ];

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'Client Applications': return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'API Gateway & Security': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'Core Microservices': return <Server className="w-4 h-4 text-blue-500" />;
      case 'Data & Persistence': return <Database className="w-4 h-4 text-amber-500" />;
      case 'External Gateways': return <Globe className="w-4 h-4 text-rose-500" />;
      default: return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* View Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Project Blueprint</span>
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">System Architecture & Product Specifications</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ground-truth architectural models and product requirements documenting the synchronized dual-surface platform (Customer Mobile App & Authoritative Web Portal).
          </p>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 shrink-0">
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Architecture Diagram</span>
          </button>
          <button
            onClick={() => setActiveSubTab('prd')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'prd'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>PRD Requirements Document</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'architecture' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Architecture Diagram Diagram Canvas (2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Multi-Tier Architecture Schema</h3>
                <p className="text-xs text-slate-500">Click any block to inspect microservice specifications, telemetry, and interfaces.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                End-to-End Reactive
              </span>
            </div>

            {/* Visual Layers Stack */}
            <div className="space-y-4">
              {layers.map((layerName, layerIdx) => {
                const layerComponents = ARCHITECTURE_COMPONENTS.filter(c => c.layer === layerName);

                return (
                  <div key={layerName} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 relative">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        {getLayerIcon(layerName)}
                        <span>Layer {layerIdx + 1}: {layerName}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {layerComponents.map((comp) => {
                        const isSelected = selectedComponent.id === comp.id;

                        return (
                          <div
                            key={comp.id}
                            onClick={() => setSelectedComponent(comp)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'bg-indigo-50/90 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900">{comp.title}</h4>
                              <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                                comp.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : comp.status === 'High Availability'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {comp.status}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-indigo-600 mt-1">{comp.techStack}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{comp.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Data Flow Pipeline Banner */}
            <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-950">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Real-Time Sync Pipeline:</strong> Customer places order on mobile → Ingress Gateway → FSM Dispatch Engine → PostgreSQL Write + Redis Pub/Sub → Instant WebSocket broadcast to Admin Web Portal!
                </span>
              </div>
            </div>
          </div>

          {/* Component Deep-Dive Inspector (1 col) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Component Inspector</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedComponent.title}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">{selectedComponent.techStack}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Architectural Role</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedComponent.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Responsibilities</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedComponent.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Connected Subsystems</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedComponent.connections.map((conn, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                    {conn}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800">Deployment Paradigm:</span>
              <p className="text-slate-500 text-[11px]">Containerized microservice hosted on Google Cloud Run with autoscaling (0 to 100 instances).</p>
            </div>
          </div>

        </div>
      ) : (
        /* PRD Explorer */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* PRD Table of Contents (1 col) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">PRD Document Index</span>
            {PRD_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedPrdSection(sec)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all ${
                  selectedPrdSection.id === sec.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* PRD Content Reader (3 cols) */}
          <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{selectedPrdSection.category}</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedPrdSection.title}</h2>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed">
              <p>{selectedPrdSection.content}</p>
            </div>

            {selectedPrdSection.bullets && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Functional Requirements & Acceptance Criteria</h4>
                <div className="space-y-2">
                  {selectedPrdSection.bullets.map((bullet, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>OmniFlow Product Specification v2.4</span>
              <span>Status: <strong className="text-emerald-600">Production Ready</strong></span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
