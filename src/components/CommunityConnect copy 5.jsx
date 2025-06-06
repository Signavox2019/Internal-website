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
import Man from '../assets/bussiness-man.png';
import Woman from '../assets/businesswoman.png';

import {
    ZoomIn,
    ZoomOut,
    CenterFocusStrong,
    ArrowUpward,
    Transgender,
    BusinessCenter,
    Engineering,
    Code,
    Support,
    Campaign,
    AccountBalance,
    SupervisorAccount,
    AdminPanelSettings,
} from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import LoadingScreen from './LoadingScreen';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f3ff 100%)',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
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
    [theme.breakpoints.down('sm')]: {
        minHeight: '500px',
        borderRadius: theme.spacing(2),
    },
}));

const StyledControlPanel = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(1),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateX(-50%) translateY(-2px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
        gap: theme.spacing(0.5),
        borderRadius: theme.spacing(2),
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
        transform: 'scale(1.1)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    boxShadow: '0 10px 25px -5px rgba(49, 17, 136, 0.5)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        borderRadius: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
}));

const getRoleIcon = (role, gender) => {
    // First get the role-specific icon
    let RoleIcon;
    switch (role?.toLowerCase()) {
        case 'ceo':
            return <AdminPanelSettings sx={{ fontSize: 24, color: 'white' }} />;
        case 'cto':
        case 'developer':
        case 'devops':
            return <Code sx={{ fontSize: 24, color: 'white' }} />;
        case 'cfo':
            return <AccountBalance sx={{ fontSize: 24, color: 'white' }} />;
        case 'cmo':
            return <Campaign sx={{ fontSize: 24, color: 'white' }} />;
        case 'coo':
        case 'chro':
            return <BusinessCenter sx={{ fontSize: 24, color: 'white' }} />;
        case 'hr':
        case 'manager':
            return <SupervisorAccount sx={{ fontSize: 24, color: 'white' }} />;
        case 'ui/ux':
        case 'testing':
            return <Engineering sx={{ fontSize: 24, color: 'white' }} />;
        case 'support':
        case 'bde':
            return <Support sx={{ fontSize: 24, color: 'white' }} />;
        default:
            // For other roles, use gender-based images
            switch (gender?.toLowerCase()) {
                case 'male':
                    return <img 
                        src={Man} 
                        alt="Male Employee" 
                        style={{ 
                            width: '40px', 
                            height: '40px',
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(1)', // Makes the image white
                            opacity: 0.9
                        }} 
                    />;
                case 'female':
                    return <img 
                        src={Woman} 
                        alt="Female Employee" 
                        style={{ 
                            width: '40px', 
                            height: '40px',
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(1)', // Makes the image white
                            opacity: 0.9
                        }} 
                    />;
                default:
                    return <Transgender sx={{ fontSize: 24, color: 'white' }} />;
            }
    }
};

