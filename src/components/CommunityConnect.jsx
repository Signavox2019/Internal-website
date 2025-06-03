import React, { useState, useEffect } from 'react';
import '../styles/CommunityConnect.css';
import {
    Box,
    Container,
    Typography,
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
    Zoom,
    alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Tree from 'react-d3-tree';
import {
    ZoomIn,
    ZoomOut,
    CenterFocusStrong,
    ArrowUpward,
} from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import LoadingScreen from './LoadingScreen';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f3ff 100%)',
    padding: theme.spacing(4),
}));

const TreeContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 'calc(100vh - 300px)',
    minHeight: '700px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const CustomNode = ({ nodeDatum, toggleNode }) => {
    const isLeaf = !nodeDatum.children || nodeDatum.children.length === 0;
    const nodeSize = nodeDatum.data.role === 'CEO' ? 45 : 
                    nodeDatum.data.role === 'Department' ? 40 :
                    nodeDatum.data.isTeamLead ? 35 : 30;
    const isOnBench = nodeDatum.data.isOnBench && !['Executive', 'Operations', 'Recruitment'].includes(nodeDatum.data.team);
    const isTeamLead = nodeDatum.data.isTeamLead;
    const isDepartment = nodeDatum.data.role === 'Department';
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;

    // Calculate opacity based on bench status
    const nodeOpacity = isOnBench ? 0.6 : 1;
    
    return (
        <Tooltip 
            title={
                <div>
                    <Typography variant="subtitle2">{nodeDatum.data.name}</Typography>
                    {!isDepartment && (
                        <>
                            <Typography variant="caption">Role: {nodeDatum.data.role}</Typography>
                            <Typography variant="caption" display="block">Team: {nodeDatum.data.team}</Typography>
                            {nodeDatum.data.experience && (
                                <Typography variant="caption" display="block">Experience: {nodeDatum.data.experience}</Typography>
                            )}
                            {nodeDatum.data.skills?.length > 0 && (
                                <Typography variant="caption" display="block">
                                    Skills: {nodeDatum.data.skills.join(', ')}
                                </Typography>
                            )}
                            <Typography variant="caption" display="block" 
                                style={{ color: nodeDatum.data.isAvailable ? '#4CAF50' : '#ff5252' }}>
                                Status: {nodeDatum.data.isAvailable ? 'Available' : 'Busy'}
                            </Typography>
                        </>
                    )}
                </div>
            }
            placement="right"
            arrow
        >
            <g onClick={hasChildren ? toggleNode : undefined} style={{ cursor: hasChildren ? 'pointer' : 'default' }}>
                {/* Background for special nodes */}
                {(isOnBench || isTeamLead) && !isDepartment && (
                    <rect
                        x={-150}
                        y={-50}
                        width={300}
                        height={200}
                        rx={15}
                        ry={15}
                        fill={isTeamLead ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 244, 229, 0.7)'}
                        stroke={isTeamLead ? '#FF9800' : '#FFB74D'}
                        strokeWidth={2}
                        strokeDasharray={isOnBench ? "5,5" : "none"}
                        className="special-background"
                        style={{ opacity: nodeOpacity }}
                    />
                )}
                
                {/* Node circle with gradient */}
                <circle
                    r={nodeSize + 5}
                    fill={`url(#${nodeDatum.data.team.replace('/', '')}Gradient)`}
                    className="node-glow"
                    style={{ opacity: nodeOpacity * 0.6 }}
                />
                
                {/* Main circle */}
                <circle
                    r={nodeSize}
                    fill={nodeDatum.data.color}
                    stroke={isTeamLead ? '#FF9800' : isOnBench ? '#FFB74D' : 'white'}
                    strokeWidth={3}
                    className="node-main"
                    style={{ opacity: nodeOpacity }}
                />

                {/* Expand/Collapse indicator */}
                {hasChildren && (
                    <g transform={`translate(${nodeSize + 10}, 0)`}>
                        <circle
                            r={12}
                            fill="white"
                            stroke={nodeDatum.data.color}
                            strokeWidth={2}
                            className="expand-collapse-btn"
                        />
                        <text
                            textAnchor="middle"
                            dy="0.3em"
                            style={{ 
                                fill: nodeDatum.data.color,
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            {nodeDatum.__rd3t.collapsed ? '+' : '−'}
                        </text>
                    </g>
                )}
                
                {/* Profile image or fallback */}
                {!isDepartment && (
                    <>
                        <image
                            href={nodeDatum.data.profileImage || ''}
                            x={-nodeSize + 5}
                            y={-nodeSize + 5}
                            width={nodeSize * 2 - 10}
                            height={nodeSize * 2 - 10}
                            clipPath={`circle(${nodeSize - 5}px at center)`}
                            style={{ opacity: nodeDatum.data.profileImage ? nodeOpacity : 0 }}
                        />
                        {!nodeDatum.data.profileImage && (
                            <text
                                textAnchor="middle"
                                dy="0.3em"
                                style={{ 
                                    fill: 'white', 
                                    fontSize: `${nodeSize/2}px`, 
                                    fontWeight: 'bold',
                                    opacity: nodeOpacity 
                                }}
                                className="node-text"
                            >
                                {nodeDatum.data.name?.charAt(0) || '?'}
                            </text>
                        )}
                    </>
                )}

                {/* Department Label */}
                {isDepartment && (
                    <text
                        textAnchor="middle"
                        dy="0.3em"
                        className="department-label"
                        style={{ fontSize: `${nodeSize/2}px` }}
                    >
                        {nodeDatum.data.name}
                    </text>
                )}

                {/* Info card */}
                {!isDepartment && (
                    <g transform={`translate(-120, ${nodeSize + 10})`}>
                        <rect
                            width="240"
                            height={isOnBench ? 120 : 100}
                            rx="12"
                            ry="12"
                            fill="rgba(255, 255, 255, 0.95)"
                            stroke={nodeDatum.data.color}
                            strokeWidth="2"
                            className="info-card"
                            style={{ opacity: nodeOpacity }}
                        />
                        
                        {/* Team indicator */}
                        <rect
                            x="0"
                            y="0"
                            width="240"
                            height="25"
                            rx="12"
                            ry="12"
                            fill={nodeDatum.data.color}
                            className="team-indicator"
                            style={{ opacity: nodeOpacity * 0.9 }}
                        />
                        
                        <text className="info-text" style={{ opacity: nodeOpacity }}>
                            <tspan x="120" y="17" textAnchor="middle" style={{ fill: 'white', fontWeight: 'bold' }}>
                                {nodeDatum.data.team}
                            </tspan>
                            <tspan x="120" y="45" textAnchor="middle" style={{ fontWeight: 'bold', fill: '#333' }}>
                                {nodeDatum.data.name}
                            </tspan>
                            <tspan x="120" y="65" textAnchor="middle" style={{ fill: '#666' }}>
                                {nodeDatum.data.role}
                                {isTeamLead && ' (Team Lead)'}
                            </tspan>
                            <tspan x="120" y="85" textAnchor="middle" style={{ fill: '#888', fontSize: '12px' }}>
                                {nodeDatum.data.employeeId}
                            </tspan>
                            {isOnBench && (
                                <tspan x="120" y="105" textAnchor="middle" style={{ fill: '#FFB74D', fontSize: '12px', fontWeight: 'bold' }}>
                                    ⚠️ On Bench
                                </tspan>
                            )}
                        </text>

                        {/* Status indicator */}
                        <circle
                            cx="225"
                            cy="15"
                            r="5"
                            fill={nodeDatum.data.isAvailable ? '#4CAF50' : '#ff5252'}
                            className="status-indicator"
                            style={{ opacity: nodeOpacity }}
                        />
                    </g>
                )}
            </g>
        </Tooltip>
    );
};

// SVG Definitions for gradients and filters
const SvgDefs = () => (
    <defs>
        {/* Team-based gradients */}
        <linearGradient id="ExecutiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#311188" />
            <stop offset="100%" stopColor="#1A0B4B" />
        </linearGradient>
        
        <linearGradient id="TechnicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2196F3" />
            <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
        
        <linearGradient id="OperationsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
        
        <linearGradient id="RecruitmentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4081" />
            <stop offset="100%" stopColor="#880E4F" />
        </linearGradient>
        
        <linearGradient id="MarketingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        
        <linearGradient id="FinanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9C27B0" />
            <stop offset="100%" stopColor="#4A148C" />
        </linearGradient>
        
        <linearGradient id="OtherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#607D8B" />
            <stop offset="100%" stopColor="#263238" />
        </linearGradient>

        {/* Filters */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>

        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2"/>
        </filter>
    </defs>
);

const CommunityConnect = () => {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(0.8);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        try {                       
            fetchEmployees();
            const handleScroll = () => setShowScrollTop(window.scrollY > 300);
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to load employees');
        } finally {
            setTimeout(() => {
                setInitialLoading(false);
            }, 500);
        }
    }, []);

    const getColorByTeam = (team, role) => {
        const teamColors = {
            'Executive': '#311188',
            'Technical': '#2196F3',
            'Operations': '#4CAF50',
            'Recruitment': '#FF4081',
            'Marketing': '#FF9800',
            'Finance': '#9C27B0',
            'Other': '#607D8B'
        };
        
        return teamColors[team] || teamColors.Other;
    };

    const processEmployeesData = (employees) => {
        // Find CEO
        const ceo = employees.find(emp => emp.role === 'CEO');
        if (!ceo) return null;

        // Group employees by project and team
        const projectGroups = {};
        const teamGroups = {};
        const benchEmployees = {};

        // Initialize team groups
        ['Executive', 'Operations', 'Recruitment', 'Technical', 'Finance', 'Marketing', 'Other'].forEach(team => {
            teamGroups[team] = [];
            benchEmployees[team] = [];
        });

        // Group employees
        employees.forEach(emp => {
            if (emp.role === 'CEO') return;

            if (emp.currentProject && emp.isTeamLead) {
                if (!projectGroups[emp.currentProject]) {
                    projectGroups[emp.currentProject] = {
                        lead: emp,
                        members: []
                    };
                }
            } else if (emp.currentProject && !emp.isTeamLead) {
                if (projectGroups[emp.currentProject]) {
                    projectGroups[emp.currentProject].members.push(emp);
                }
            } else if (emp.isOnBench && !['Executive', 'Operations', 'Recruitment'].includes(emp.team)) {
                benchEmployees[emp.team].push(emp);
            } else {
                teamGroups[emp.team].push(emp);
            }
        });

        const buildTeamHierarchy = (team) => {
            const teamMembers = [];

            // Add regular team members
            teamGroups[team].forEach(member => {
                teamMembers.push({
                    name: member.name,
                    data: {
                        ...member,
                        color: getColorByTeam(team, member.role)
                    },
                    children: []
                });
            });

            // Add project teams
            Object.values(projectGroups).forEach(project => {
                if (project.lead.team === team) {
                    teamMembers.push({
                        name: project.lead.name,
                        data: {
                            ...project.lead,
                            color: getColorByTeam(team, project.lead.role)
                        },
                        children: project.members.map(member => ({
                            name: member.name,
                            data: {
                                ...member,
                                color: getColorByTeam(team, member.role)
                            },
                            children: []
                        }))
                    });
                }
            });

            // Add bench employees
            if (benchEmployees[team].length > 0) {
                teamMembers.push({
                    name: "Bench Employees",
                    data: {
                        
                        name: "Bench Employees",
                        role: "Group",
                        team: team,
                        color: "#FFB74D",
                        isOnBench: true
                    },
                    children: benchEmployees[team].map(emp => ({
                        name: emp.name,
                        data: {
                            ...emp,
                            color: getColorByTeam(team, emp.role)
                        },
                        children: []
                    }))
                });
            }

            return teamMembers;
        };

        // Build the complete hierarchy with adjusted spacing
        const hierarchy = {
            name: ceo.name,
            data: {
                ...ceo,
                color: getColorByTeam('Executive', 'CEO')
            },
            children: ['Executive', 'Technical', 'Operations', 'Recruitment', 'Finance', 'Marketing', 'Other']
                .map(team => ({
                    name: team,
                    data: {
                        name: team,
                        role: 'Department',
                        team: team,
                        color: getColorByTeam(team),
                        isAvailable: true
                    },
                    children: buildTeamHierarchy(team)
                }))
                .filter(team => team.children.length > 0)
        };

        return hierarchy;
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BaseUrl}/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const processedData = processEmployeesData(response.data);
            setTreeData(processedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));
    const handleCenterTree = () => setTranslate({ x: 0, y: 0 });
    
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    if (initialLoading) {
        return <LoadingScreen />;
    }

    return (
        <PageContainer>
            <Container maxWidth="xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{
                        mb: 4,
                        p: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                        boxShadow: '0 10px 25px -5px rgba(49, 17, 136, 0.5)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                            }}
                            style={{
                                position: 'absolute',
                                top: -100,
                                right: -100,
                                width: 300,
                                height: 300,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                zIndex: 0
                            }}
                        />
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Community Connect
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                                Explore our organizational structure and connect with team members across different departments.
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>

                <TreeContainer>
                    <svg style={{ width: 0, height: 0 }}>
                        <SvgDefs />
                    </svg>
                    
                    {loading ? (
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CircularProgress />
                        </Box>
                    ) : treeData && (
                        <Tree
                            data={treeData}
                            orientation="vertical"
                            renderCustomNodeElement={CustomNode}
                            zoom={zoom}
                            translate={{ x: window.innerWidth / 3, y: 100 }}
                            separation={{ siblings: 2.5, nonSiblings: 3.5 }}
                            nodeSize={{ x: 350, y: 280 }}
                            pathFunc="step"
                            rootNodeClassName="node__root"
                            branchNodeClassName="node__branch"
                            leafNodeClassName="node__leaf"
                            pathClassFunc={() => 'tree-link'}
                            collapsible={true}
                            initialDepth={5}
                        />
                    )}

                    <Paper
                        elevation={3}
                        sx={{
                            position: 'absolute',
                            bottom: 24,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            p: 1,
                            borderRadius: 3,
                            display: 'flex',
                            gap: 1,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Tooltip title="Zoom In">
                            <IconButton onClick={handleZoomIn} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                <ZoomIn />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Zoom Out">
                            <IconButton onClick={handleZoomOut} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                <ZoomOut />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Center Tree">
                            <IconButton onClick={handleCenterTree} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                <CenterFocusStrong />
                            </IconButton>
                        </Tooltip>
                    </Paper>
                </TreeContainer>
            </Container>

            <Zoom in={showScrollTop}>
                <Box
                    onClick={scrollToTop}
                    role="presentation"
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        zIndex: 2,
                    }}
                >
                    <Tooltip title="Scroll to top">
                        <IconButton sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                            <ArrowUpward />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Zoom>
        </PageContainer>
    );
};

export default CommunityConnect; 