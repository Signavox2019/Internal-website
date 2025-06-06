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

        // Group executives
        const executives = employees.filter(emp => 
            ['CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(emp.role)
        );

        // Group by department and hierarchy
        const departmentGroups = {
            Technical: {
                seniors: employees.filter(emp => emp.team === 'Technical' && emp.role === 'Senior Manager'),
                managers: employees.filter(emp => emp.team === 'Technical' && emp.role === 'Manager'),
                teamLeads: employees.filter(emp => emp.team === 'Technical' && emp.isTeamLead),
                developers: employees.filter(emp => emp.team === 'Technical' && emp.role === 'Developer' && !emp.isTeamLead),
                devops: employees.filter(emp => emp.team === 'Technical' && emp.role === 'DevOps' && !emp.isTeamLead),
                uiux: employees.filter(emp => emp.team === 'Technical' && emp.role === 'UI/UX' && !emp.isTeamLead),
                testing: employees.filter(emp => emp.team === 'Technical' && emp.role === 'Testing' && !emp.isTeamLead),
                onBench: employees.filter(emp => emp.team === 'Technical' && emp.isOnBench && !emp.isTeamLead)
            },
            Operations: {
                seniors: employees.filter(emp => emp.team === 'Operations' && emp.role === 'Senior Manager'),
                managers: employees.filter(emp => emp.team === 'Operations' && emp.role === 'Manager'),
                staff: employees.filter(emp => emp.team === 'Operations' && !['Senior Manager', 'Manager'].includes(emp.role))
            },
            Finance: {
                seniors: employees.filter(emp => emp.team === 'Finance' && emp.role === 'Senior Manager'),
                managers: employees.filter(emp => emp.team === 'Finance' && emp.role === 'Manager'),
                staff: employees.filter(emp => emp.team === 'Finance' && !['Senior Manager', 'Manager'].includes(emp.role))
            },
            Marketing: {
                seniors: employees.filter(emp => emp.team === 'Marketing' && emp.role === 'Senior Manager'),
                managers: employees.filter(emp => emp.team === 'Marketing' && emp.role === 'Manager'),
                staff: employees.filter(emp => emp.team === 'Marketing' && !['Senior Manager', 'Manager'].includes(emp.role))
            },
            Executive: {
                seniors: [],
                managers: [],
                staff: employees.filter(emp => emp.team === 'Executive' && !['CEO', 'CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(emp.role))
            }
        };

        // Build hierarchy for technical team
        const buildTechnicalHierarchy = (teamLead) => {
            const teamMembers = [];
            
            // Add developers under team lead
            departmentGroups.Technical.developers
                .filter(dev => dev.currentProject === teamLead.currentProject)
                .forEach(dev => {
                    teamMembers.push({
                        name: dev.name,
                        data: {
                            ...dev,
                            color: getColorByTeam('Technical', dev.role)
                        },
                        children: []
                    });
                });

            // Add other roles under team lead
            ['devops', 'uiux', 'testing'].forEach(role => {
                departmentGroups.Technical[role]
                    .filter(member => member.currentProject === teamLead.currentProject)
                    .forEach(member => {
                        teamMembers.push({
                            name: member.name,
                            data: {
                                ...member,
                                color: getColorByTeam('Technical', member.role)
                            },
                            children: []
                        });
                    });
            });

            return teamMembers;
        };

        // Build department hierarchy
        const buildDepartmentHierarchy = (department) => {
            // If department doesn't exist in departmentGroups, return empty array
            if (!departmentGroups[department]) {
                return [];
            }

            const departmentMembers = [];
            const deptGroup = departmentGroups[department];

            // Add Senior Managers
            deptGroup.seniors.forEach(senior => {
                const seniorNode = {
                    name: senior.name,
                    data: {
                        ...senior,
                        color: getColorByTeam(department, senior.role)
                    },
                    children: []
                };

                // Add Managers under Senior Manager
                deptGroup.managers.forEach(manager => {
                    const managerNode = {
                        name: manager.name,
                        data: {
                            ...manager,
                            color: getColorByTeam(department, manager.role)
                        },
                        children: []
                    };

                    if (department === 'Technical') {
                        // Add Team Leads under Manager for Technical department
                        departmentGroups.Technical.teamLeads.forEach(teamLead => {
                            const teamLeadNode = {
                                name: teamLead.name,
                                data: {
                                    ...teamLead,
                                    color: getColorByTeam(department, teamLead.role)
                                },
                                children: buildTechnicalHierarchy(teamLead)
                            };
                            managerNode.children.push(teamLeadNode);
                        });
                    } else {
                        // Add regular staff for other departments
                        deptGroup.staff.forEach(staff => {
                            managerNode.children.push({
                                name: staff.name,
                                data: {
                                    ...staff,
                                    color: getColorByTeam(department, staff.role)
                                },
                                children: []
                            });
                        });
                    }

                    seniorNode.children.push(managerNode);
                });

                departmentMembers.push(seniorNode);
            });

            // If no senior managers, add managers directly
            if (departmentMembers.length === 0 && deptGroup.managers.length > 0) {
                deptGroup.managers.forEach(manager => {
                    const managerNode = {
                        name: manager.name,
                        data: {
                            ...manager,
                            color: getColorByTeam(department, manager.role)
                        },
                        children: department === 'Technical' ? 
                            departmentGroups.Technical.teamLeads.map(teamLead => ({
                                name: teamLead.name,
                                data: {
                                    ...teamLead,
                                    color: getColorByTeam(department, teamLead.role)
                                },
                                children: buildTechnicalHierarchy(teamLead)
                            })) :
                            deptGroup.staff.map(staff => ({
                                name: staff.name,
                                data: {
                                    ...staff,
                                    color: getColorByTeam(department, staff.role)
                                },
                                children: []
                            }))
                    };
                    departmentMembers.push(managerNode);
                });
            }

            // If no managers either, add staff directly
            if (departmentMembers.length === 0 && deptGroup.staff.length > 0) {
                deptGroup.staff.forEach(staff => {
                    departmentMembers.push({
                        name: staff.name,
                        data: {
                            ...staff,
                            color: getColorByTeam(department, staff.role)
                        },
                        children: []
                    });
                });
            }

            return departmentMembers;
        };

        // Build the complete hierarchy
        const hierarchy = {
            name: ceo.name,
            data: {
                ...ceo,
                color: getColorByTeam('Executive', 'CEO')
            },
            children: executives.map(exec => ({
                name: exec.name,
                data: {
                    ...exec,
                    color: getColorByTeam('Executive', exec.role)
                },
                children: buildDepartmentHierarchy(exec.team || 'Executive')
            }))
        };

        // Add bench employees for Technical team
        if (departmentGroups.Technical.onBench.length > 0) {
            const benchNode = {
                name: "Technical Bench",
                data: {
                    name: "Technical Bench",
                    role: "Group",
                    team: "Technical",
                    color: "#FFB74D",
                    isOnBench: true
                },
                children: departmentGroups.Technical.onBench.map(emp => ({
                    name: emp.name,
                    data: {
                        ...emp,
                        color: getColorByTeam('Technical', emp.role)
                    },
                    children: []
                }))
            };
            
            // Find CTO's children and add bench node
            const ctoNode = hierarchy.children.find(node => node.data.role === 'CTO');
            if (ctoNode) {
                ctoNode.children.push(benchNode);
            }
        }

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