const CustomNode = ({ nodeDatum, toggleNode }) => {
    const isLeaf = !nodeDatum.children || nodeDatum.children.length === 0;
    const nodeSize = nodeDatum.data.role === 'CEO' ? 50 : 
                    ['CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(nodeDatum.data.role) ? 45 :
                    nodeDatum.data.role === 'Senior Manager' ? 40 :
                    nodeDatum.data.role === 'Manager' ? 38 :
                    nodeDatum.data.isTeamLead ? 35 : 32;
    
    const isOnBench = nodeDatum.data.isOnBench && nodeDatum.data.team === 'Technical';
    const isTeamLead = nodeDatum.data.isTeamLead;
    const isExecutive = ['CEO', 'CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(nodeDatum.data.role);
    const isSeniorManager = nodeDatum.data.role === 'Senior Manager';
    const isManager = nodeDatum.data.role === 'Manager';
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;

    // Calculate opacity based on bench status
    const nodeOpacity = isOnBench ? 0.7 : 1;
    
    return (
        <Tooltip 
            title={
                <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {nodeDatum.data.name}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {nodeDatum.data.role}
                        {isTeamLead && ' (Team Lead)'}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Team: {nodeDatum.data.team}
                    </Typography>
                    {nodeDatum.data.experience && (
                        <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Experience: {nodeDatum.data.experience}
                        </Typography>
                    )}
                    {nodeDatum.data.skills?.length > 0 && (
                        <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Skills: {nodeDatum.data.skills.map(s => s.name).join(', ')}
                        </Typography>
                    )}
                    {nodeDatum.data.certifications?.length > 0 && (
                        <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Certifications: {nodeDatum.data.certifications.length}
                        </Typography>
                    )}
                    <Typography variant="caption" display="block" 
                        sx={{ 
                            color: nodeDatum.data.isAvailable ? '#4CAF50' : '#ff5252',
                            fontWeight: 'bold',
                            mt: 0.5
                        }}>
                        {nodeDatum.data.isAvailable ? '● Available' : '● Busy'}
                    </Typography>
                </div>
            }
            placement="right"
            arrow
        >
            <g onClick={hasChildren ? toggleNode : undefined} style={{ cursor: hasChildren ? 'pointer' : 'default' }}>
                {/* Background for special nodes */}
                {(isOnBench || isTeamLead || isExecutive || isSeniorManager || isManager) && (
                    <rect
                        x={-150}
                        y={-50}
                        width={300}
                        height={200}
                        rx={15}
                        ry={15}
                        fill={
                            isExecutive ? 'rgba(49, 17, 136, 0.1)' :
                            isSeniorManager ? 'rgba(33, 150, 243, 0.1)' :
                            isManager ? 'rgba(76, 175, 80, 0.1)' :
                            isTeamLead ? 'rgba(255, 152, 0, 0.1)' :
                            'rgba(255, 244, 229, 0.7)'
                        }
                        stroke={
                            isExecutive ? '#311188' :
                            isSeniorManager ? '#2196F3' :
                            isManager ? '#4CAF50' :
                            isTeamLead ? '#FF9800' :
                            '#FFB74D'
                        }
                        strokeWidth={2}
                        strokeDasharray={isOnBench ? "5,5" : "none"}
                        className="special-background"
                        style={{ opacity: nodeOpacity }}
                    />
                )}
                
                {/* Node circle with gradient */}
                <circle
                    r={nodeSize + 5}
                    fill={`url(#${nodeDatum.data.team?.replace('/', '')}Gradient)`}
                    className="node-glow"
                    style={{ opacity: nodeOpacity * 0.6 }}
                />
                
                {/* Main circle */}
                <circle
                    r={nodeSize}
                    fill={nodeDatum.data.color}
                    stroke={
                        isExecutive ? '#311188' :
                        isSeniorManager ? '#2196F3' :
                        isManager ? '#4CAF50' :
                        isTeamLead ? '#FF9800' :
                        isOnBench ? '#FFB74D' : 'white'
                    }
                    strokeWidth={3}
                    className="node-main"
                    style={{ opacity: nodeOpacity }}
                />

                {/* Profile image or gender-based icon */}
                <g transform={`translate(-${nodeSize}, -${nodeSize})`}>
                    <foreignObject width={nodeSize * 2} height={nodeSize * 2}>
                        <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            transform: 'scale(1.2)',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}>
                            {nodeDatum.data.profileImage ? (
                                <image
                                    href={nodeDatum.data.profileImage}
                                    width={nodeSize * 2}
                                    height={nodeSize * 2}
                                    style={{
                                        clipPath: 'circle(50%)',
                                        opacity: nodeOpacity
                                    }}
                                />
                            ) : (
                                <img 
                                    src={nodeDatum.data.gender === 'Male' ? Man : Woman}
                                    alt={`${nodeDatum.data.gender} Employee`}
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        filter: 'brightness(0) invert(1)',
                                        opacity: 0.9
                                    }}
                                />
                            )}
                        </div>
                    </foreignObject>
                </g>

                {/* Info card */}
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
                        filter="url(#dropShadow)"
                    />

                    {/* Team indicator with gradient */}
                    <rect
                        x="0"
                        y="0"
                        width="240"
                        height="25"
                        rx="12"
                        ry="12"
                        fill={`url(#${nodeDatum.data.team?.replace('/', '')}Gradient)`}
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

                    {/* Status indicator with glow effect */}
                    <circle
                        cx="225"
                        cy="15"
                        r="5"
                        fill={nodeDatum.data.isAvailable ? '#4CAF50' : '#ff5252'}
                        className="status-indicator"
                        style={{ opacity: nodeOpacity }}
                        filter="url(#glow)"
                    />
                </g>

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
            </g>
        </Tooltip>
    );
};

