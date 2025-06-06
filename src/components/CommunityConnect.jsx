import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Container, Typography, Paper, CircularProgress,
    Avatar, Tooltip, alpha, useTheme, Zoom, IconButton,
    Collapse, Fab
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import { Tree, TreeNode } from 'react-organizational-chart';
import { styled } from '@mui/material/styles';
import maleAvatar from '../assets/bussiness-man.png';
import femaleAvatar from '../assets/businesswoman.png';
import { ExpandMore, ExpandLess, AccountTree, ZoomIn, ZoomOut, ZoomOutMap } from '@mui/icons-material';

// Zoom Controls Styled Components
const ZoomControls = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    zIndex: 1000,
}));

const ZoomButton = styled(Fab)(({ theme }) => ({
    backgroundColor: '#311188',
    color: 'white',
    width: 48,
    height: 48,
    '&:hover': {
        backgroundColor: '#4527A0',
    },
    '& .MuiSvgIcon-root': {
        fontSize: '1.2rem',
    },
}));

// Tree Container with zoom functionality
const ZoomableTreeContainer = styled(Box)(({ theme, zoom }) => ({
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > div': {
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease',
    }
}));

// Styled Components
const StyledNode = styled(Box)(({ theme, level, isCollapsed, zoom }) => ({
    padding: theme.spacing(2),
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '2px solid',
    borderColor: level === 'CEO' ? '#311188' :
                level === 'C-Level' ? '#4527A0' :
                level === 'Senior' ? '#5E35B1' :
                level === 'Manager' ? '#673AB7' :
                level === 'TeamLead' ? '#7E57C2' : '#9575CD',
    // Responsive sizing based on zoom level
    width: zoom < 0.6 ? '180px' : zoom < 0.8 ? '200px' : '240px',
    minHeight: zoom < 0.6 ? '120px' : zoom < 0.8 ? '140px' : '160px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    margin: '0 auto', // Center the node
    boxShadow: isCollapsed ? 
        '0 4px 20px rgba(49, 17, 136, 0.2)' : 
        '0 4px 15px rgba(0, 0, 0, 0.1)',
    transform: isCollapsed ? 'scale(1.02)' : 'scale(1)',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 32px rgba(49, 17, 136, 0.2)',
        zIndex: 10,
        '& .info-overlay': {
            opacity: 1,
            visibility: 'visible',
            transform: 'translateY(0)',
        }
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '16px',
        background: isCollapsed ?
            'linear-gradient(135deg, rgba(49, 17, 136, 0.05) 0%, rgba(49, 17, 136, 0.1) 100%)' :
            'none',
        pointerEvents: 'none',
    }
}));

const CollapseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    bottom: -20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#311188',
    color: 'white',
    width: 30,
    height: 30,
    '&:hover': {
        backgroundColor: '#4527A0',
    },
    '& .MuiSvgIcon-root': {
        fontSize: '1.2rem',
    },
    zIndex: 2,
}));

const InfoOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-10px)',
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    color: 'white',
    padding: theme.spacing(2),
    borderRadius: '12px',
    zIndex: 20,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease',
    width: '300px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        border: '8px solid transparent',
        borderBottomColor: '#311188',
    }
}));

