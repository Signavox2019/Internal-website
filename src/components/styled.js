import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    Avatar,
    LinearProgress,
    Chip,
    Paper,
    Accordion,
    AccordionSummary,
    Button,
    TextField,
    Dialog,
    Typography,
    TableContainer,
} from '@mui/material';
import { motion } from 'framer-motion';

export const AnimatedBackground = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        width: '50%',
        height: '50%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(49, 17, 136, 0.1) 0%, transparent 70%)',
        animation: 'pulse 15s infinite',
    },
    '&::before': {
        top: '-10%',
        right: '-10%',
    },
    '&::after': {
        bottom: '-10%',
        left: '-10%',
        animationDelay: '-7.5s',
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1) translate(0, 0)',
        },
        '50%': {
            transform: 'scale(1.2) translate(5%, 5%)',
        },
        '100%': {
            transform: 'scale(1) translate(0, 0)',
        },
    },
}));

export const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
}));

export const DetailRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.8)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(49, 17, 136, 0.1)',
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(1),
    },
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    border: '4px solid white',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05) rotate(5deg)',
        boxShadow: '0 12px 24px rgba(49, 17, 136, 0.2)',
        border: '4px solid rgba(255, 255, 255, 0.9)',
    },
}));

export const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(49, 17, 136, 0.1)',
    '& .MuiLinearProgress-bar': {
        background: value >= 75
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : value >= 50
            ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
            : 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderRadius: 5,
        transition: 'all 0.3s ease',
    },
    '&:hover .MuiLinearProgress-bar': {
        filter: 'brightness(1.1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    transition: 'all 0.3s ease',
}));

export const SkillChip = styled(Chip)(({ theme, level }) => ({
    borderRadius: '12px',
    fontWeight: 500,
    background: level === 'Advanced' 
        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
        : level === 'Intermediate'
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
        : 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    '& .MuiChip-label': {
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    '& .MuiChip-icon': {
        color: 'inherit',
    },
}));

export const GradientBorderCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '24px',
        padding: '2px',
        background: 'linear-gradient(45deg, #311188, #0A081E)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
    },
    '&:hover': {
        transform: 'translateY(-5px)',
        '&::before': {
            background: 'linear-gradient(45deg, #22c55e, #311188)',
        },
    },
    transition: 'all 0.3s ease',
}));

export const TimelineContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '2px',
        height: '100%',
        background: 'linear-gradient(180deg, #311188 0%, rgba(49, 17, 136, 0.2) 100%)',
        [theme.breakpoints.down('md')]: {
            left: '20px',
        },
    },
}));

export const TimelineItem = styled(Box)(({ theme, align = 'left' }) => ({
    display: 'flex',
    justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
    position: 'relative',
    marginBottom: theme.spacing(8),
    width: '100%',
    [theme.breakpoints.down('md')]: {
        justifyContent: 'flex-start',
        paddingLeft: '50px',
    },
}));

export const TimelineDot = styled(Box)(({ theme }) => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: '0 0 0 4px rgba(49, 17, 136, 0.2)',
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
        left: '20px',
    },
}));

export const ExperienceCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: theme.spacing(3),
    width: '45%',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(49, 17, 136, 0.15)',
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '20px',
        [theme.breakpoints.up('md')]: {
            right: props => props.align === 'left' ? '-10px' : 'auto',
            left: props => props.align === 'right' ? '-10px' : 'auto',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderLeft: props => props.align === 'left' ? '10px solid rgba(255, 255, 255, 0.9)' : 'none',
            borderRight: props => props.align === 'right' ? '10px solid rgba(255, 255, 255, 0.9)' : 'none',
        },
    },
}));

export const TechChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.1) 0%, rgba(10, 8, 30, 0.1) 100%)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(49, 17, 136, 0.2)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(49, 17, 136, 0.1)',
    },
    transition: 'all 0.3s ease',
}));

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px !important',
    marginBottom: theme.spacing(2),
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        margin: `${theme.spacing(2)} 0`,
    },
}));

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    borderRadius: '12px',
    '&.Mui-expanded': {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.05) 0%, rgba(10, 8, 30, 0.05) 100%)',
}));

