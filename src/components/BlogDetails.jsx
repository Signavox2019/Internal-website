import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Tooltip,  
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack, Public, Lock, CalendarToday, Tag, Code, ContentCopy, Check, ArrowForward, FormatQuote } from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import { format } from 'date-fns';
import LoadingScreen from './LoadingScreen';

// Map heading level to sizes (match BlogsPage preview)
const getHeadingSx = (level) => {
  const asLower = (level || '').toLowerCase();
  const sizeMap = {
    h1: '3.5rem',
    h2: '3rem',
    h3: '2.5rem',
    h4: '2.0rem',
    h5: '1.5rem',
    h6: '1.0rem',
    h7: '0.5rem',
  };
  return { fontSize: sizeMap[asLower] || '1.0rem', fontWeight: 700, lineHeight: 1.3 };
};

const CoverImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxHeight: 360,
  objectFit: 'cover',
  borderRadius: theme.spacing(2),
}));

const CodeBlock = styled('pre')(({ theme }) => ({
  background: '#2d3748',
  color: '#e2e8f0',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  overflowX: 'auto',
  fontSize: '0.9rem',
  position: 'relative',
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  lineHeight: 1.5,
}));

const CodeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(2, 0),
}));

const QuoteContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
  borderLeft: '4px solid #4299e1',
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
}));

const ListContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  paddingLeft: theme.spacing(1),
}));

const ListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0.5, 0),
}));