const StyledAvatar = styled(Avatar)(({ theme, level, zoom }) => ({
    width: zoom < 0.6 ? 
        (level === 'CEO' ? 50 : level === 'C-Level' ? 45 : level === 'Senior' ? 40 : level === 'Manager' ? 35 : 30) :
        zoom < 0.8 ?
        (level === 'CEO' ? 60 : level === 'C-Level' ? 55 : level === 'Senior' ? 50 : level === 'Manager' ? 45 : 40) :
        (level === 'CEO' ? 70 : level === 'C-Level' ? 65 : level === 'Senior' ? 60 : level === 'Manager' ? 55 : 50),
    height: zoom < 0.6 ? 
        (level === 'CEO' ? 50 : level === 'C-Level' ? 45 : level === 'Senior' ? 40 : level === 'Manager' ? 35 : 30) :
        zoom < 0.8 ?
        (level === 'CEO' ? 60 : level === 'C-Level' ? 55 : level === 'Senior' ? 50 : level === 'Manager' ? 45 : 40) :
        (level === 'CEO' ? 70 : level === 'C-Level' ? 65 : level === 'Senior' ? 60 : level === 'Manager' ? 55 : 50),
    border: '3px solid',
    borderColor: level === 'CEO' ? '#311188' :
                level === 'C-Level' ? '#4527A0' :
                level === 'Senior' ? '#5E35B1' :
                level === 'Manager' ? '#673AB7' :
                level === 'TeamLead' ? '#7E57C2' : '#9575CD',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginBottom: theme.spacing(1),
    transition: 'all 0.3s ease',
}));

// Custom Tree wrapper for better alignment
const StyledTree = styled(Tree)(({ zoom }) => ({
    '& .rst__tree': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    '& .rst__node': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    '& .rst__nodeChildren': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: zoom < 0.6 ? '10px' : zoom < 0.8 ? '15px' : '20px',
    },
    '& .rst__lineHalfHorizontalRight::before, & .rst__lineFullVertical::after, & .rst__lineHalfVerticalTop::after, & .rst__lineHalfVerticalBottom::after': {
        backgroundColor: '#311188',
        width: '2px',
    },
    '& .rst__lineChildren::after': {
        backgroundColor: '#311188',
        width: '2px',
    },
    '& .rst__lineChildren': {
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
    }
}));

// Custom TreeNode wrapper for consistent alignment
const AlignedTreeNode = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
});

const RoleChip = styled(Box)(({ theme, level, zoom }) => ({
    padding: zoom < 0.6 ? '2px 8px' : zoom < 0.8 ? '3px 10px' : '4px 12px',
    borderRadius: '12px',
    fontSize: zoom < 0.6 ? '0.65rem' : zoom < 0.8 ? '0.7rem' : '0.75rem',
    fontWeight: 600,
    backgroundColor: alpha(
        level === 'CEO' ? '#311188' :
        level === 'C-Level' ? '#4527A0' :
        level === 'Senior' ? '#5E35B1' :
        level === 'Manager' ? '#673AB7' :
        level === 'TeamLead' ? '#7E57C2' : '#9575CD',
        0.1
    ),
    color: level === 'CEO' ? '#311188' :
           level === 'C-Level' ? '#4527A0' :
           level === 'Senior' ? '#5E35B1' :
           level === 'Manager' ? '#673AB7' :
           level === 'TeamLead' ? '#7E57C2' : '#9575CD',
    marginBottom: theme.spacing(0.5),
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: zoom < 0.6 ? '140px' : zoom < 0.8 ? '170px' : '200px',
}));

const TeamChip = styled(Box)(({ theme, zoom }) => ({
    padding: zoom < 0.6 ? '2px 8px' : zoom < 0.8 ? '3px 10px' : '4px 12px',
    borderRadius: '12px',
    fontSize: zoom < 0.6 ? '0.65rem' : zoom < 0.8 ? '0.7rem' : '0.75rem',
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(0.5),
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: zoom < 0.6 ? '140px' : zoom < 0.8 ? '170px' : '200px',
}));