export const AnimatedAddButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '8px 24px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(49, 17, 136, 0.2)',
    },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.95)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
        },
        '&.Mui-focused': {
            background: 'rgba(255, 255, 255, 1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(49, 17, 136, 0.15)',
        },
    },
}));

export const ChartContainer = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(49, 17, 136, 0.15)',
    },
}));

export const SkillsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing(4),
    padding: theme.spacing(2),
    '& > div': {
        position: 'relative',
        padding: theme.spacing(4),
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(49, 17, 136, 0.05)',
        transition: 'all 0.4s ease',
        overflow: 'hidden',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 30px rgba(49, 17, 136, 0.12)',
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #311188, #22c55e)',
            borderRadius: '20px 20px 0 0',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(49, 17, 136, 0.02) 0%, rgba(49, 17, 136, 0) 70%)',
            borderRadius: '50%',
            zIndex: 0,
        },
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(3),
        '& > div': {
            padding: theme.spacing(3),
        },
    },
    '@keyframes skillFadeIn': {
        from: {
            opacity: 0,
            transform: 'scale(0.95)',
        },
        to: {
            opacity: 1,
            transform: 'scale(1)',
        },
    },
    '& > div': {
        animation: 'skillFadeIn 0.5s ease-out forwards',
        '&:nth-of-type(1)': { animationDelay: '0.1s' },
        '&:nth-of-type(2)': { animationDelay: '0.2s' },
        '&:nth-of-type(3)': { animationDelay: '0.3s' },
        '&:nth-of-type(4)': { animationDelay: '0.4s' },
    },
}));

export const CustomTimeline = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(6),
    position: 'relative',
    padding: theme.spacing(2, 0),
    '&::before': {
        content: '""',
        position: 'absolute',
        left: '16px',
        top: 0,
        bottom: 0,
        width: '3px',
        background: 'linear-gradient(180deg, #311188 0%, #22c55e 100%)',
        borderRadius: '4px',
        opacity: 0.3,
    },
    [theme.breakpoints.up('md')]: {
        '&::before': {
            left: '50%',
            transform: 'translateX(-50%)',
        }
    }
}));

export const CustomTimelineItem = styled('div')(({ theme, index }) => ({
    display: 'flex',
    gap: theme.spacing(3),
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
        paddingLeft: index % 2 === 0 ? '50%' : '0',
        paddingRight: index % 2 === 0 ? '0' : '50%',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            width: '100px',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(49, 17, 136, 0.2), rgba(34, 197, 94, 0.2))',
            left: index % 2 === 0 ? 'auto' : '50%',
            right: index % 2 === 0 ? '50%' : 'auto',
        }
    },
    '@keyframes slideIn': {
        from: {
            opacity: 0,
            transform: 'translateY(30px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        }
    },
    animation: 'slideIn 0.5s ease-out forwards',
    animationDelay: `\${index * 0.2}s`,
}));

export const CustomTimelineDot = styled('div')(({ theme, active }) => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: active ? 'linear-gradient(135deg, #311188, #22c55e)' : 'rgba(49, 17, 136, 0.1)',
    border: '3px solid white',
    boxShadow: '0 0 0 3px rgba(49, 17, 136, 0.1)',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateX(-50%) scale(1.2)',
        boxShadow: '0 0 0 4px rgba(49, 17, 136, 0.2)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid rgba(49, 17, 136, 0.1)',
        top: '-10px',
        left: '-10px',
        animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(1.5)',
            opacity: 0,
        },
    },
}));

export const CustomTimelineContent = styled('div')(({ theme }) => ({
    flex: 1,
    marginLeft: '20px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(49, 17, 136, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(49, 17, 136, 0.15)',
        background: 'rgba(255, 255, 255, 0.95)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #311188, #22c55e)',
        opacity: 0.5,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(49, 17, 136, 0.03) 0%, rgba(49, 17, 136, 0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
    },
}));

export const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
    background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f3ff 100%)',
    padding: theme.spacing(4),
}));

export const AnimatedSection = styled(motion.div)({
    width: '100%',
    position: 'relative',
    zIndex: 1,
});

