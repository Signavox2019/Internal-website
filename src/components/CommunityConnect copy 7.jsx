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
    Chip,
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
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const isRoleGroup = nodeDatum.data.isRoleGroup;
    
    // Calculate node size based on hierarchy level and role
    const nodeSize = nodeDatum.data.role === 'CEO' ? 60 : 
                    ['CTO', 'CMO'].includes(nodeDatum.data.role) ? 55 :
                    nodeDatum.data.role === 'Senior Manager' ? 50 :
                    nodeDatum.data.role === 'Manager' ? 45 :
                    nodeDatum.data.isTeamLead ? 42 :
                    isRoleGroup ? 40 : 35;

    return (
        <Tooltip 
            title={
                <Box sx={{ p: 1.5, maxWidth: 350 }}>
                    {!isRoleGroup ? (
                        <>
                            <Typography variant="h6" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                pb: 1
                            }}>
                                {nodeDatum.name}
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 1 }}>
                                {nodeDatum.data.empId && (
                                    <Typography variant="body2">
                                        <strong>Employee ID:</strong> {nodeDatum.data.empId}
                                    </Typography>
                                )}
                                {nodeDatum.data.email && (
                                    <Typography variant="body2">
                                        <strong>Email:</strong> {nodeDatum.data.email}
                                    </Typography>
                                )}
                                <Typography variant="body2">
                                    <strong>Role:</strong> {nodeDatum.data.role}
                                    {nodeDatum.data.isTeamLead && ' (Team Lead)'}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Team:</strong> {nodeDatum.data.team}
                                </Typography>
                                {nodeDatum.data.currentProject && (
                                    <Typography variant="body2">
                                        <strong>Current Project:</strong> {nodeDatum.data.currentProject.title}
                                    </Typography>
                                )}
                                {nodeDatum.data.experience && (
                                    <Typography variant="body2">
                                        <strong>Experience:</strong> {nodeDatum.data.experience}
                                    </Typography>
                                )}
                                {nodeDatum.data.skills?.length > 0 && (
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            <strong>Skills:</strong>
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {nodeDatum.data.skills.map((skill, index) => (
                                                <Chip
                                                    key={index}
                                                    label={`${skill.name} (${skill.level})`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                                        color: 'white',
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </>
                    ) : (
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {nodeDatum.name} ({nodeDatum.data.memberCount} members)
                        </Typography>
                    )}
                </Box>
            }
            placement="right"
            arrow
            TransitionComponent={Zoom}
        >
            <g onClick={hasChildren ? toggleNode : undefined} style={{ cursor: hasChildren ? 'pointer' : 'default' }}>
                {/* Fancy background effect */}
                <circle
                    r={nodeSize + 8}
                    fill={nodeDatum.data.gradient || `url(#${nodeDatum.data.team}Gradient)`}
                    opacity={0.3}
                    filter="url(#glow)"
                />

                {/* Main circle with gradient */}
                <circle
                    r={nodeSize}
                    fill={nodeDatum.data.gradient || `url(#${nodeDatum.data.team}Gradient)`}
                    stroke="white"
                    strokeWidth={2}
                    filter="url(#dropShadow)"
                />

                {/* Profile image or role icon */}
                <g transform={`translate(-${nodeSize/2}, -${nodeSize/2})`}>
                    <foreignObject width={nodeSize} height={nodeSize}>
                        <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: '8px'
                        }}>
                            {!isRoleGroup ? (
                                <img 
                                    src={nodeDatum.data.gender?.toLowerCase() === 'female' ? Woman : Man}
                                    alt={`${nodeDatum.data.gender} Employee`}
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        filter: 'brightness(0) invert(1)',
                                        opacity: 0.9
                                    }}
                                />
                            ) : (
                                getRoleIcon(nodeDatum.data.role, nodeDatum.data.gender)
                            )}
                        </div>
                    </foreignObject>
                </g>

                {/* Name label with background */}
                <g transform={`translate(0, ${nodeSize + 20})`}>
                    <rect
                        x={-60}
                        y={-10}
                        width={120}
                        height={20}
                        rx={10}
                        fill="rgba(255,255,255,0.9)"
                        filter="url(#dropShadow)"
                    />
                    <text
                        textAnchor="middle"
                        dy="0.3em"
                        style={{
                            fill: nodeDatum.data.color,
                            fontSize: isRoleGroup ? '12px' : '11px',
                            fontWeight: 'bold'
                        }}
                    >
                        {nodeDatum.name}
                        {isRoleGroup && ` (${nodeDatum.data.memberCount})`}
                    </text>
                </g>

                {/* Role label */}
                {!isRoleGroup && (
                    <text
                        dy={nodeSize + 40}
                        textAnchor="middle"
                        style={{
                            fill: '#666',
                            fontSize: '10px'
                        }}
                    >
                        {nodeDatum.data.role}
                        {nodeDatum.data.isTeamLead && ' (Lead)'}
                    </text>
                )}

                {/* Status indicator */}
                {!isRoleGroup && (
                    <circle
                        cx={nodeSize - 5}
                        cy={-nodeSize + 5}
                        r={4}
                        fill={nodeDatum.data.isAvailable ? '#4CAF50' : '#ff5252'}
                        stroke="white"
                        strokeWidth={1}
                        filter="url(#dropShadow)"
                    />
                )}

                {/* Expand/Collapse indicator */}
                {hasChildren && (
                    <g transform={`translate(${nodeSize + 5}, 0)`}>
                        <circle
                            r={10}
                            fill="white"
                            stroke={nodeDatum.data.color}
                            strokeWidth={2}
                            filter="url(#dropShadow)"
                        />
                        <text
                            textAnchor="middle"
                            dy="0.3em"
                            style={{
                                fill: nodeDatum.data.color,
                                fontSize: '14px',
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

        // Define team colors and gradients
        const teamColors = {
            'Executive': {
                primary: '#311188',
                secondary: '#1A0B4B',
                gradient: 'linear-gradient(135deg, #311188 0%, #1A0B4B 100%)'
            },
            'Technical': {
                primary: '#2196F3',
                secondary: '#0D47A1',
                gradient: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)'
            },
            'Marketing': {
                primary: '#FF9800',
                secondary: '#E65100',
                gradient: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)'
            }
        };

        // Build technical team hierarchy
        const buildTechnicalTeam = () => {
            const teamMembers = employees.filter(emp => emp.team === 'Technical');
            
            // Find Senior Manager
            const seniorManager = teamMembers.find(emp => emp.role === 'Senior Manager');
            
            // Find Managers
            const managers = teamMembers.filter(emp => emp.role === 'Manager');
            
            // Find Technical Team Lead (not project team lead)
            const teamLead = teamMembers.find(emp => 
                emp.role === 'Technical Team lead' && emp.isTeamLead
            );

            // Get all technical team members
            const techMembers = teamMembers.filter(emp => 
                !['Senior Manager', 'Manager', 'Technical Team lead'].includes(emp.role)
            );

            // Group members by role
            const roleGroups = {};
            techMembers.forEach(emp => {
                if (!roleGroups[emp.role]) {
                    roleGroups[emp.role] = [];
                }
                roleGroups[emp.role].push(emp);
            });

            // Create role nodes
            const roleNodes = Object.entries(roleGroups).map(([role, members]) => ({
                name: role,
                data: {
                    role,
                    team: 'Technical',
                    color: teamColors.Technical.primary,
                    isRoleGroup: true,
                    memberCount: members.length
                },
                children: members.map(member => ({
                    name: member.name,
                    data: {
                        ...member,
                        color: teamColors.Technical.primary,
                        gradient: teamColors.Technical.gradient
                    }
                }))
            }));

            // Build hierarchy
            if (seniorManager) {
                return [{
                    name: seniorManager.name,
                    data: {
                        ...seniorManager,
                        color: teamColors.Technical.primary,
                        gradient: teamColors.Technical.gradient
                    },
                    children: managers.map(manager => ({
                        name: manager.name,
                        data: {
                            ...manager,
                            color: teamColors.Technical.primary,
                            gradient: teamColors.Technical.gradient
                        },
                        children: teamLead ? [{
                            name: teamLead.name,
                            data: {
                                ...teamLead,
                                color: teamColors.Technical.primary,
                                gradient: teamColors.Technical.gradient
                            },
                            children: roleNodes
                        }] : roleNodes
                    }))
                }];
            }
            return [];
        };

        // Build marketing team hierarchy
        const buildMarketingTeam = () => {
            const teamMembers = employees.filter(emp => emp.team === 'Marketing');
            
            // Find Managers
            const managers = teamMembers.filter(emp => emp.role === 'Manager');
            
            // Find Marketing Team Lead
            const teamLead = teamMembers.find(emp => 
                emp.role === 'Marketing Team lead' && emp.isTeamLead
            );

            // Separate support and marketing members
            const supportMembers = teamMembers.filter(emp => 
                emp.role === 'Support' && !emp.isTeamLead
            );
            const marketingMembers = teamMembers.filter(emp => 
                !['Manager', 'Marketing Team lead', 'Support'].includes(emp.role)
            );

            // Create team nodes
            const teamNodes = [
                {
                    name: 'Support Team',
                    data: {
                        role: 'Support',
                        team: 'Marketing',
                        color: teamColors.Marketing.primary,
                        isRoleGroup: true,
                        memberCount: supportMembers.length
                    },
                    children: supportMembers.map(member => ({
                        name: member.name,
                        data: {
                            ...member,
                            color: teamColors.Marketing.primary,
                            gradient: teamColors.Marketing.gradient
                        }
                    }))
                },
                {
                    name: 'Marketing Team',
                    data: {
                        role: 'Marketing',
                        team: 'Marketing',
                        color: teamColors.Marketing.primary,
                        isRoleGroup: true,
                        memberCount: marketingMembers.length
                    },
                    children: marketingMembers.map(member => ({
                        name: member.name,
                        data: {
                            ...member,
                            color: teamColors.Marketing.primary,
                            gradient: teamColors.Marketing.gradient
                        }
                    }))
                }
            ];

            return managers.map(manager => ({
                name: manager.name,
                data: {
                    ...manager,
                    color: teamColors.Marketing.primary,
                    gradient: teamColors.Marketing.gradient
                },
                children: teamLead ? [{
                    name: teamLead.name,
                    data: {
                        ...teamLead,
                        color: teamColors.Marketing.primary,
                        gradient: teamColors.Marketing.gradient
                    },
                    children: teamNodes
                }] : teamNodes
            }));
        };

        // Find executive team
        const executives = employees.filter(emp => 
            ['CTO', 'CMO'].includes(emp.role)
        );

        // Create the hierarchy
        return {
            name: ceo.name,
            data: {
                ...ceo,
                color: teamColors.Executive.primary,
                gradient: teamColors.Executive.gradient
            },
            children: executives.map(exec => ({
                name: exec.name,
                data: {
                    ...exec,
                    color: teamColors[exec.role === 'CTO' ? 'Technical' : 'Marketing'].primary,
                    gradient: teamColors[exec.role === 'CTO' ? 'Technical' : 'Marketing'].gradient
                },
                children: exec.role === 'CTO' ? buildTechnicalTeam() : buildMarketingTeam()
            }))
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