// SVG Definitions for gradients and filters
const SvgDefs = () => (
    <defs>
        {/* Team-based gradients with enhanced colors */}
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

        {/* Enhanced glow effect */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feFlood floodColor="#ffffff" floodOpacity="0.3" result="glowColor" />
            <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow" />
            <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        {/* Enhanced drop shadow */}
        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="4" />
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        {/* Card shadow */}
        <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" />
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        {/* Node highlight effect */}
        <filter id="nodeHighlight">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            <feColorMatrix type="matrix" values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 15 -6
            "/>
        </filter>
    </defs>
);

// Add CSS styles for tree links
const treeStyles = `
    .tree-link {
        stroke: rgba(49, 17, 136, 0.2);
        stroke-width: 2;
        fill: none;
        transition: all 0.3s ease;
    }

    .tree-link:hover {
        stroke: rgba(49, 17, 136, 0.4);
        stroke-width: 3;
    }

    .node__root circle {
        filter: url(#nodeHighlight);
    }

    .node__branch circle {
        transition: all 0.3s ease;
    }

    .node__branch:hover circle {
        filter: url(#nodeHighlight);
        transform: scale(1.1);
    }

    .node__leaf circle {
        transition: all 0.3s ease;
    }

    .node__leaf:hover circle {
        filter: url(#nodeHighlight);
        transform: scale(1.1);
    }
`;

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

        // Define team colors for executives and roles
        const teamColors = {
            'Technical': '#2196F3',    // Blue for Technical team
            'Finance': '#9C27B0',      // Purple for Finance team
            'Operations': '#4CAF50',    // Green for Operations team
            'Marketing': '#FF9800',     // Orange for Marketing team
            'Executive': '#311188',     // Deep purple for Executive team
            'Senior Manager': {
                'Technical': '#1976D2',  // Darker blue for Technical Senior Manager
                'Finance': '#7B1FA2',    // Darker purple for Finance Senior Manager
                'Operations': '#388E3C',  // Darker green for Operations Senior Manager
                'Marketing': '#F57C00'    // Darker orange for Marketing Senior Manager
            },
            'Manager': {
                'Technical': '#42A5F5',   // Light blue for Technical Manager
                'Finance': '#AB47BC',     // Light purple for Finance Manager
                'Operations': '#66BB6A',   // Light green for Operations Manager
                'Marketing': '#FFA726'     // Light orange for Marketing Manager
            },
            'Team Lead': {
                'Technical': '#64B5F6',   // Even lighter blue for Technical Team Lead
                'Finance': '#BA68C8',     // Light purple for Finance Team Lead
                'Operations': '#81C784',   // Light green for Operations Team Lead
                'Marketing': '#FFB74D'     // Light orange for Marketing Team Lead
            },
            'Developer': '#90CAF9',     // Pale blue for Developers
            'DevOps': '#81D4FA',        // Light cyan for DevOps
            'UI/UX': '#80DEEA',         // Cyan for UI/UX
            'Testing': '#B3E5FC',       // Very light blue for Testing
            'On Bench': '#FFB74D',      // Orange for On Bench members
            'Finance Team': '#CE93D8',   // Light purple for Finance team members
            'Operations Team': {
                'HR': '#A5D6A7',        // Light green for HR
                'Support': '#C8E6C9',    // Lighter green for Support
                'Admin': '#B2DFDB',      // Mint green for Admin
                'Other': '#E8F5E9'       // Very light green for other roles
            },
            'Marketing Team': {
                'BDE': '#FFCC80',       // Light orange for BDE
                'Support': '#FFE0B2',    // Lighter orange for Support
                'Other': '#FFF3E0'       // Very light orange for other roles
            }
        };

        // Map executive roles to their teams
        const executiveTeamMap = {
            'CTO': { team: 'Technical', title: 'Chief Technology Officer' },
            'CFO': { team: 'Finance', title: 'Chief Financial Officer' },
            'COO': { team: 'Operations', title: 'Chief Operations Officer' },
            'CMO': { team: 'Marketing', title: 'Chief Marketing Officer' }
        };

        // Build marketing team hierarchy
        const buildMarketingTeam = () => {
            // Get Marketing Managers
            const managers = employees.filter(emp =>
                emp.team === 'Marketing' &&
                emp.role === 'Manager'
            ).map(manager => {
                // Create Marketing Team Lead node (BDE)
                const marketingTeamLead = {
                    name: "Marketing Team Lead",
                    data: {
                        role: "BDE",
                        team: "Marketing",
                        isTeamLead: true,
                        color: teamColors['Team Lead']['Marketing'],
                        title: 'Business Development Team Lead'
                    },
                    children: []
                };

                // Get support team members
                const supportMembers = employees.filter(emp =>
                    emp.team === 'Marketing' &&
                    emp.role === 'Support' &&
                    !emp.isTeamLead
                ).map(member => ({
                    name: member.name,
                    data: {
                        ...member,
                        color: teamColors['Marketing Team']['Support'],
                        title: 'Marketing Support Specialist',
                        experience: member.experience || '0 years',
                        skills: member.skills || []
                    },
                    children: []
                }));

                // Create Support Team node
                const supportTeam = {
                    name: 'Marketing Support Team',
                    data: {
                        role: 'Support',
                        color: teamColors['Marketing Team']['Support'],
                        team: 'Marketing',
                        title: 'Marketing Support Team'
                    },
                    children: supportMembers
                };

                // Get BDE team members
                const bdeMembers = employees.filter(emp =>
                    emp.team === 'Marketing' &&
                    emp.role === 'BDE' &&
                    !emp.isTeamLead
                ).map(member => ({
                    name: member.name,
                    data: {
                        ...member,
                        color: teamColors['Marketing Team']['BDE'],
                        title: 'Business Development Executive',
                        experience: member.experience || '0 years',
                        skills: member.skills || []
                    },
                    children: []
                }));

                // Create BDE Team node
                const bdeTeam = {
                    name: 'Business Development Team',
                    data: {
                        role: 'BDE',
                        color: teamColors['Marketing Team']['BDE'],
                        team: 'Marketing',
                        title: 'Business Development Team'
                    },
                    children: bdeMembers
                };

                // Add other marketing team members
                const otherMembers = employees.filter(emp =>
                    emp.team === 'Marketing' &&
                    !emp.isTeamLead &&
                    !['Manager', 'Support', 'BDE'].includes(emp.role)
                ).map(member => ({
                    name: member.name,
                    data: {
                        ...member,
                        color: teamColors['Marketing Team']['Other'],
                        title: member.role,
                        experience: member.experience || '0 years',
                        skills: member.skills || []
                    },
                    children: []
                }));

                // Add teams to Team Lead's children
                marketingTeamLead.children = [
                    bdeTeam,
                    supportTeam,
                    ...(otherMembers.length > 0 ? [{
                        name: 'Other Marketing Staff',
                        data: {
                            role: 'Other',
                            color: teamColors['Marketing Team']['Other'],
                            team: 'Marketing',
                            title: 'Marketing Staff'
                        },
                        children: otherMembers
                    }] : [])
                ];

                return {
                    name: manager.name,
                    data: {
                        ...manager,
                        color: teamColors['Manager']['Marketing'],
                        title: 'Marketing Manager'
                    },
                    children: [marketingTeamLead]
                };
            });

            return managers;
        };

        // Build operations team hierarchy
        const buildOperationsTeam = () => {
            // Get Operations Managers
            const managers = employees.filter(emp =>
                emp.team === 'Operations' &&
                emp.role === 'Manager'
            ).map(manager => {
                // Get HR Managers under Operations Manager
                const hrManagers = employees.filter(emp =>
                    emp.team === 'Operations' &&
                    emp.role === 'HR'
                ).map(hrManager => {
                    // Create Operations Team Lead node
                    const operationsTeamLead = {
                        name: "Operations Team Lead",
                        data: {
                            role: "Team Lead",
                            team: "Operations",
                            isTeamLead: true,
                            color: teamColors['Team Lead']['Operations'],
                            title: 'Operations Team Lead'
                        },
                        children: []
                    };

                    // Get operations team members by role
                    const getTeamMembersByRole = (role) => {
                        return employees.filter(emp =>
                            emp.team === 'Operations' &&
                            !emp.isTeamLead &&
                            emp.role === role &&
                            emp.role !== 'Manager' &&
                            emp.role !== 'HR'
                        ).map(member => ({
                            name: member.name,
                            data: {
                                ...member,
                                color: teamColors['Operations Team'][role] || teamColors['Operations Team']['Other'],
                                title: `${role} Specialist`,
                                experience: member.experience || '0 years',
                                skills: member.skills || []
                            },
                            children: []
                        }));
                    };

                    // Create role-based teams
                    const roleTeams = ['Support', 'Admin'].map(role => {
                        const roleMembers = getTeamMembersByRole(role);
                        if (roleMembers.length > 0) {
                            return {
                                name: `${role} Team`,
                                data: {
                                    role: role,
                                    color: teamColors['Operations Team'][role],
                                    team: 'Operations',
                                    title: `${role} Team`
                                },
                                children: roleMembers
                            };
                        }
                        return null;
                    }).filter(Boolean);

                    // Add other operations team members
                    const otherMembers = employees.filter(emp =>
                        emp.team === 'Operations' &&
                        !emp.isTeamLead &&
                        !['Manager', 'HR', 'Support', 'Admin'].includes(emp.role)
                    ).map(member => ({
                        name: member.name,
                        data: {
                            ...member,
                            color: teamColors['Operations Team']['Other'],
                            title: member.role,
                            experience: member.experience || '0 years',
                            skills: member.skills || []
                        },
                        children: []
                    }));

                    if (otherMembers.length > 0) {
                        roleTeams.push({
                            name: 'Other Operations Staff',
                            data: {
                                role: 'Other',
                                color: teamColors['Operations Team']['Other'],
                                team: 'Operations',
                                title: 'Operations Staff'
                            },
                            children: otherMembers
                        });
                    }

                    operationsTeamLead.children = roleTeams;

                    return {
                        name: hrManager.name,
                        data: {
                            ...hrManager,
                            color: teamColors['Operations Team']['HR'],
                            title: 'HR Manager'
                        },
                        children: [operationsTeamLead]
                    };
                });

                return {
                    name: manager.name,
                    data: {
                        ...manager,
                        color: teamColors['Manager']['Operations'],
                        title: 'Operations Manager'
                    },
                    children: hrManagers
                };
            });

            return managers;
        };

        // Build technical team hierarchy
        const buildTechnicalTeam = () => {
            // Get Senior Managers in Technical team
            const seniorManagers = employees.filter(emp => 
                emp.team === 'Technical' && 
                emp.role === 'Senior Manager'
            ).map(senior => {
                // Get Managers under this Senior Manager
                const managers = employees.filter(emp =>
                    emp.team === 'Technical' &&
                    emp.role === 'Manager'
                ).map(manager => {
                    // Create Rahiman's team lead node
                    const rahimanTeamLead = {
                        name: "Rahiman",
                        data: {
                            name: "Rahiman",
                            role: "Team Lead",
                            team: "Technical",
                            isTeamLead: true,
                            color: teamColors['Team Lead']['Technical'],
                            title: 'Technical Team Lead'
                        },
                        children: []
                    };

                    // Get all technical team members
                    const allTeamMembers = employees.filter(emp =>
                        emp.team === 'Technical' &&
                        !emp.isTeamLead &&
                        ['Developer', 'DevOps', 'UI/UX', 'Testing'].includes(emp.role)
                    );

                    // Separate active and bench members
                    const activeTeamMembers = allTeamMembers.filter(emp => !emp.isOnBench);
                    const benchTeamMembers = allTeamMembers.filter(emp => emp.isOnBench);

                    // Create nodes for each role
                    const createTeamNode = (role, members) => ({
                        name: `${role} Team`,
                        data: {
                            role: role,
                            color: teamColors[role],
                            team: 'Technical',
                            title: `${role} Team`
                        },
                        children: members.map(member => ({
                            name: member.name,
                            data: {
                                ...member,
                                color: teamColors[role],
                                title: member.role,
                                experience: member.experience || '0 years',
                                skills: member.skills || []
                            },
                            children: []
                        }))
                    });

                    // Create active role teams
                    const roleTeams = ['Developer', 'DevOps', 'UI/UX', 'Testing'].map(role => {
                        const roleMembers = activeTeamMembers.filter(member => member.role === role);
                        if (roleMembers.length > 0) {
                            return createTeamNode(role, roleMembers);
                        }
                        return null;
                    }).filter(Boolean);

                    // Create bench team if there are bench members
                    if (benchTeamMembers.length > 0) {
                        const benchTeams = ['Developer', 'DevOps', 'UI/UX', 'Testing'].map(role => {
                            const benchRoleMembers = benchTeamMembers.filter(member => member.role === role);
                            if (benchRoleMembers.length > 0) {
                                return {
                                    name: `${role} (On Bench)`,
                                    data: {
                                        role: role,
                                        color: teamColors['On Bench'],
                                        team: 'Technical',
                                        title: `${role} Team (On Bench)`,
                                        isOnBench: true
                                    },
                                    children: benchRoleMembers.map(member => ({
                                        name: member.name,
                                        data: {
                                            ...member,
                                            color: teamColors['On Bench'],
                                            title: `${member.role} (On Bench)`,
                                            experience: member.experience || '0 years',
                                            skills: member.skills || []
                                        },
                                        children: []
                                    }))
                                };
                            }
                            return null;
                        }).filter(Boolean);

                        rahimanTeamLead.children = [...roleTeams, ...benchTeams];
                    } else {
                        rahimanTeamLead.children = roleTeams;
                    }

                    return {
                        name: manager.name,
                        data: {
                            ...manager,
                            color: teamColors['Manager']['Technical'],
                            title: 'Technical Manager'
                        },
                        children: [rahimanTeamLead]
                    };
                });

                return {
                    name: senior.name,
                    data: {
                        ...senior,
                        color: teamColors['Senior Manager']['Technical'],
                        title: 'Senior Technical Manager'
                    },
                    children: managers
                };
            });

            return seniorManagers;
        };

        // Build finance team hierarchy
        const buildFinanceTeam = () => {
            // Get Senior Managers in Finance team
            const seniorManagers = employees.filter(emp => 
                emp.team === 'Finance' && 
                emp.role === 'Senior Manager'
            ).map(senior => {
                // Get Managers under this Senior Manager
                const managers = employees.filter(emp =>
                    emp.team === 'Finance' &&
                    emp.role === 'Manager'
                ).map(manager => {
                    // Create Finance Team Lead node
                    const financeTeamLead = {
                        name: "Finance Team Lead",
                        data: {
                            role: "Team Lead",
                            team: "Finance",
                            isTeamLead: true,
                            color: teamColors['Team Lead']['Finance'],
                            title: 'Finance Team Lead'
                        },
                        children: []
                    };

                    // Get finance team members
                    const teamMembers = employees.filter(emp =>
                        emp.team === 'Finance' &&
                        !emp.isTeamLead &&
                        emp.role !== 'Senior Manager' &&
                        emp.role !== 'Manager'
                    ).map(member => ({
                        name: member.name,
                        data: {
                            ...member,
                            color: teamColors['Finance Team'],
                            title: member.role,
                            experience: member.experience || '0 years',
                            skills: member.skills || []
                        },
                        children: []
                    }));

                    financeTeamLead.children = teamMembers;

                    return {
                        name: manager.name,
                        data: {
                            ...manager,
                            color: teamColors['Manager']['Finance'],
                            title: 'Finance Manager'
                        },
                        children: [financeTeamLead]
                    };
                });

                return {
                    name: senior.name,
                    data: {
                        ...senior,
                        color: teamColors['Senior Manager']['Finance'],
                        title: 'Senior Finance Manager'
                    },
                    children: managers
                };
            });

            return seniorManagers;
        };

        // Find executive team members
        const executives = employees.filter(emp => 
            ['CTO', 'CFO', 'CMO', 'COO'].includes(emp.role)
        );

        // Create the hierarchy
        const hierarchy = {
            name: ceo.name,
            data: {
                ...ceo,
                color: teamColors.Executive,
                title: 'Chief Executive Officer',
                team: 'Executive'
            },
            children: executives.map(exec => {
                const teamInfo = executiveTeamMap[exec.role];
                return {
                    name: exec.name,
                    data: {
                        ...exec,
                        color: teamColors[teamInfo.team],
                        title: teamInfo.title,
                        team: teamInfo.team
                    },
                    children: exec.role === 'CTO' ? buildTechnicalTeam() :
                             exec.role === 'CFO' ? buildFinanceTeam() :
                             exec.role === 'COO' ? buildOperationsTeam() :
                             exec.role === 'CMO' ? buildMarketingTeam() : []
                };
            })
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
            <style>{treeStyles}</style>
            <Container maxWidth="xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <StyledHeader>
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
                        <motion.div
                            animate={{
                                y: [0, 10, 0],
                                transition: { duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }
                            }}
                            style={{
                                position: 'absolute',
                                bottom: -80,
                                left: -80,
                                width: 200,
                                height: 200,
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
                                View team hierarchies, roles, and current project assignments in an interactive tree view.
                            </Typography>
                        </Box>
                    </StyledHeader>
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
                            separation={{ siblings: 3, nonSiblings: 4 }}
                            nodeSize={{ x: 400, y: 300 }}
                            pathFunc="step"
                            rootNodeClassName="node__root"
                            branchNodeClassName="node__branch"
                            leafNodeClassName="node__leaf"
                            pathClassFunc={() => 'tree-link'}
                            collapsible={true}
                            initialDepth={1}
                            zoomable={true}
                            onNodeClick={(nodeData) => {
                                // Expand/collapse on click
                                if (nodeData.children) {
                                    toggleNode(nodeData);
                                }
                            }}
                            styles={{
                                links: {
                                    stroke: '#311188',
                                    strokeWidth: '2px',
                                    strokeOpacity: 0.3
                                }
                            }}
                        />
                    )}

                    <StyledControlPanel>
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
                    </StyledControlPanel>
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