export const ProfileSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    position: 'relative',
    padding: theme.spacing(6),
    borderRadius: '30px',
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.95), rgba(10, 8, 30, 0.95))',
    color: 'white',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 40px rgba(49, 17, 136, 0.2)',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '30px',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
    },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    color: '#311188',
    position: 'relative',
    marginBottom: theme.spacing(6),
    fontSize: '2.5rem',
    fontWeight: 700,
    '&::before': {
        content: '""',
        position: 'absolute',
        bottom: -16,
        left: 0,
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, #311188, #22c55e)',
        borderRadius: '2px',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -16,
        left: '85px',
        width: '20px',
        height: '4px',
        background: '#22c55e',
        borderRadius: '2px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '2rem',
        marginBottom: theme.spacing(4),
    },
    animation: 'fadeIn 0.6s ease-out',
    '@keyframes fadeIn': {
        from: {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

export const DetailModal = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '30px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        maxWidth: '1000px',
        width: '95%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(49, 17, 136, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'modalSlideIn 0.5s ease-out',
        '@keyframes modalSlideIn': {
            from: {
                opacity: 0,
                transform: 'scale(0.95) translateY(10px)',
            },
            to: {
                opacity: 1,
                transform: 'scale(1) translateY(0)',
            },
        },
    },
    '& .MuiDialogTitle-root': {
        background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.95), rgba(10, 8, 30, 0.95))',
        color: 'white',
        padding: theme.spacing(4),
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '30%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1))',
            transform: 'skewX(-15deg)',
        },
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(4),
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
        position: 'relative',
        zIndex: 1,
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(49, 17, 136, 0.02) 0%, transparent 70%)',
            zIndex: -1,
        },
    },
}));

export const DetailSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    '& .detail-grid': {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: theme.spacing(3),
        marginTop: theme.spacing(3),
    },
    '& .detail-item': {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: theme.spacing(3),
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.5s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)',
        '&:hover': {
            transform: 'translateY(-5px)',
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 15px 30px rgba(49, 17, 136, 0.1)',
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #311188, #22c55e)',
            opacity: 0.5,
        },
    },
    '@keyframes fadeInUp': {
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
    '& .detail-icon': {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.1), rgba(34, 197, 94, 0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
        '& .MuiSvgIcon-root': {
            fontSize: '24px',
            color: '#311188',
        },
    },
    '& .timeline-dot': {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: '#311188',
        position: 'absolute',
        left: '-6px',
        top: '50%',
        transform: 'translateY(-50%)',
        '&::before': {
            content: '""',
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid rgba(49, 17, 136, 0.2)',
            top: '-4px',
            left: '-4px',
        },
    },
}));

export const StatusChip = styled(Chip)(({ status }) => ({
    backgroundColor: status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
    color: status === 'Active' ? '#22c55e' : '#eab308',
    fontWeight: 600,
    borderRadius: '12px',
    '&:hover': {
        backgroundColor: status === 'Active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
    },
}));

export const InfoCard = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: theme.spacing(3),
    border: '1px solid rgba(49, 17, 136, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(49, 17, 136, 0.1)',
    },
}));

export const AdminSection = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: '0 4px 20px rgba(49, 17, 136, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #311188, #22c55e)',
    },
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '15px',
    '& .MuiTableCell-head': {
        backgroundColor: 'rgba(49, 17, 136, 0.05)',
        color: '#311188',
        fontWeight: 600,
    },
    '& .MuiTableRow-root': {
        '&:hover': {
            backgroundColor: 'rgba(49, 17, 136, 0.02)',
        },
    },
    '& .MuiTableCell-root': {
        borderColor: 'rgba(49, 17, 136, 0.1)',
    },
}));

export const FilterBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
}));

export const ProjectCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: theme.spacing(3),
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(49, 17, 136, 0.15)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #311188, #22c55e)',
        borderRadius: '20px 20px 0 0',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(49, 17, 136, 0.02) 0%, rgba(49, 17, 136, 0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
    },
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
    background: 'rgba(49, 17, 136, 0.05)',
    color: '#311188',
    fontWeight: 500,
    borderRadius: '12px',
    border: '1px solid rgba(49, 17, 136, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(49, 17, 136, 0.1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(49, 17, 136, 0.1)',
    },
})); 