const CommunityConnect = () => {
    const theme = useTheme();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collapsedNodes, setCollapsedNodes] = useState(new Set());
    const [zoom, setZoom] = useState(0.4); // Start with smaller zoom to fit everything
    const treeContainerRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEmployees(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const getEmployeeLevel = (role) => {
        if (role === 'CEO') return 'CEO';
        if (['CTO', 'CFO', 'CMO', 'COO', 'CHRO'].includes(role)) return 'C-Level';
        if (role.includes('Senior')) return 'Senior';
        if (role.includes('Manager')) return 'Manager';
        if (role.includes('Team lead')) return 'TeamLead';
        return 'Staff';
    };

    const toggleCollapse = (employeeId) => {
        setCollapsedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(employeeId)) {
                newSet.delete(employeeId);
            } else {
                newSet.add(employeeId);
            }
            return newSet;
        });
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 1.2));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.2));
    };

    const handleResetZoom = () => {
        setZoom(0.4);
    };

    const renderEmployeeNode = (employee, hasChildren = false) => {
        const level = getEmployeeLevel(employee.role);
        const isCollapsed = collapsedNodes.has(employee._id);

        return (
            <AlignedTreeNode>
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                    <StyledNode level={level} isCollapsed={isCollapsed} zoom={zoom}>
                        <Box sx={{ 
                            position: 'relative', 
                            width: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <StyledAvatar
                                    src={employee.gender === 'Male' ? maleAvatar : femaleAvatar}
                                    alt={employee.name}
                                    level={level}
                                    zoom={zoom}
                                />
                            </motion.div>
                            
                            <Typography 
                                variant={level === 'CEO' ? 'h6' : 'subtitle1'} 
                                fontWeight="bold" 
                                gutterBottom
                                sx={{ 
                                    fontSize: level === 'CEO' ? '1.1rem' : 
                                            level === 'C-Level' ? '1rem' : '0.9rem',
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                    maxWidth: zoom < 0.6 ? '140px' : zoom < 0.8 ? '170px' : '200px',
                                    wordWrap: 'break-word',
                                    marginBottom: 1
                                }}
                            >
                                {employee.name}
                            </Typography>

                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: 0.5, 
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <RoleChip level={level} zoom={zoom}>{employee.role}</RoleChip>
                                <TeamChip zoom={zoom}>{employee.team}</TeamChip>
                            </Box>

                            {hasChildren && (
                                <CollapseButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCollapse(employee._id);
                                    }}
                                >
                                    {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                                </CollapseButton>
                            )}

                            <InfoOverlay className="info-overlay">
                                <Typography variant="subtitle2" gutterBottom>
                                    Employee ID: {employee.employeeId}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Email: {employee.email}
                                </Typography>
                                {employee.experience && (
                                    <Typography variant="body2" gutterBottom>
                                        Experience: {employee.experience}
                                    </Typography>
                                )}
                                {employee.skills && employee.skills.length > 0 && (
                                    <Typography variant="body2" gutterBottom>
                                        Skills: {employee.skills.map(s => s.name).join(', ')}
                                    </Typography>
                                )}
                                <Typography variant="body2" gutterBottom>
                                    Status: {employee.status}
                                </Typography>
                            </InfoOverlay>
                        </Box>
                    </StyledNode>
                </Zoom>
            </AlignedTreeNode>
        );
    };

    const renderTreeNode = (employee, children) => {
        const hasChildren = children && children.length > 0;
        const isCollapsed = collapsedNodes.has(employee._id);

        return (
            <TreeNode 
                key={employee._id} 
                label={renderEmployeeNode(employee, hasChildren)}
            >
                {!isCollapsed && children}
            </TreeNode>
        );
    };

    const findEmployeesByRole = (role) => {
        return employees.filter(emp => emp.role === role);
    };

    const findEmployeesByTeamAndRole = (team, role) => {
        return employees.filter(emp => emp.team === team && emp.role === role);
    };

    const renderHierarchy = () => {
        const ceo = findEmployeesByRole('CEO')[0];
        if (!ceo) return null;

        return (
            <Box sx={{ 
                overflowX: 'auto',
                overflowY: 'auto',
                padding: { xs: 2, sm: 4 },
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <StyledTree
                    lineWidth="2px"
                    lineColor="#311188"
                    lineBorderRadius="10px"
                    nodePadding="40px"
                >
                    {renderTreeNode(ceo, [
                        // CTO Branch
                        ...findEmployeesByRole('CTO').map(cto =>
                            renderTreeNode(cto, [
                                ...findEmployeesByTeamAndRole('Technical', 'Senior Manager').map(sm =>
                                    renderTreeNode(sm, [
                                        ...findEmployeesByTeamAndRole('Technical', 'Manager').map(mgr =>
                                            renderTreeNode(mgr, [
                                                ...findEmployeesByRole('Technical Team lead').map(tl =>
                                                    renderTreeNode(tl, [
                                                        ...employees
                                                            .filter(emp => 
                                                                emp.team === 'Technical' && 
                                                                ['Developer', 'DevOps', 'UI/UX', 'Testing'].includes(emp.role)
                                                            )
                                                            .map(staff => renderTreeNode(staff, []))
                                                    ])
                                                )
                                            ])
                                        )
                                    ])
                                )
                            ])
                        ),

                        // CFO Branch
                        ...findEmployeesByRole('CFO').map(cfo =>
                            renderTreeNode(cfo, [
                                ...findEmployeesByTeamAndRole('Finance', 'Senior Manager').map(sm =>
                                    renderTreeNode(sm, [
                                        ...findEmployeesByTeamAndRole('Finance', 'Manager').map(mgr =>
                                            renderTreeNode(mgr, [
                                                ...employees
                                                    .filter(emp => 
                                                        emp.team === 'Finance' && 
                                                        !['CFO', 'Senior Manager', 'Manager'].includes(emp.role)
                                                    )
                                                    .map(staff => renderTreeNode(staff, []))
                                            ])
                                        )
                                    ])
                                )
                            ])
                        ),

                        // CMO Branch
                        ...findEmployeesByRole('CMO').map(cmo =>
                            renderTreeNode(cmo, [
                                ...findEmployeesByTeamAndRole('Marketing', 'Manager').map(mgr =>
                                    renderTreeNode(mgr, [
                                        ...findEmployeesByRole('Marketing Team lead').map(tl =>
                                            renderTreeNode(tl, [
                                                ...employees
                                                    .filter(emp => 
                                                        emp.team === 'Marketing' && 
                                                        ['BDE', 'Support'].includes(emp.role)
                                                    )
                                                    .map(staff => renderTreeNode(staff, []))
                                            ])
                                        )
                                    ])
                                )
                            ])
                        ),

                        // COO Branch
                        ...findEmployeesByRole('COO').map(coo =>
                            renderTreeNode(coo, [
                                ...findEmployeesByTeamAndRole('Operations', 'Manager').map(mgr =>
                                    renderTreeNode(mgr, [
                                        ...findEmployeesByRole('HR').map(hr =>
                                            renderTreeNode(hr, [
                                                ...findEmployeesByRole('Operations Team lead').map(tl =>
                                                    renderTreeNode(tl, [
                                                        ...employees
                                                            .filter(emp => 
                                                                emp.team === 'Operations' && 
                                                                !['COO', 'Manager', 'HR', 'Operations Team lead'].includes(emp.role)
                                                            )
                                                            .map(staff => renderTreeNode(staff, []))
                                                    ])
                                                )
                                            ])
                                        )
                                    ])
                                )
                            ])
                        ),

                        // CHRO Branch
                        ...findEmployeesByRole('CHRO').map(chro =>
                            renderTreeNode(chro, [])
                        )
                    ])}
                </StyledTree>
            </Box>
        );
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            py: 4,
            background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f3ff 100%)',
        }}>
            <Container maxWidth="xl" sx={{ overflow: 'hidden' }}>
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
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
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
                                Organization Structure
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                                Explore our organizational hierarchy and team structure. Click on nodes to expand/collapse teams, and hover over members to view detailed information.
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>

                <Paper sx={{
                    p: { xs: 1, sm: 2, md: 3 },
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    overflowX: 'auto',
                    '& > div': {
                        minWidth: 'fit-content'
                    }
                }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        renderHierarchy()
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default CommunityConnect;