const CopyButton = styled(IconButton)(({ theme, copied }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: copied ? 'rgba(76, 175, 80, 0.3)' : 'rgba(226, 232, 240, 0.15)',
  color: copied ? '#ffffff' : '#e2e8f0',
  border: copied ? '1px solid rgba(76, 175, 80, 0.5)' : '1px solid rgba(226, 232, 240, 0.2)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: copied ? 'rgba(76, 175, 80, 0.4)' : 'rgba(226, 232, 240, 0.25)',
    transform: 'scale(1.05)',
  },
  zIndex: 1,
}));

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const token = localStorage.getItem('token');
  
  // Normalize response to ensure arrays are arrays even if backend ever sends strings
  const normalizeBlogFromApi = (data) => {
    const parseMaybeJsonArray = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try {
          const p = JSON.parse(val);
          return Array.isArray(p) ? p : (val ? [val] : []);
        } catch {
          return val ? [val] : [];
        }
      }
      return [];
    };
    const normalized = {
      ...data,
      tags: parseMaybeJsonArray(data?.tags),
      metaKeywords: parseMaybeJsonArray(data?.metaKeywords),
      contentBlocks: Array.isArray(data?.contentBlocks) ? data.contentBlocks : [],
    };
    return normalized;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/blogs/${slug}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = response?.data?.blog || response?.data;
        console.log('BLOG DETAILS - Received blog data:', data);
        console.log('BLOG DETAILS - Content blocks:', data?.contentBlocks);
        setBlog(normalizeBlogFromApi(data));
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleCopyCode = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!blog) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back icon only */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton onClick={() => navigate(-1)} aria-label="back">
          <ArrowBack />
        </IconButton>
      </Box>

      {/* Two-column layout: image (or placeholder) left, content right */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-start' }, gap: 5, mb: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              // boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              // backgroundColor: 'transparent',
              height: '360px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title}
                style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              />
            ) : null}
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          {/* Title aligned with top of image */}
          <Typography variant="h3" fontWeight={800} sx={{ mb: 16, background: 'linear-gradient(135deg, #311188 0%, #4f46e5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {blog.title}
          </Typography>
          
          {/* Author and category */}
          <Box display="flex" alignItems="center" gap={1.5} mb={2} sx={{ flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 28, height: 28 }}>{(blog.author?.name?.charAt(0) || 'A').toUpperCase()}</Avatar>
            <Typography variant="body2" color="text.secondary">{blog.author?.name}</Typography>
            {blog.category && (
              <Chip
                label={blog.category}
                size="small"
                color="primary"
                sx={{ ml: 1, borderRadius: '15px', height: 26 }}
              />
            )}
          </Box>
          
          {/* Meta Keywords and Tags (distinct style) */}
          {(blog.metaKeywords?.length > 0 || blog.tags?.length > 0) && (
            <Box sx={{ mb: 3 }}>
              {blog.metaKeywords?.length > 0 && (
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" sx={{ mb: blog.tags?.length ? 1.25 : 0 }}>
                  {blog.metaKeywords.map((kw, i) => (
                    <Chip key={`kw-${i}`} label={kw} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              )}
              {blog.tags?.length > 0 && (
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  {blog.tags.map((t, i) => (
                    <Chip key={`tag-${i}`} label={t} size="small" color="secondary" variant="outlined" />
                  ))}
                </Box>
              )}
            </Box>
          )}
          
          {/* Published status and date */}
          <Box display="flex" alignItems="center" gap={1} sx={{ flexWrap: 'wrap' }}>
            {blog.published ? (
              <Chip size="small" icon={<Public />} label="Published" color="success" />
            ) : (
              <Chip size="small" icon={<Lock />} label="Draft" color="warning" />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16 }} /> {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Below the header row: meta description and content blocks */}
      <Box sx={{ mt: 3 }}>
        {blog.metaDescription && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {blog.metaDescription}
          </Typography>
        )}
        {Array.isArray(blog.contentBlocks) && blog.contentBlocks.length > 0 ? (
          blog.contentBlocks.sort((a,b) => (a.order||0) - (b.order||0)).map((block, idx) => {
          switch (block.type) {
            case 'heading':
              return (
                <Typography key={idx} sx={{ ...getHeadingSx(block.level), mt: idx === 0 ? 0 : 3, mb: 1.5 }}>
                  {block.content}
                </Typography>
              );
            case 'paragraph':
              return (
                <Typography key={idx} variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                  {block.content}
                </Typography>
              );
            case 'quote':
              return (
                <QuoteContainer key={idx}>
                  <Typography variant="body1" fontStyle="italic" sx={{ color: '#2d3748', fontSize: '1.1rem', lineHeight: 1.2 }}>
                    {block.content}
                  </Typography>
                </QuoteContainer>
              );
            case 'code':
              const isCopied = copiedIndex === idx;
              return (
                <CodeContainer key={idx}>
                  <CodeBlock>
                    {block.content}
                  </CodeBlock>
                  <Tooltip title={isCopied ? "Copied!" : "Copy code"} arrow>
                    <CopyButton
                      size="small"
                      onClick={() => handleCopyCode(block.content, idx)}
                      copied={isCopied}
                    >
                      {isCopied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                    </CopyButton>
                  </Tooltip>
                </CodeContainer>
              );
            case 'image':
              return (
                <Box key={idx} sx={{ my: 2 }}>
                  <img
                    src={block.url}
                    alt={block.content || 'image'}
                    style={{ width: '240px', height: '160px', objectFit: 'cover', borderRadius: 8, display: 'block' }}
                  />
                  {block.content && (
                    <Typography variant="caption" color="text.secondary" display="block" style={{ marginTop: 6 }}>
                      {block.content}
                    </Typography>
                  )}
                </Box>
              );
            case 'list':
              return (
                <ListContainer key={idx}>
                  {(block.content || '')
                    .split(/\r?\n/)
                    .filter(Boolean)
                    .map((item, i) => (
                      <ListItem key={i}>
                        <ArrowForward sx={{ fontSize: 16, color: '#4299e1', mr: 1.5, mt: 0.5, flexShrink: 0 }} />
                        <Typography variant="body1" sx={{ color: '#2d3748', lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </ListItem>
                    ))}
                </ListContainer>
              );
            case 'link':
              return (
                block.url ? (
                  <a
                    key={idx}
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
                    title={block.url}
                  >
                    {block.content || block.url}
                  </a>
                ) : (
                  <Typography key={idx} variant="body1" sx={{ mb: 2, color: '#1976d2', cursor: 'pointer' }}>
                    {block.content}
                  </Typography>
                )
              );
            default:
              return null;
          }
        })
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
            No content blocks available for this blog.
          </Typography>
        )}
      </Box>

      
    </Container>
  );
};

export default BlogDetails;


