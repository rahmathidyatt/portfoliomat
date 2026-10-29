import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  Lock,
  Unlock,
  Info,
  GitBranch,
  X,
  Code2,
  Database,
  Cpu,
  Wrench,
  Globe,
} from 'lucide-react';
import { GitHubRepo, TechCategory, TechNode, ProjectGraphNode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import {
  buildGraphDataset,
  CATEGORY_COLORS,
  CATEGORY_LABELS_EN,
  CATEGORY_LABELS_ID,
} from '../utils/techGraphData';

interface TechNetworkGraphProps {
  repos: GitHubRepo[];
}

export const TechNetworkGraph: React.FC<TechNetworkGraphProps> = ({ repos }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const tg = t.projects.techGraph;

  const [selectedCategory, setSelectedCategory] = useState<'all' | TechCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [lockedNodeId, setLockedNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG canvas dimensions
  const SVG_WIDTH = 960;
  const SVG_HEIGHT = 580;
  const CENTER_X = SVG_WIDTH / 2;
  const CENTER_Y = SVG_HEIGHT / 2;

  // Build reactive dataset from repos
  const dataset = useMemo(() => {
    return buildGraphDataset(repos, SVG_WIDTH, SVG_HEIGHT);
  }, [repos]);

  // Determine active node (locked has priority over hovered)
  const activeNodeId = lockedNodeId || hoveredNodeId;

  // Find active project or active tech node
  const activeProject = useMemo(() => {
    if (!activeNodeId || !activeNodeId.startsWith('project-')) return null;
    return dataset.projects.find((p) => p.id === activeNodeId) || null;
  }, [activeNodeId, dataset.projects]);

  const activeTech = useMemo(() => {
    if (!activeNodeId || !activeNodeId.startsWith('tech-')) return null;
    return dataset.techs.find((t) => t.id === activeNodeId) || null;
  }, [activeNodeId, dataset.techs]);

  // Connected sets for active selection
  const connectedTechIds = useMemo(() => {
    if (activeProject) return new Set(activeProject.techIds);
    if (activeTech) return new Set([activeTech.id]);
    return new Set<string>();
  }, [activeProject, activeTech]);

  const connectedProjectIds = useMemo(() => {
    if (activeProject) return new Set([activeProject.id]);
    if (activeTech) return new Set(activeTech.projectIds.map((pid) => `project-${pid}`));
    return new Set<string>();
  }, [activeProject, activeTech]);

  // Similar projects when a project is selected
  const similarProjectsList = useMemo(() => {
    if (!activeProject) return [];
    return dataset.similarityMap.get(activeProject.id) || [];
  }, [activeProject, dataset.similarityMap]);

  // Set of similar project IDs for highlighting halos
  const similarProjectIds = useMemo(() => {
    return new Set(similarProjectsList.map((sp) => sp.projectNode.id));
  }, [similarProjectsList]);

  // Frequent co-occurring technologies when a tech is selected
  const coOccurringTechs = useMemo(() => {
    if (!activeTech) return [];
    const countMap = new Map<string, number>();

    activeTech.projectIds.forEach((pid) => {
      const proj = dataset.projects.find((p) => p.repoId === pid);
      if (proj) {
        proj.techIds.forEach((tId) => {
          if (tId !== activeTech.id) {
            countMap.set(tId, (countMap.get(tId) || 0) + 1);
          }
        });
      }
    });

    return Array.from(countMap.entries())
      .map(([tId, count]) => {
        const node = dataset.techs.find((t) => t.id === tId);
        return node ? { tech: node, count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.count - a!.count)
      .slice(0, 4) as { tech: TechNode; count: number }[];
  }, [activeTech, dataset.projects, dataset.techs]);

  // Filtered nodes matching category and search query
  const searchLower = searchQuery.trim().toLowerCase();

  const isTechVisible = (tech: TechNode) => {
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesSearch =
      searchLower === '' ||
      tech.name.toLowerCase().includes(searchLower) ||
      (CATEGORY_LABELS_EN[tech.category] || '').toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  };

  const isProjectVisible = (proj: ProjectGraphNode) => {
    const matchesSearch =
      searchLower === '' ||
      proj.displayName.toLowerCase().includes(searchLower) ||
      (proj.primaryLanguage || '').toLowerCase().includes(searchLower) ||
      (proj.repo.topics && proj.repo.topics.some((tp) => tp.toLowerCase().includes(searchLower)));

    if (selectedCategory === 'all') return matchesSearch;

    // Has at least one technology of the selected category
    const hasCategoryTech = proj.techIds.some((tId) => {
      const tNode = dataset.techs.find((t) => t.id === tId);
      return tNode && tNode.category === selectedCategory;
    });

    return matchesSearch && hasCategoryTech;
  };

  // Node selection handler
  const handleNodeClick = (nodeId: string) => {
    if (lockedNodeId === nodeId) {
      setLockedNodeId(null);
    } else {
      setLockedNodeId(nodeId);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.15, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setLockedNodeId(null);
    setHoveredNodeId(null);
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node')) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Category Icon Resolver
  const getCategoryIcon = (category: TechCategory) => {
    switch (category) {
      case 'language':
        return <Code2 size={13} />;
      case 'framework':
        return <Globe size={13} />;
      case 'database':
        return <Database size={13} />;
      case 'ai':
        return <Cpu size={13} />;
      case 'tool':
        return <Wrench size={13} />;
    }
  };

  const categoryLabels = language === 'id' ? CATEGORY_LABELS_ID : CATEGORY_LABELS_EN;

  return (
    <div className="tech-graph-card" ref={containerRef}>
      {/* Header bar */}
      <div className="tech-graph-header">
        <div className="tech-graph-title-group">
          <div className="tech-graph-kicker-wrap">
            <span className="tech-graph-stats-chip">
              <GitBranch size={13} />
              <span>
                {dataset.projects.length} {t.projects.githubReposCount} · {dataset.techs.length} Skills ·{' '}
                {dataset.edges.length} Links
              </span>
            </span>
          </div>
          <h3 className="tech-graph-title">{tg.title}</h3>
          <p className="tech-graph-subtitle">{tg.subtitle}</p>
        </div>

        {/* Zoom & Reset Toolbar */}
        <div className="tech-graph-header-actions">
          <div className="tech-graph-zoom-group">
            <button
              type="button"
              className="tech-graph-tool-btn"
              onClick={handleZoomIn}
              title={tg.zoomIn}
              aria-label={tg.zoomIn}
            >
              <ZoomIn size={15} />
            </button>
            <button
              type="button"
              className="tech-graph-tool-btn"
              onClick={handleZoomOut}
              title={tg.zoomOut}
              aria-label={tg.zoomOut}
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              className="tech-graph-tool-btn"
              onClick={handleResetZoom}
              title={tg.resetZoom}
              aria-label={tg.resetZoom}
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {lockedNodeId && (
            <button
              type="button"
              className="tech-graph-lock-badge"
              onClick={() => setLockedNodeId(null)}
              title={tg.resetSelection}
            >
              <Lock size={12} />
              <span>{tg.selectionLocked}</span>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="tech-graph-controls-bar">
        {/* Category Filter Pills */}
        <div className="tech-graph-category-filters" role="group" aria-label="Filter technologies">
          <button
            type="button"
            className={`tech-graph-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <Layers size={13} />
            <span>{tg.filterAll}</span>
          </button>

          {(['language', 'framework', 'database', 'ai', 'tool'] as TechCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`tech-graph-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span
                className="category-filter-dot"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span>{categoryLabels[cat]}</span>
            </button>
          ))}
        </div>

        {/* Graph Search Input */}
        <div className="tech-graph-search-wrap">
          <Search size={14} className="tech-graph-search-icon" />
          <input
            type="text"
            placeholder={tg.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tech-graph-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="tech-graph-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div
        className={`tech-graph-canvas-container ${isPanning ? 'panning' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="tech-graph-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Filter glow for highlighted nodes */}
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.22  0 0 0 0 0.74  0 0 0 0 0.97  0 0 0 0.8 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulsing ring filter for similar projects */}
            <filter id="similarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.98  0 0 0 0 0.75  0 0 0 0 0.15  0 0 0 0.85 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Zoom & Pan Group */}
          <g
            transform={`translate(${panOffset.x + (1 - zoomLevel) * (CENTER_X)}, ${
              panOffset.y + (1 - zoomLevel) * (CENTER_Y)
            }) scale(${zoomLevel})`}
            style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px`, transition: isPanning ? 'none' : 'transform 0.25s ease-out' }}
          >
            {/* Ambient Orbital Rings */}
            <g className="graph-orbit-rings" opacity="0.35">
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={Math.min(SVG_WIDTH, SVG_HEIGHT) * 0.23}
                fill="none"
                stroke="var(--card-border)"
                strokeDasharray="4 6"
              />
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={Math.min(SVG_WIDTH, SVG_HEIGHT) * 0.40}
                fill="none"
                stroke="var(--card-border)"
                strokeDasharray="4 6"
              />
            </g>

            {/* Central Ecosystem Hub */}
            <g className="graph-central-hub" pointerEvents="none">
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r="30"
                fill="var(--input-color)"
                stroke="var(--card-border)"
                strokeWidth="1.5"
              />
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r="6"
                fill="var(--first-color)"
                opacity="0.85"
              />
              <text
                x={CENTER_X}
                y={CENTER_Y + 18}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="var(--text-color-light)"
              >
                ECOSYSTEM
              </text>
            </g>

            {/* Layer 1: Edges / Connection Lines */}
            <g className="graph-edges-layer">
              {dataset.edges.map((edge) => {
                const projNode = dataset.projects.find((p) => p.id === edge.projectId);
                const techNode = dataset.techs.find((t) => t.id === edge.techId);
                if (!projNode || !techNode) return null;

                const isConnected =
                  activeNodeId === edge.projectId || activeNodeId === edge.techId;
                const isDimmed = activeNodeId !== null && !isConnected;

                // Curved bezier path curving gently toward center
                const midX = (projNode.x + techNode.x) / 2;
                const midY = (projNode.y + techNode.y) / 2;
                const ctrlX = (midX + CENTER_X) / 2;
                const ctrlY = (midY + CENTER_Y) / 2;

                return (
                  <path
                    key={edge.id}
                    d={`M ${projNode.x} ${projNode.y} Q ${ctrlX} ${ctrlY} ${techNode.x} ${techNode.y}`}
                    fill="none"
                    stroke={isConnected ? edge.color : 'var(--card-border)'}
                    strokeWidth={isConnected ? 2.5 : 1}
                    strokeOpacity={isConnected ? 0.95 : isDimmed ? 0.08 : 0.28}
                    strokeDasharray={isConnected ? 'none' : undefined}
                    className={`graph-edge ${isConnected ? 'active' : ''}`}
                    style={{
                      transition: 'stroke-opacity 0.25s ease, stroke-width 0.25s ease',
                    }}
                  />
                );
              })}
            </g>

            {/* Layer 2: Technology Nodes (Inner Orbit) */}
            <g className="graph-techs-layer">
              {dataset.techs.map((tech) => {
                const isVisible = isTechVisible(tech);
                const isSelected = activeNodeId === tech.id;
                const isConnected = connectedTechIds.has(tech.id);
                const isDimmed = activeNodeId !== null && !isSelected && !isConnected;

                const opacity = !isVisible ? 0.15 : isDimmed ? 0.2 : 1;
                const radius = isSelected ? 22 : isConnected ? 19 : 16;

                return (
                  <g
                    key={tech.id}
                    className={`graph-node graph-node--tech ${isSelected ? 'selected' : ''} ${
                      isConnected ? 'connected' : ''
                    }`}
                    transform={`translate(${tech.x}, ${tech.y})`}
                    style={{
                      opacity,
                      cursor: 'pointer',
                      transition: 'opacity 0.25s ease, transform 0.25s ease',
                    }}
                    onMouseEnter={() => !lockedNodeId && setHoveredNodeId(tech.id)}
                    onMouseLeave={() => !lockedNodeId && setHoveredNodeId(null)}
                    onClick={() => handleNodeClick(tech.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Technology: ${tech.name}, used in ${tech.projectCount} repositories`}
                  >
                    {/* Pulsing halo if connected or selected */}
                    {(isSelected || isConnected) && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={tech.color}
                        strokeWidth="2"
                        strokeOpacity="0.45"
                        filter="url(#nodeGlow)"
                        className="node-pulse-ring"
                      />
                    )}

                    {/* Main tech circle */}
                    <circle
                      r={radius}
                      fill="var(--container-color)"
                      stroke={tech.color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="tech-circle"
                    />

                    {/* Center category color dot */}
                    <circle r={radius * 0.42} fill={tech.color} opacity="0.85" />

                    {/* Usage count pill on corner */}
                    <g transform={`translate(${radius * 0.7}, ${-radius * 0.7})`}>
                      <circle r="7" fill={tech.color} />
                      <text
                        textAnchor="middle"
                        dy="3"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill="#ffffff"
                      >
                        {tech.projectCount}
                      </text>
                    </g>

                    {/* Tech Name Label */}
                    <text
                      y={radius + 13}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight={isSelected || isConnected ? '700' : '600'}
                      fill={isSelected || isConnected ? 'var(--title-color)' : 'var(--text-color)'}
                      className="node-label tech-label"
                      style={{
                        textShadow:
                          '0 1px 3px rgba(0,0,0,0.45), 0 0 2px var(--body-color)',
                      }}
                    >
                      {tech.name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Layer 3: Project Nodes (Outer Orbit) */}
            <g className="graph-projects-layer">
              {dataset.projects.map((proj) => {
                const isVisible = isProjectVisible(proj);
                const isSelected = activeNodeId === proj.id;
                const isConnected = connectedProjectIds.has(proj.id);
                const isSimilar = similarProjectIds.has(proj.id);
                const isDimmed =
                  activeNodeId !== null && !isSelected && !isConnected && !isSimilar;

                const opacity = !isVisible ? 0.15 : isDimmed ? 0.18 : 1;
                const radius = isSelected ? 16 : isConnected || isSimilar ? 14 : 11;

                // Find similarity info if active node is a project
                const similarityInfo = similarProjectsList.find(
                  (sp) => sp.projectNode.id === proj.id
                );

                return (
                  <g
                    key={proj.id}
                    className={`graph-node graph-node--project ${isSelected ? 'selected' : ''} ${
                      isConnected ? 'connected' : ''
                    } ${isSimilar ? 'similar' : ''}`}
                    transform={`translate(${proj.x}, ${proj.y})`}
                    style={{
                      opacity,
                      cursor: 'pointer',
                      transition: 'opacity 0.25s ease, transform 0.25s ease',
                    }}
                    onMouseEnter={() => !lockedNodeId && setHoveredNodeId(proj.id)}
                    onMouseLeave={() => !lockedNodeId && setHoveredNodeId(null)}
                    onClick={() => handleNodeClick(proj.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Project: ${proj.displayName}`}
                  >
                    {/* Similar project gold glow halo */}
                    {isSimilar && (
                      <circle
                        r={radius + 7}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        filter="url(#similarGlow)"
                        className="similar-pulse-ring"
                      />
                    )}

                    {/* Selected project cyan glow halo */}
                    {(isSelected || isConnected) && (
                      <circle
                        r={radius + 7}
                        fill="none"
                        stroke="var(--first-color)"
                        strokeWidth="2.5"
                        filter="url(#nodeGlow)"
                      />
                    )}

                    {/* Project Node Base Circle */}
                    <circle
                      r={radius}
                      fill="var(--input-color)"
                      stroke={
                        isSelected
                          ? 'var(--first-color)'
                          : isSimilar
                          ? '#f59e0b'
                          : isConnected
                          ? 'var(--first-color)'
                          : 'var(--card-border)'
                      }
                      strokeWidth={isSelected || isSimilar ? 2.5 : 1.5}
                    />

                    {/* Inner Git Branch Indicator */}
                    <circle
                      r={radius * 0.45}
                      fill={
                        isSelected
                          ? 'var(--first-color)'
                          : isSimilar
                          ? '#f59e0b'
                          : 'var(--text-color-light)'
                      }
                    />

                    {/* Shared Technology count pill if similar */}
                    {isSimilar && similarityInfo && (
                      <g transform={`translate(${radius * 0.6}, ${-radius * 0.6})`}>
                        <rect
                          x="-12"
                          y="-9"
                          width="24"
                          height="14"
                          rx="7"
                          fill="#f59e0b"
                        />
                        <text
                          textAnchor="middle"
                          dy="1.5"
                          fontSize="8.5"
                          fontWeight="bold"
                          fill="#ffffff"
                        >
                          +{similarityInfo.score}
                        </text>
                      </g>
                    )}

                    {/* Project Label with background pill for high legibility */}
                    <g
                      transform={`translate(0, ${
                        proj.y > CENTER_Y ? radius + 14 : -(radius + 14)
                      })`}
                    >
                      <text
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight={isSelected || isSimilar ? '700' : '500'}
                        fill={
                          isSelected
                            ? 'var(--first-color)'
                            : isSimilar
                            ? '#f59e0b'
                            : 'var(--title-color)'
                        }
                        className="node-label project-label"
                        style={{
                          textShadow:
                            '0 1px 3px rgba(0,0,0,0.65), 0 0 2px var(--body-color)',
                        }}
                      >
                        {proj.displayName.length > 20
                          ? `${proj.displayName.slice(0, 18)}…`
                          : proj.displayName}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Floating Interactive Hover Tooltip (when node is hovered and not locked) */}
        {activeNodeId && !lockedNodeId && (
          <div className="tech-graph-floating-tooltip">
            {activeProject && (
              <div>
                <div className="tooltip-header">
                  <GitBranch size={13} className="text-first" />
                  <strong>{activeProject.displayName}</strong>
                </div>
                <p className="tooltip-desc">
                  {activeProject.repo.description || 'GitHub Public Repository'}
                </p>
                <div className="tooltip-tech-row">
                  <span className="tooltip-label">{tg.connectedTechsTitle}:</span>
                  <div className="tooltip-tech-chips">
                    {activeProject.techIds.map((tId) => {
                      const tNode = dataset.techs.find((t) => t.id === tId);
                      return tNode ? (
                        <span key={tId} className="tooltip-chip" style={{ color: tNode.color }}>
                          {tNode.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {similarProjectsList.length > 0 && (
                  <div className="tooltip-similarity-preview">
                    <span className="tooltip-label">
                      {tg.similarProjectsTitle} ({similarProjectsList.length}):
                    </span>
                    <span className="tooltip-sub">
                      {similarProjectsList.slice(0, 2).map((sp) => `${sp.projectNode.displayName} (+${sp.score})`).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTech && (
              <div>
                <div className="tooltip-header">
                  <span
                    className="tooltip-dot"
                    style={{ backgroundColor: activeTech.color }}
                  />
                  <strong>{activeTech.name}</strong>
                  <span className="tooltip-category-tag">
                    {categoryLabels[activeTech.category]}
                  </span>
                </div>
                <div className="tooltip-stats">
                  <span>
                    {activeTech.projectCount}{' '}
                    {activeTech.projectCount === 1 ? tg.usedInProject : tg.usedInCount}
                  </span>
                </div>
                <div className="tooltip-tech-row">
                  <span className="tooltip-label">{tg.connectedProjects}:</span>
                  <div className="tooltip-tech-chips">
                    {activeTech.projectIds.slice(0, 4).map((pid) => {
                      const proj = dataset.projects.find((p) => p.repoId === pid);
                      return proj ? (
                        <span key={pid} className="tooltip-chip">
                          {proj.displayName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Canvas Bottom Legend & Hint */}
        <div className="tech-graph-canvas-legend">
          <div className="canvas-legend-items">
            <span className="legend-item">
              <span className="legend-circle project-legend" />
              <span>{tg.legendProjects}</span>
            </span>
            <span className="legend-item">
              <span className="legend-circle tech-legend" />
              <span>{tg.legendTechs}</span>
            </span>
            <span className="legend-item">
              <span className="legend-circle similar-legend" />
              <span>{tg.similarProjectsTitle}</span>
            </span>
          </div>

          <span className="tech-graph-hint-text">
            <Info size={12} />
            <span>{tg.hintHover}</span>
          </span>
        </div>
      </div>

      {/* Selected Node Inspector Panel (Visible when a node is locked/inspected) */}
      {activeNodeId && (
        <div className="tech-graph-inspector">
          {activeProject && (
            <div className="inspector-content">
              <div className="inspector-top">
                <div className="inspector-badge-row">
                  <span className="inspector-pill inspector-pill--project">
                    <GitBranch size={13} />
                    <span>GitHub Repository</span>
                  </span>

                  {activeProject.primaryLanguage && (
                    <span className="inspector-lang-badge">
                      <span
                        className="lang-dot"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS.language,
                        }}
                      />
                      <span>{activeProject.primaryLanguage}</span>
                    </span>
                  )}

                  {lockedNodeId && (
                    <button
                      type="button"
                      className="inspector-unlock-btn"
                      onClick={() => setLockedNodeId(null)}
                      title={tg.resetSelection}
                    >
                      <Unlock size={12} />
                      <span>{tg.resetSelection}</span>
                    </button>
                  )}
                </div>

                <div className="inspector-header-row">
                  <h4 className="inspector-title">{activeProject.displayName}</h4>
                  <a
                    href={activeProject.repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--secondary button--small button--flex"
                  >
                    <span>{tg.viewOnGitHub}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <p className="inspector-description">
                  {activeProject.repo.description ||
                    (language === 'id'
                      ? 'Repositori kode publik di akun GitHub resmi.'
                      : 'Public code repository hosted on GitHub.')}
                </p>
              </div>

              {/* Technologies Used in this Project */}
              <div className="inspector-section">
                <h5 className="inspector-section-title">
                  <Code2 size={14} />
                  <span>{tg.connectedTechsTitle} ({activeProject.techIds.length})</span>
                </h5>
                <div className="inspector-chips-row">
                  {activeProject.techIds.map((tId) => {
                    const tech = dataset.techs.find((t) => t.id === tId);
                    if (!tech) return null;
                    return (
                      <button
                        key={tId}
                        type="button"
                        className="inspector-tech-chip"
                        onClick={() => handleNodeClick(tech.id)}
                        title={`Focus on ${tech.name}`}
                      >
                        <span
                          className="chip-dot"
                          style={{ backgroundColor: tech.color }}
                        />
                        <span>{tech.name}</span>
                        <span className="chip-cat">{categoryLabels[tech.category]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Similar Projects that Share Technologies */}
              {similarProjectsList.length > 0 && (
                <div className="inspector-section">
                  <h5 className="inspector-section-title">
                    <Sparkles size={14} className="text-amber" />
                    <span>{tg.similarProjectsTitle} ({similarProjectsList.length})</span>
                  </h5>
                  <div className="inspector-similar-grid">
                    {similarProjectsList.slice(0, 4).map(({ projectNode, sharedTechs, score }) => (
                      <div
                        key={projectNode.id}
                        className="similar-project-card"
                        onClick={() => handleNodeClick(projectNode.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="similar-card-header">
                          <span className="similar-card-name">
                            {projectNode.displayName}
                          </span>
                          <span className="similar-overlap-badge">
                            {score} {tg.sharesCount}
                          </span>
                        </div>
                        <p className="similar-card-techs">
                          <span className="label">{tg.techsWith}:</span>{' '}
                          {sharedTechs.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTech && (
            <div className="inspector-content">
              <div className="inspector-top">
                <div className="inspector-badge-row">
                  <span
                    className="inspector-pill"
                    style={{
                      borderColor: activeTech.color,
                      color: activeTech.color,
                    }}
                  >
                    {getCategoryIcon(activeTech.category)}
                    <span>{categoryLabels[activeTech.category]}</span>
                  </span>

                  <span className="inspector-count-badge">
                    {activeTech.projectCount}{' '}
                    {activeTech.projectCount === 1 ? tg.usedInProject : tg.usedInCount}
                  </span>

                  {lockedNodeId && (
                    <button
                      type="button"
                      className="inspector-unlock-btn"
                      onClick={() => setLockedNodeId(null)}
                      title={tg.resetSelection}
                    >
                      <Unlock size={12} />
                      <span>{tg.resetSelection}</span>
                    </button>
                  )}
                </div>

                <h4 className="inspector-title" style={{ color: activeTech.color }}>
                  {activeTech.name}
                </h4>

                <p className="inspector-description">
                  {language === 'id'
                    ? `Teknologi ${activeTech.name} digunakan secara aktif dalam ${activeTech.projectCount} repositori GitHub di profil ini.`
                    : `${activeTech.name} is actively integrated across ${activeTech.projectCount} GitHub repositories in this portfolio.`}
                </p>
              </div>

              {/* Frequently Co-occurring Technologies */}
              {coOccurringTechs.length > 0 && (
                <div className="inspector-section">
                  <h5 className="inspector-section-title">
                    <Layers size={14} />
                    <span>{tg.coOccurringTechsTitle}</span>
                  </h5>
                  <div className="inspector-chips-row">
                    {coOccurringTechs.map(({ tech, count }) => (
                      <button
                        key={tech.id}
                        type="button"
                        className="inspector-tech-chip"
                        onClick={() => handleNodeClick(tech.id)}
                        title={`Focus on ${tech.name}`}
                      >
                        <span
                          className="chip-dot"
                          style={{ backgroundColor: tech.color }}
                        />
                        <span>{tech.name}</span>
                        <span className="chip-cat">
                          +{count} {tg.sharesCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
