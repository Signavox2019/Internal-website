import React, { useState, useEffect } from 'react';
import '../styles/CommunityConnect.css';
import {
    Box,
    Container,
    Typography,
    Paper,
    Avatar,
    Chip,
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
    Person,
    Business,
    Group,
    AccountTree,
    ZoomIn,
    ZoomOut,
    CenterFocusStrong,
    ArrowUpward,
    Search,
    Engineering,
    Code,
    Support as SupportIcon,
    AttachMoney,
    Campaign,
} from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';

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
    const nodeSize = nodeDatum.data.role === 'CEO' ? 40 : 30;
    
    return (
        <g>
            {/* Glow effect */}
            <circle
                r={nodeSize + 5}
                fill={`url(#${nodeDatum.data.team}Gradient)`}
                filter="url(#glow)"
                opacity={0.6}
            />
            
            {/* Main circle */}
            <circle
                r={nodeSize}
                fill={nodeDatum.data.color}
                stroke="white"
                strokeWidth="2"
                filter="url(#dropShadow)"
            />
            
            {/* Profile image or fallback */}
            <image
                href={nodeDatum.data.profileImage || ''}
                x={-nodeSize + 5}
                y={-nodeSize + 5}
                width={nodeSize * 2 - 10}
                height={nodeSize * 2 - 10}
                clipPath={`circle(${nodeSize - 5}px at center)`}
                style={{ opacity: nodeDatum.data.profileImage ? 1 : 0 }}
            />
            
            {!nodeDatum.data.profileImage && (
                <text
                    textAnchor="middle"
                    dy="0.3em"
                    style={{ fill: 'white', fontSize: `${nodeSize/2}px`, fontWeight: 'bold' }}
                >
                    {nodeDatum.data.name?.charAt(0) || '?'}
                </text>
            )}

            {/* Info card */}
            <g transform={`translate(-120, ${nodeSize + 10})`}>
                <rect
                    width="240"
                    height="100"
                    rx="12"
                    ry="12"
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke={nodeDatum.data.color}
                    strokeWidth="2"
                    filter="url(#cardShadow)"
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
                    opacity={0.9}
                />
                
                <text style={{ fontSize: '14px' }}>
                    <tspan x="120" y="17" textAnchor="middle" style={{ fill: 'white', fontWeight: 'bold' }}>
                        {nodeDatum.data.team}
                    </tspan>
                    <tspan x="120" y="45" textAnchor="middle" style={{ fontWeight: 'bold', fill: '#333' }}>
                        {nodeDatum.data.name}
                    </tspan>
                    <tspan x="120" y="65" textAnchor="middle" style={{ fill: '#666' }}>
                        {nodeDatum.data.role}
                    </tspan>
                    <tspan x="120" y="85" textAnchor="middle" style={{ fill: '#888', fontSize: '12px' }}>
                        {nodeDatum.data.employeeId}
                    </tspan>
                </text>

                {/* Status indicator */}
                <circle
                    cx="225"
                    cy="15"
                    r="5"
                    fill={nodeDatum.data.isAvailable ? '#4CAF50' : '#ff5252'}
                />
            </g>
        </g>
    );
};

// SVG Definitions for gradients and filters
const SvgDefs = () => (
    <defs>
        <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        
        <filter id="dropShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>

        <filter id="cardShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2"/>
        </filter>

        <linearGradient id="TechnicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2196F3"/>
            <stop offset="100%" stopColor="#311188"/>
        </linearGradient>

        <linearGradient id="OperationsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50"/>
            <stop offset="100%" stopColor="#1B5E20"/>
        </linearGradient>

        <linearGradient id="MarketingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9800"/>
            <stop offset="100%" stopColor="#E65100"/>
        </linearGradient>

        <linearGradient id="FinanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9C27B0"/>
            <stop offset="100%" stopColor="#4A148C"/>
        </linearGradient>
    </defs>
);

const ControlPanel = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(3),
    left: '50%',
    transform: 'translateX(-50%)',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(1),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    color: 'white',
    '&:hover': {
        background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
    },
}));

const CommunityConnect = () => {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(0.8);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    useEffect(() => {
        fetchEmployees();
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getColorByTeam = (team, role) => {
        const teamColors = {
            'Technical': '#2196F3',
            'Operations': '#4CAF50',
            'Marketing': '#FF9800',
            'Finance': '#9C27B0',
            'Other': '#607D8B'
        };
        
        // Special colors for top management
        if (['CEO', 'CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(role)) {
            return '#311188';
        }
        
        return teamColors[team] || teamColors.Other;
    };

    const processEmployeesData = (employees) => {
        // Find CEO
        const ceo = employees.find(emp => emp.role === 'CEO');
        if (!ceo) return null;

        const buildTeamHierarchy = (leader, team) => {
            const teamMembers = employees.filter(emp => 
                emp.team === team && 
                emp.role !== leader.role &&
                !['CEO', 'CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(emp.role)
            );

            return teamMembers.map(member => ({
                name: member.name,
                data: {
                    ...member,
                    color: getColorByTeam(member.team, member.role)
                },
                children: []
            }));
        };

        const buildExecutiveTeam = (ceo) => {
            const executives = employees.filter(emp => 
                ['CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(emp.role)
            );

            return executives.map(exec => {
                const team = {
                    'CTO': 'Technical',
                    'CFO': 'Finance',
                    'CMO': 'Marketing',
                    'COO': 'Operations',
                    'CHRO': 'Operations'
                }[exec.role];

                return {
                    name: exec.name,
                    data: {
                        ...exec,
                        color: getColorByTeam(team, exec.role)
                    },
                    children: buildTeamHierarchy(exec, team)
                };
            });
        };

        return {
            name: ceo.name,
            data: {
                ...ceo,
                color: getColorByTeam(null, 'CEO')
            },
            children: buildExecutiveTeam(ceo)
        };
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
                            separation={{ siblings: 2.5, nonSiblings: 3 }}
                            nodeSize={{ x: 300, y: 200 }}
                            pathFunc="step"
                            rootNodeClassName="node__root"
                            branchNodeClassName="node__branch"
                            leafNodeClassName="node__leaf"
                            pathClassFunc={() => 'tree-link'}
                        />
                    )}

                    <ControlPanel>
                        <Tooltip title="Zoom In">
                            <StyledIconButton onClick={handleZoomIn}>
                                <ZoomIn />
                            </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Zoom Out">
                            <StyledIconButton onClick={handleZoomOut}>
                                <ZoomOut />
                            </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Center Tree">
                            <StyledIconButton onClick={handleCenterTree}>
                                <CenterFocusStrong />
                            </StyledIconButton>
                        </Tooltip>
                    </ControlPanel>
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
                        <StyledIconButton>
                            <ArrowUpward />
                        </StyledIconButton>
                    </Tooltip>
                </Box>
            </Zoom>
        </PageContainer>
    );
};

export default CommunityConnect; 