import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Chip as MuiChip,
  ClickAwayListener,
  Divider,
  FormHelperText,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Code as CodeIcon,
  FormatQuote as QuoteIcon,
  List as ListIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './LoadingScreen';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

// Removed hover overlay to align with Cards page minimal hover effects

// Removed hover actions bar

// Removed floating FAB; Create button will be in header like Cards page

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const FilterChip = styled(MuiChip)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  borderRadius: '20px',
  fontWeight: selected ? 600 : 400,
  background: selected 
    ? 'linear-gradient(135deg, #311188 0%, #4f46e5 100%)'
    : 'rgba(255, 255, 255, 0.8)',
  color: selected ? 'white' : theme.palette.text.primary,
  border: selected ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: selected 
      ? 'linear-gradient(135deg, #1a0a4a 0%, #4338ca 100%)'
      : 'rgba(49, 17, 136, 0.1)',
  },
}));

// Image upload area styled component
const ImageUploadArea = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '200px',
  border: '2px dashed rgba(0,0,0,0.1)',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  background: 'rgba(0,0,0,0.02)',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    background: 'rgba(0,0,0,0.04)',
  }
}));

// Content block input styled component (card-like block)
const ContentBlockInput = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  padding: theme.spacing(2.5),
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '16px',
  backgroundColor: 'rgba(255,255,255,0.98)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

// Content type icon component
const ContentTypeIcon = ({ type }) => {
  const iconProps = { sx: { fontSize: 20, color: 'primary.main', mr: 1 } };
  
  switch (type) {
    case 'heading':
      return <TitleIcon {...iconProps} />;
    case 'paragraph':
      return <DescriptionIcon {...iconProps} />;
    case 'quote':
      return <QuoteIcon {...iconProps} />;
    case 'code':
      return <CodeIcon {...iconProps} />;
    case 'list':
      return <ListIcon {...iconProps} />;
    case 'link':
      return <LinkIcon {...iconProps} />;
    case 'image':
      return <ImageIcon {...iconProps} />;
    default:
      return <DescriptionIcon {...iconProps} />;
  }
};


const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openMenuForId, setOpenMenuForId] = useState(null);
  
  // Create and Edit Modal states
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    category: 'Technology',
    tags: [],
    contentBlocks: [],
    published: false,
    coverImage: null
  });
  const [newContentBlock, setNewContentBlock] = useState({
    type: 'heading',
    content: '',
    url: '',
    language: '',
    level: 'h1',
    order: 1
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newTag, setNewTag] = useState('');
  const [imageRemoved, setImageRemoved] = useState(false);

  // Helper function to get displayable image URL
  const getImageUrl = (coverImage) => {
    console.log('🔍 getImageUrl called with:', coverImage, 'type:', typeof coverImage, 'isFile:', coverImage instanceof File);
    if (!coverImage) {
      console.log('❌ No coverImage provided');
      return null;
    }
    if (typeof coverImage === 'string') {
      console.log('✅ String URL:', coverImage);
      // Check if it's a full URL or a relative path
      if (coverImage.startsWith('http') || coverImage.startsWith('data:')) {
        return coverImage;
      }
      // If it's a relative path, prepend the base URL
      return `${BaseUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`;
    }
    if (coverImage instanceof File) {
      const url = URL.createObjectURL(coverImage);
      console.log('✅ File converted to URL:', url);
      return url;
    }
    console.log('❌ Unknown coverImage type');
    return null;
  };

  // Normalize blog coming from API to ensure consistent types
  const normalizeBlogFromApi = (blog) => {
    const parseIfJsonString = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : val;
        } catch {
          return val;
        }
      }
      return val ?? [];
    };
    // Handle legacy case: ['["a","b"]'] -> ['a','b']
    const normalizeStringArray = (val) => {
      let arr = parseIfJsonString(val);
      if (Array.isArray(arr) && arr.length === 1 && typeof arr[0] === 'string') {
        const first = arr[0].trim();
        if (first.startsWith('[') && first.endsWith(']')) {
          try {
            const parsed = JSON.parse(first);
            if (Array.isArray(parsed)) arr = parsed;
          } catch {}
        }
      }
      if (Array.isArray(arr)) {
        return arr
          .filter((v) => typeof v === 'string' && v.trim().length > 0)
          .map((v) => v.trim());
      }
      if (typeof arr === 'string' && arr.trim().length > 0) return [arr.trim()];
      return [];
    };
    // Ensure author information is properly formatted
    const normalizeAuthor = (author) => {
      if (!author) return null;
      if (typeof author === 'string') {
        // If author is just a string, convert to object
        return { name: author, _id: null, profileImage: null };
      }
      if (typeof author === 'object') {
        // If author object exists but doesn't have name, or name is an ID, use the _id as fallback
        if (!author.name || author.name === author._id || /^[a-f0-9]{24}$/i.test(author.name)) {
          return { 
            name: author._id || 'Unknown Author', 
            _id: author._id, 
            profileImage: author.profileImage 
          };
        }
        return author;
      }
      return null;
    };
    
    return {
      ...blog,
      tags: normalizeStringArray(blog?.tags),
      metaKeywords: normalizeStringArray(blog?.metaKeywords),
      contentBlocks: Array.isArray(blog?.contentBlocks) ? blog.contentBlocks : [],
      author: normalizeAuthor(blog?.author),
    };
  };

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = !!userData.isAdmin;
  const userId = userData?._id;

  const categories = ['All', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Entertainment'];
  const statuses = ['All', 'Published', 'Draft'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'author', label: 'Author' },
  ];

  const blogCategories = ['Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Entertainment'];
  const contentBlockTypes = [
    { value: 'heading', label: 'Heading' },
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'quote', label: 'Quote' },
    { value: 'code', label: 'Code' },
    { value: 'list', label: 'List' },
    { value: 'link', label: 'Link' },
    { value: 'image', label: 'Image' },
  ];

  // Language options for code blocks
  const codeLanguages = [
    'plaintext',
    'javascript',
    'typescript',
    'python',
    'java',
    'csharp',
    'cpp',
    'go',
    'ruby',
    'php',
    'rust',
    'kotlin',
    'swift',
    'sql',
    'bash',
    'json',
    'yaml',
    'markdown',
  ];

  // Map heading level to Typography variant
  const getHeadingVariant = (level) => {
    const allowed = ['h1','h2','h3','h4','h5','h6'];
    const asLower = (level || '').toLowerCase();
    return allowed.includes(asLower) ? asLower : 'h6';
  };

  // Compact heading sizes for preview (smaller, just incremental differences)
  const getHeadingSx = (level) => {
    const asLower = (level || '').toLowerCase();
    const sizeMap = {
      h1: '3.5rem',
      h2: '3rem',
      h3: '2.5rem',
      h4: '2.0rem',
      h5: '1.5rem',
      h6: '1.0rem',
      h7: '0.5rem'
    };
    return { fontSize: sizeMap[asLower] || '1.0rem', fontWeight: 600, lineHeight: 1.3 };
  };


  useEffect(() => {
    fetchBlogs();
    // Force published-only status for non-admin users
    if (!isAdmin) {
      setSelectedStatus('Published');
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BaseUrl}/blogs/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const allBlogs = response.data.blogs || [];
      console.log('FETCH - Raw blogs from API:', allBlogs);
      // Ensure all blogs have properly formatted contentBlocks and author information
      const blogsWithContentBlocks = allBlogs.map(blog => {
        const normalized = normalizeBlogFromApi(blog);
        console.log('FETCH - Blog author before fix:', normalized.author);
        console.log('FETCH - User data:', userData);
        // Ensure author information is properly populated
        if (!normalized.author || !normalized.author.name || /^[a-f0-9]{24}$/i.test(normalized.author.name)) {
          // If author is missing or name is an ID, use current user data as fallback
          const authorName = userData?.name || userData?.username || 'Current User';
          normalized.author = userData ? { 
            _id: userId, 
            name: authorName, 
            profileImage: userData.profileImage 
          } : { name: 'Current User', _id: null, profileImage: null };
          console.log('FETCH - Set author to user data:', normalized.author);
        }
        console.log('FETCH - Final author:', normalized.author);
        return normalized;
      });
      console.log('FETCH - Blogs with contentBlocks:', blogsWithContentBlocks);
      console.log('FETCH - Cover images:', blogsWithContentBlocks.map(b => ({ id: b._id, title: b.title, coverImage: b.coverImage })));
      console.log('FETCH - Blogs with images:', blogsWithContentBlocks.filter(b => b.coverImage));
      // Non-admin users should only see published blogs
      setBlogs(isAdmin ? blogsWithContentBlocks : blogsWithContentBlocks.filter(b => b.published));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showSnackbar('Failed to fetch blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    if (severity === 'error') {
      toast.error(message);
    } else if (severity === 'warning') {
      toast.warn(message);
    } else if (severity === 'info') {
      toast.info(message);
    } else {
      toast.success(message);
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  // Handle title change (do not auto-generate slug)
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
    }));
  };

  // Add content block
  const addContentBlock = () => {
    const nextOrder = formData.contentBlocks.length + 1;
    const block = {
      ...newContentBlock,
      content: newContentBlock.content || '',
      // Ensure heading blocks have a default level
      level: newContentBlock.type === 'heading' ? (newContentBlock.level || 'h1') : newContentBlock.level,
      order: nextOrder
    };
    
    setFormData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, block]
    }));
    
    setNewContentBlock({
      type: 'heading',
      content: '',
      url: '',
      language: '',
      level: 'h1',
      order: nextOrder + 1
    });
  };

  // Remove content block
  const removeContentBlock = (index) => {
    const updatedBlocks = formData.contentBlocks.filter((_, i) => i !== index);
    // Reorder remaining blocks
    const reorderedBlocks = updatedBlocks.map((block, i) => ({
      ...block,
      order: i + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      contentBlocks: reorderedBlocks
    }));
    
    setNewContentBlock(prev => ({
      ...prev,
      order: reorderedBlocks.length + 1
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      category: 'Technology',
      tags: [],
      // Start with one default empty block so the designed card and delete icon show by default
      contentBlocks: [
        { type: 'heading', content: '', url: '', language: '', level: 'h1', order: 1 }
      ],
      published: false,
      coverImage: null
    });
    setNewContentBlock({
      type: 'heading',
      content: '',
      url: '',
      language: '',
      level: 'h1',
      order: 2
    });
    setFormErrors({});
    setPreviewImage('');
    setNewKeyword('');
    setNewTag('');
    setEditingBlog(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('📁 File selected:', file);
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
      setImageRemoved(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('🖼️ Preview image created:', reader.result);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }));
    setPreviewImage('');
    setImageRemoved(true);
    // Also clear the editing blog's cover image reference
    if (editingBlog) {
      setEditingBlog(prev => ({
        ...prev,
        coverImage: null
      }));
    }
  };

  // Add keyword
  const addKeyword = () => {
    if (newKeyword.trim() && !formData.metaKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  // Remove keyword
  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(k => k !== keyword)
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };



  const handleDeleteBlog = async (blogId) => {
    if (!isAdmin) {
      showSnackbar('You do not have permission to delete blogs', 'error');
      return;
    }
    try {
      await axios.delete(`${BaseUrl}/blogs/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      showSnackbar('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      showSnackbar(error.response?.data?.message || 'Failed to delete blog', 'error');
    }
  };

  // Create blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('You do not have permission to create blogs');
      return;
    }
    setSubmitting(true);
    
    try {
      // Process content blocks with proper order
      const processedContentBlocks = (formData.contentBlocks || [])
        .map((b, idx) => ({
          type: b.type || 'paragraph',
          content: b.content ?? '',
          url: b.url || undefined,
          language: b.language || undefined,
          level: b.level || (b.type === 'heading' ? 'h1' : undefined),
          order: Number(b.order ?? (idx + 1)),
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      let response;
      // If a file is selected, upload via multipart FormData
      if (formData.coverImage instanceof File) {
        const form = new FormData();
        form.append('title', formData.title || '');
        form.append('slug', formData.slug || generateSlug(formData.title || ''));
        form.append('metaTitle', formData.metaTitle || '');
        form.append('metaDescription', formData.metaDescription || '');
        form.append('category', formData.category || '');
        form.append('published', String(!!formData.published));
        form.append('metaKeywords', JSON.stringify(formData.metaKeywords || []));
        form.append('tags', JSON.stringify(formData.tags || []));
        form.append('contentBlocks', JSON.stringify(processedContentBlocks));
        form.append('coverImage', formData.coverImage);

        console.log('CREATE - Sending multipart payload with file');
        response = await axios.post(`${BaseUrl}/blogs/`, form, {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Let the browser set the Content-Type with boundary
          },
        });
      } else {
        // JSON without large base64 image
        const payload = {
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title || ''),
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          metaKeywords: formData.metaKeywords || [],
          category: formData.category,
          tags: formData.tags || [],
          contentBlocks: processedContentBlocks,
          published: !!formData.published,
          coverImage: null,
        };
        console.log('CREATE - Sending JSON payload (no image file)');
        response = await axios.post(`${BaseUrl}/blogs/`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      }

      const created = response?.data;
      console.log('CREATE - Received from API:', created);
      
      if (created && created._id) {
        // Ensure author object and contentBlocks are populated for immediate UI display
        const populatedAuthor = created?.author && typeof created.author === 'object' && created.author?.name
          ? created.author
          : (userData ? { _id: userId, name: userData.name, profileImage: userData.profileImage } : null);
        
        // Ensure contentBlocks is properly formatted
        const normalized = normalizeBlogFromApi(created);
        const contentBlocks = Array.isArray(normalized?.contentBlocks) && normalized.contentBlocks.length > 0 
          ? normalized.contentBlocks 
          : processedContentBlocks;
        
        const createdWithExtras = {
          ...normalized,
          author: populatedAuthor,
          contentBlocks: contentBlocks,
          // Preserve the File object for immediate display
          coverImage: formData.coverImage instanceof File ? formData.coverImage : (created.coverImage || null)
        };
        setBlogs(prev => [createdWithExtras, ...prev]);
      }
      
      setOpenCreateModal(false);
      resetForm();
      toast.success('Blog created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to create blog');
    } finally {
      setSubmitting(false);
    }
  };

  // Update blog
  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('You do not have permission to update blogs');
      return;
    }
    setSubmitting(true);
    
    try {
      // Process content blocks with proper order
      const processedContentBlocks = (formData.contentBlocks || [])
        .map((b, idx) => ({
          type: b.type || 'paragraph',
          content: b.content ?? '',
          url: b.url || undefined,
          language: b.language || undefined,
          level: b.level || (b.type === 'heading' ? 'h1' : undefined),
          order: Number(b.order ?? (idx + 1)),
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      let updated;
      // If a new file is provided, first upload image via multipart, then send JSON update for other fields
      if (formData.coverImage instanceof File) {
        const form = new FormData();
        form.append('coverImage', formData.coverImage);

        console.log('UPDATE - Step 1: upload cover image');
        const imageResp = await axios.put(`${BaseUrl}/blogs/${editingBlog._id}`, form, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const coverUrl = imageResp?.data?.coverImage || null;

        // Build JSON payload for other fields (do not send coverImage again)
        const payload = {
          title: formData.title,
          slug: formData.slug,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          metaKeywords: formData.metaKeywords || [],
          category: formData.category,
          tags: formData.tags || [],
          contentBlocks: processedContentBlocks,
          published: !!formData.published,
          ...(imageRemoved ? { coverImage: null } : {}),
        };

        console.log('UPDATE - Step 2: send JSON fields payload');
        const jsonResp = await axios.put(`${BaseUrl}/blogs/${editingBlog._id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        updated = { ...jsonResp?.data, coverImage: coverUrl ?? jsonResp?.data?.coverImage ?? null };
      } else {
        // Single JSON update; omit coverImage to keep existing unless explicitly removed
        const payload = {
          title: formData.title,
          slug: formData.slug,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          metaKeywords: formData.metaKeywords || [],
          category: formData.category,
          tags: formData.tags || [],
          contentBlocks: processedContentBlocks,
          published: !!formData.published,
          ...(imageRemoved ? { coverImage: null } : {}),
        };

        console.log('UPDATE - Single JSON payload (no new file)');
        const jsonResp = await axios.put(`${BaseUrl}/blogs/${editingBlog._id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        updated = jsonResp?.data;
      }

      
      console.log('UPDATE - Received from API:', updated);
      console.log('UPDATE - Cover image from server:', updated?.coverImage);
      console.log('UPDATE - Preview image:', previewImage);
      console.log('UPDATE - Editing blog cover image:', editingBlog?.coverImage);
      console.log('UPDATE - Form data cover image:', formData.coverImage);
      console.log('UPDATE - Is file instance?', formData.coverImage instanceof File);
      
      if (updated && updated._id) {
        // If there's a new image file, we might need to handle it separately
        // For now, we'll update the UI with the current data
        const populatedAuthor = updated?.author && typeof updated.author === 'object' && updated.author?.name
          ? updated.author
          : (userData ? { _id: userId, name: userData.name, profileImage: userData.profileImage } : null);
        
        // Ensure contentBlocks is properly formatted
        const normalized = normalizeBlogFromApi(updated);
        const contentBlocks = Array.isArray(normalized?.contentBlocks) && normalized.contentBlocks.length > 0 
          ? normalized.contentBlocks 
          : processedContentBlocks;
        
        const updatedWithExtras = {
          ...normalized,
          author: populatedAuthor,
          contentBlocks: contentBlocks,
          // Prefer server URL (updated.coverImage)
          coverImage: normalized.coverImage || null
        };
        setBlogs(prev => prev.map(b => b._id === updatedWithExtras._id ? { ...b, ...updatedWithExtras } : b));
      }
      
      setOpenEditModal(false);
      setEditingBlog(null);
      resetForm();
      toast.success('Blog updated successfully!');
    } catch (error) {
      console.error('Error updating blog:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update blog';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (blog) => {
    if (!isAdmin) {
      return;
    }
    const normalizedBlog = normalizeBlogFromApi(blog);
    setEditingBlog(normalizedBlog);
    
    // Ensure contentBlocks is properly formatted and has at least one block
    const contentBlocks = Array.isArray(normalizedBlog.contentBlocks) && normalizedBlog.contentBlocks.length > 0 
      ? normalizedBlog.contentBlocks 
      : [{ type: 'heading', content: '', url: '', language: '', level: 'h1', order: 1 }];
    
    setFormData({
      title: normalizedBlog.title || '',
      slug: normalizedBlog.slug || '',
      metaTitle: normalizedBlog.metaTitle || '',
      metaDescription: normalizedBlog.metaDescription || '',
      metaKeywords: normalizedBlog.metaKeywords || [],
      category: normalizedBlog.category || 'Technology',
      tags: normalizedBlog.tags || [],
      contentBlocks: contentBlocks,
      published: normalizedBlog.published || false,
      coverImage: normalizedBlog.coverImage || null
    });
    
    // Set preview image properly - handle both File objects and string URLs
    if (normalizedBlog.coverImage) {
      if (normalizedBlog.coverImage instanceof File) {
        const url = URL.createObjectURL(normalizedBlog.coverImage);
        setPreviewImage(url);
      } else if (typeof normalizedBlog.coverImage === 'string') {
        setPreviewImage(getImageUrl(normalizedBlog.coverImage));
      }
    } else {
      setPreviewImage('');
    }
    setImageRemoved(false);
    
    setOpenEditModal(true);
  };





  const handleMenuClick = (event, blog) => {
    event.stopPropagation();
    if (!isAdmin) return;
    setSelectedBlog(blog);
    setOpenMenuForId(prev => (prev === blog._id ? null : blog._id));
  };

  const handleMenuClose = () => {
    setOpenMenuForId(null);
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const confirmDelete = (blog) => {
    setSelectedBlog(blog);
    setOpenDeleteModal(true);
  };

  const handleTogglePublish = async (blog) => {
    if (!isAdmin) {
      showSnackbar('You do not have permission to publish blogs', 'error');
      return;
    }
    // Optimistic update to avoid full page reload/refetch
    const blogId = blog._id;
    const previousState = blog.published;
    setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, published: !previousState } : b));
    try {
      // Use PATCH endpoint for toggle
      const response = await axios.patch(`${BaseUrl}/blogs/${blogId}/toggle`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Ensure author name is properly displayed
      const serverUpdated = response.data;
      const populatedAuthor = serverUpdated?.author && typeof serverUpdated.author === 'object' && serverUpdated.author?.name
        ? serverUpdated.author
        : (userData ? { _id: userId, name: userData.name, profileImage: userData.profileImage } : null);
      
      const updatedBlog = {
        ...serverUpdated,
        author: populatedAuthor
      };
      
      setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, ...updatedBlog } : b));
      showSnackbar(updatedBlog.published ? 'Blog published' : 'Blog moved to draft');
    } catch (error) {
      console.error('Error toggling publish:', error);
      // Revert optimistic change
      setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, published: previousState } : b));
      showSnackbar(error.response?.data?.message || 'Failed to toggle publish', 'error');
    } finally {
      handleMenuClose();
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    // Non-admins must only see published entries regardless of UI state
    if (!isAdmin && !blog.published) return false;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.author?.name && blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || 
                         (selectedStatus === 'Published' && blog.published) ||
                         (selectedStatus === 'Draft' && !blog.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return (a.author?.name || '').localeCompare(b.author?.name || '');
      default:
        return 0;
    }
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 9; // 3x3 grid
  const totalPages = Math.max(1, Math.ceil(sortedBlogs.length / pageSize));
  const pagedBlogs = sortedBlogs.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (_e, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header Section aligned with Cards page */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box
          sx={{
            mb: 1,
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative animated circles to exactly match Cards header vibe */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              zIndex: 0,
            }}
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
            style={{
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              zIndex: 0,
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Blog Hub
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 800 }}>
                Discover, create, and share knowledge across technology and more.
              </Typography>
            </Box>
            {isAdmin && (
              <Button
                variant="contained"
                onClick={() => { resetForm(); setOpenCreateModal(true); }}
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: '12px',
                  height: '56px',
                  minWidth: '180px',
                  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                  }
                }}
              >
                Create Blog
              </Button>
            )}
          </Box>
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
          </Box>
        )}
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SearchContainer>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'stretch',
            }}
          >
            <TextField
              fullWidth
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: { xs: '1', md: '2' },
                '& .MuiOutlinedInput-root': {
                  height: { xs: '48px', sm: '52px', md: '56px' },
                  borderRadius: '15px',
                },
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', md: 'auto' } }}>
              <FormControl sx={{ minWidth: { xs: '100%', sm: '260px' }, flex: { xs: 1, md: 'initial' } }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                  sx={{
                    borderRadius: '15px',
                    height: { xs: 48, sm: 52, md: 56 },
                    bgcolor: 'background.paper',
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {isAdmin && (
                <FormControl sx={{ minWidth: { xs: '100%', sm: '260px' }, flex: { xs: 1, md: 'initial' } }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    label="Status"
                    sx={{
                      borderRadius: '15px',
                      height: { xs: 48, sm: 52, md: 56 },
                      bgcolor: 'background.paper',
                    }}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        </SearchContainer>
      </motion.div>

      {/* Blogs Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(3, 1fr)',
            },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          <AnimatePresence>
            {pagedBlogs.map((blog, index) => {
              console.log(`🔍 Blog ${index + 1}:`, { 
                id: blog._id, 
                title: blog.title, 
                coverImage: blog.coverImage,
                hasImage: !!blog.coverImage,
                coverImageType: typeof blog.coverImage,
                isFile: blog.coverImage instanceof File
              });
              return (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{ 
                  width: '100%', 
                  display: 'flex'
                }}
              >
                <StyledCard sx={{ cursor: 'pointer', width: '100%' }} onClick={() => navigate(`/blogs/${blog.slug}`)}>
                    <Box sx={{ width: '100%', height: 200, bgcolor: getImageUrl(blog.coverImage) ? 'transparent' : 'grey.100', flexShrink: 0 }}>
                      {getImageUrl(blog.coverImage) && (
                        <CardMedia
                          component="img"
                          image={getImageUrl(blog.coverImage)}
                          alt={blog.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onLoad={() => {
                            console.log('✅ Image loaded successfully:', getImageUrl(blog.coverImage));
                          }}
                          onError={(e) => {
                            console.log('❌ Image failed to load:', getImageUrl(blog.coverImage));
                            console.log('❌ Blog data:', { id: blog._id, title: blog.title, coverImage: blog.coverImage });
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      {!getImageUrl(blog.coverImage) && (
                        <Box sx={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: 'grey.100',
                          color: 'grey.500'
                        }}>
                          <Typography variant="body2">No Image</Typography>
                        </Box>
                      )}
                    </Box>
                    {/* Admin quick actions: replace three-dots with direct icons */}
                    {isAdmin && (
                      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" aria-label="edit" onClick={() => handleEditClick(blog)} sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label="delete" onClick={() => confirmDelete(blog)} sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}

                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Chip
                          label={blog.category}
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '15px' }}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                          {blog.published ? (
                            <Chip
                              icon={<PublicIcon />}
                              label="Published"
                              color="success"
                              size="small"
                              sx={{ borderRadius: '15px' }}
                            />
                          ) : (
                            <Chip
                              icon={<LockIcon />}
                              label="Draft"
                              color="warning"
                              size="small"
                              sx={{ borderRadius: '15px' }}
                            />
                          )}
                          {isAdmin && !blog.published && (
                            <Switch
                              size="small"
                              checked={false}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleTogglePublish(blog)}
                            />
                          )}
                           {/* Removed inline menu button from body; using top-right one */}
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {blog.title}
                      </Typography>

                      {/* Render a short preview of content blocks */}
                      <Box sx={{ mb: 2, flexGrow: 1, overflow: 'hidden' }}>
                        {(Array.isArray(blog.contentBlocks) ? blog.contentBlocks : [])
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .slice(0, 2).map((block, i) => {
                          switch (block.type) {
                            case 'heading':
                              return (
                                <Typography key={i} variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {block.content}
                                </Typography>
                              );
                            case 'paragraph':
                              return (
                                <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {block.content}
                                </Typography>
                              );
                            case 'quote':
                              return (
                                <Box key={i} sx={{ borderLeft: 3, borderColor: 'primary.main', pl: 1.5, my: 1 }}>
                                  <Typography variant="body2" fontStyle="italic" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{block.content}</Typography>
                                </Box>
                              );
                            case 'code':
                              return (
                                <Box key={i} sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.75rem', overflowX: 'auto', mb: 1, maxHeight: '60px', overflowY: 'hidden' }}>
                                  <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {block.content}
                                  </Typography>
                                </Box>
                              );
                            case 'image':
                              return (
                                <Box key={i} sx={{ my: 1, maxHeight: '80px', overflow: 'hidden' }}>
                                  <img src={block.url} alt={block.content || 'image'} style={{ maxWidth: '100%', maxHeight: '80px', borderRadius: 8, objectFit: 'cover' }} />
                                </Box>
                              );
                            case 'list':
                              return (
                                <Box key={i} component="ul" sx={{ pl: 2, mb: 1, maxHeight: '60px', overflow: 'hidden' }}>
                                  {(block.content || '').split(',').slice(0, 2).map((item, idx) => (
                                    <li key={idx}>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{item.trim()}</Typography>
                                    </li>
                                  ))}
                                </Box>
                              );
                            case 'link':
                              return (
                                block.url ? (
                                  <a
                                    key={i}
                                    href={block.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      color: '#1976d2',
                                      cursor: 'pointer',
                                      textDecoration: 'none',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden'
                                    }}
                                    title={block.url}
                                  >
                                    {block.content || block.url}
                                  </a>
                                ) : (
                                  <Typography key={i} variant="body2" sx={{ color: '#1976d2', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: 'pointer' }}>
                                    {block.content}
                                  </Typography>
                                )
                              );
                            default:
                              return null;
                          }
                        })}
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Avatar
                          sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                        >
                          {(() => {
                            const authorName = blog.author?.name;
                            // If author name is an ID (24 character hex string), use fallback
                            if (authorName && /^[a-f0-9]{24}$/i.test(authorName)) {
                              return (userData?.name?.charAt(0) || userData?.username?.charAt(0) || 'C').toUpperCase();
                            }
                            return (authorName?.charAt(0) || userData?.name?.charAt(0) || userData?.username?.charAt(0) || 'C').toUpperCase();
                          })()}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {(() => {
                            const authorName = blog.author?.name;
                            // If author name is an ID (24 character hex string), use fallback
                            if (authorName && /^[a-f0-9]{24}$/i.test(authorName)) {
                              return userData?.name || userData?.username || 'Current User';
                            }
                            return authorName || userData?.name || userData?.username || 'Current User';
                          })()}
                        </Typography>
                      </Box>

                      <Box display="flex" flexWrap="wrap" gap={0.5} mb={1} sx={{ maxHeight: '40px', overflow: 'hidden' }}>
                        {blog.tags?.slice(0, 2).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '10px', fontSize: '0.7rem' }}
                          />
                        ))}
                        {blog.tags?.length > 2 && (
                          <Chip
                            label={`+${blog.tags.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '10px', fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                      {/* Meta Keywords chips (show like tags) */}
                      {Array.isArray(blog.metaKeywords) && blog.metaKeywords.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1} sx={{ maxHeight: '40px', overflow: 'hidden' }}>
                          {blog.metaKeywords.slice(0, 2).map((kw, index) => (
                            <Chip
                              key={index}
                              label={kw}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: '10px', fontSize: '0.7rem' }}
                            />
                          ))}
                          {blog.metaKeywords.length > 2 && (
                            <Chip
                              label={`+${blog.metaKeywords.length - 2}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: '10px', fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      )}

                      <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption" color="text.secondary">
                            {Array.isArray(blog.contentBlocks) ? blog.contentBlocks.filter(block => block.content && block.content.trim()).length : 0} blocks
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    {/* No hover action bar per requirement */}
                  </StyledCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>

        {sortedBlogs.length === 0 && (
          <Box textAlign="center" py={8}>
            <ArticleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              No blogs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or create a new blog
            </Typography>
          </Box>
        )}
      </motion.div>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
      </Box>

      {/* Create Blog action moved to header */}

      {/* Card-local action menus implemented above; removed global menu */}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)'
          }
        }}
      >
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{selectedBlog?.title}"?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button
            onClick={async () => {
              if (selectedBlog?._id) {
                await handleDeleteBlog(selectedBlog._id);
                setOpenDeleteModal(false);
              }
            }}
            variant="contained"
            color="error"
            sx={{ borderRadius: '10px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      {/* Create Blog Modal */}
      <Dialog
        open={openCreateModal}
        onClose={() => { setOpenCreateModal(false); resetForm(); }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
          color: 'white',
          py: 3,
          px: 4,
          '& .MuiTypography-root': {
            fontSize: '1.5rem',
            fontWeight: 600,
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
            <Box className="flex items-center gap-2">
              <AddIcon className='text-white' />
              Create New Blog
            </Box>
            <IconButton onClick={() => setOpenCreateModal(false)} size="small">
              <CloseIcon className='text-white' />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            {/* Title */}
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Slug */}
            <TextField
              fullWidth
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              error={!!formErrors.slug}
              helperText={formErrors.slug}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />

            {/* Meta Title */}
            <TextField
              fullWidth
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              error={!!formErrors.metaTitle}
              helperText={formErrors.metaTitle}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />

            {/* Meta Description */}
            <TextField
              fullWidth
              label="Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              multiline
              rows={3}
              error={!!formErrors.metaDescription}
              helperText={formErrors.metaDescription}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />

            {/* Category */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                error={!!formErrors.category}
                sx={{
                  borderRadius: '12px',
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                  </InputAdornment>
                }
              >
                {blogCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.category && (
                <FormHelperText error>{formErrors.category}</FormHelperText>
              )}
            </FormControl>

            {/* Keywords */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Meta Keywords
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  sx={{ flex: 1 }}
                />
                <Button onClick={addKeyword} variant="outlined" size="small">
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.metaKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    onDelete={() => removeKeyword(keyword)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  sx={{ flex: 1 }}
                />
                <Button onClick={addTag} variant="outlined" size="small">
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* Cover Image */}
            <Box sx={{ mb: 3 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="cover-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="cover-image-upload">
                <ImageUploadArea>
                  {previewImage ? (
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageRemove();
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          }
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" align="center">
                        Drop your cover image here or click to browse
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        Supports JPG, PNG files
                      </Typography>
                    </>
                  )}
                </ImageUploadArea>
              </label>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Content Blocks */}
            <Typography variant="h6" gutterBottom>
              Content Blocks
            </Typography>

            {formData.contentBlocks.map((block, index) => (
              <ContentBlockInput key={index}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      size="small"
                      value={block.type}
                      onChange={(e) => {
                        const updatedBlocks = [...formData.contentBlocks];
                        updatedBlocks[index] = { ...block, type: e.target.value };
                        setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                      }}
                      label="Type"
                    >
                      {contentBlockTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <ContentTypeIcon type={type.value} />
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    size="small"
                    label="Order"
                    type="number"
                    value={block.order || (index + 1)}
                    onChange={(e) => {
                      const updatedBlocks = [...formData.contentBlocks];
                      updatedBlocks[index] = { ...block, order: Number(e.target.value) };
                      setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                    }}
                    sx={{ minWidth: 80 }}
                    inputProps={{ min: 1 }}
                  />
                  
                  {block.type === 'heading' && (
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Heading Level</InputLabel>
                      <Select
                        value={block.level || 'h1'}
                        label="Heading Level"
                        onChange={(e) => {
                          const updatedBlocks = [...formData.contentBlocks];
                          updatedBlocks[index] = { ...block, level: e.target.value };
                          setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                        }}
                      >
                        {['h1','h2','h3','h4','h5','h6','h7'].map(lvl => (
                          <MenuItem key={lvl} value={lvl}>{lvl.toUpperCase()}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {block.type === 'code' && (
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={block.language || 'plaintext'}
                        label="Language"
                        onChange={(e) => {
                          const updatedBlocks = [...formData.contentBlocks];
                          updatedBlocks[index] = { ...block, language: e.target.value };
                          setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                        }}
                      >
                        {codeLanguages.map((lang) => (
                          <MenuItem key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <IconButton
                    onClick={() => removeContentBlock(index)}
                    color="error"
                    sx={{ ml: 'auto' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {block.type === 'image' && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Image URL"
                    value={block.url || ''}
                    onChange={(e) => {
                      const updatedBlocks = [...formData.contentBlocks];
                      updatedBlocks[index] = { ...block, url: e.target.value };
                      setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                    }}
                    sx={{ mt: 1 }}
                  />
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={block.type === 'list' ? 4 : 3}
                  value={block.content || ''}
                  onChange={(e) => {
                    const updatedBlocks = [...formData.contentBlocks];
                    updatedBlocks[index] = { ...block, content: e.target.value };
                    setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                  }}
                  placeholder={
                    block.type === 'list'
                      ? 'Enter items separated by new lines'
                      : block.type === 'heading'
                        ? 'Enter heading text'
                        : block.type === 'quote'
                          ? 'Enter quote text'
                          : block.type === 'code'
                            ? 'Enter code'
                            : block.type === 'link'
                              ? 'Enter link text'
                              : 'Enter paragraph text'
                  }
                  helperText={
                    block.type === 'list'
                      ? 'Each line will become a list item'
                      : ''
                  }
                />
                {block.type === 'link' && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Link URL"
                    value={block.url || ''}
                    onChange={(e) => {
                      const updatedBlocks = [...formData.contentBlocks];
                      updatedBlocks[index] = { ...block, url: e.target.value };
                      setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                    }}
                    sx={{ mt: 1 }}
                  />
                )}
              </ContentBlockInput>
            ))}

            {/* Add Content Block */}
            <Box sx={{ mb: 2 }}>
              {/* <FormControl sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  size="small"
                  value={newContentBlock.type}
                  onChange={(e) => setNewContentBlock(prev => ({ ...prev, type: e.target.value }))}
                  label="Type"
                >
                  {contentBlockTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <ContentTypeIcon type={type.value} />
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addContentBlock}
                size="small"
              >
                Add Block
              </Button>
            </Box>

            {/* Live Content Preview */}
            {formData.contentBlocks.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Content Preview
                </Typography>
                <Box sx={{ p: 3, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, bgcolor: 'background.paper' }}>
                  {formData.contentBlocks
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((block, i) => {
                    switch (block.type) {
                      case 'heading':
                        return (
                          <Typography key={i} variant="subtitle1" gutterBottom sx={getHeadingSx(block.level)}>
                            {block.content}
                          </Typography>
                        );
                      case 'paragraph':
                        return (
                          <Typography key={i} paragraph>
                            {block.content}
                          </Typography>
                        );
                      case 'quote':
                        return (
                          <Box key={i} sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 2, my: 2, py: 1 }}>
                            <Typography variant="body1" fontStyle="italic">
                              {block.content}
                            </Typography>
                          </Box>
                        );
                      case 'code':
                        return (
                          <Box key={i} sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', my: 1 }}>
                            {block.content}
                          </Box>
                        );
                      case 'image':
                        return (
                          <Box key={i} sx={{ my: 1 }}>
                            {block.url && (
                              <img
                                src={block.url}
                                alt={block.content || 'image'}
                                style={{ width: '240px', height: '160px', objectFit: 'cover', borderRadius: 8, display: 'block' }}
                              />
                            )}
                            {block.content && (
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                {block.content}
                              </Typography>
                            )}
                          </Box>
                        );
                      case 'list':
                        return (
                          <Box key={i} component="ul" sx={{ pl: 3, my: 1, listStyleType: 'disc' }}>
                            {(block.content || '').split('\n').filter(Boolean).map((item, idx) => (
                              <Typography key={idx} component="li" sx={{ '::marker': { color: 'text.primary' }, mb: 0.5 }}>
                                {item}
                              </Typography>
                            ))}
                          </Box>
                        );
                      case 'link':
                        return (
                          block.url ? (
                            <a
                              key={i}
                              href={block.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'none' }}
                              title={block.url}
                            >
                              {block.content || block.url}
                            </a>
                          ) : (
                            <Typography key={i} variant="body1" color="primary.main" sx={{ mb: 1, cursor: 'pointer' }}>
                              {block.content}
                            </Typography>
                          )
                        );
                      default:
                        return null;
                    }
                  })}
                </Box>
              </>
            )}

            {/* Removed Publish immediately switch */}
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 4,
          background: 'linear-gradient(135deg, rgba(249,250,251,0.9), rgba(255,255,255,0.9))'
        }}>
          <Button
            onClick={() => setOpenCreateModal(false)}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleCreateBlog}
            loading={submitting}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
              }
            }}
          >
            Create Blog
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Edit Blog Modal */}
      <Dialog
        open={openEditModal}
        onClose={() => { setOpenEditModal(false); setEditingBlog(null); resetForm(); }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
          backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
          color: 'white',
          py: 3,
          px: 4,
          '& .MuiTypography-root': {
            fontSize: '1.5rem',
            fontWeight: 600,
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
            <Box className="flex items-center gap-2">
              <EditIcon className='text-white' />
              Edit Blog
        </Box>
            <IconButton onClick={() => { setOpenEditModal(false); setEditingBlog(null); resetForm(); }} size="small">
              <CloseIcon className='text-white' />
        </IconButton>
          </Box>
      </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            {/* Same form fields as create modal */}
                <TextField
                  fullWidth
                  label="Title"
              name="title"
                  value={formData.title}
              onChange={handleTitleChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />

                <TextField
                  fullWidth
                  label="Slug"
              name="slug"
                  value={formData.slug}
              onChange={handleInputChange}
              error={!!formErrors.slug}
              helperText={formErrors.slug}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />

            <TextField
              fullWidth
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              error={!!formErrors.metaTitle}
              helperText={formErrors.metaTitle}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />

            <TextField
              fullWidth
              label="Meta Description"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              multiline
              rows={3}
              error={!!formErrors.metaDescription}
              helperText={formErrors.metaDescription}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                name="category"
                    value={formData.category}
                onChange={handleInputChange}
                error={!!formErrors.category}
                sx={{
                  borderRadius: '12px',
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                  </InputAdornment>
                }
              >
                {blogCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
                  </Select>
              {formErrors.category && (
                <FormHelperText error>{formErrors.category}</FormHelperText>
              )}
            </FormControl>

            {/* Keywords */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                    Meta Keywords
                  </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      placeholder="Add keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  sx={{ flex: 1 }}
                    />
                    <Button onClick={addKeyword} variant="outlined" size="small">
                      Add
                    </Button>
                  </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.metaKeywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        onDelete={() => removeKeyword(keyword)}
                        size="small"
                    color="primary"
                    variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

          {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  sx={{ flex: 1 }}
              />
              <Button onClick={addTag} variant="outlined" size="small">
                Add
              </Button>
            </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  size="small"
                    color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
            </Box>

            {/* Cover Image */}
            <Box sx={{ mb: 3 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="edit-cover-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="edit-cover-image-upload">
                <ImageUploadArea>
                  {previewImage || (editingBlog?.coverImage && getImageUrl(editingBlog.coverImage)) ? (
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <img
                        src={previewImage || getImageUrl(editingBlog.coverImage)}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                        onError={(e) => {
                          console.log('❌ Image failed to load in edit modal:', previewImage || getImageUrl(editingBlog.coverImage));
                          e.target.style.display = 'none';
                        }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageRemove();
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          }
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" align="center">
                        Drop your cover image here or click to browse
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        Supports JPG, PNG files
                      </Typography>
                    </>
                  )}
                </ImageUploadArea>
              </label>
            </Box>

            <Divider sx={{ my: 3 }} />

          {/* Content Blocks */}
            <Typography variant="h6" gutterBottom>
              Content Blocks
            </Typography>
            
            {formData.contentBlocks.map((block, index) => (
              <ContentBlockInput key={index}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      size="small"
                      value={block.type}
                      onChange={(e) => {
                        const updatedBlocks = [...formData.contentBlocks];
                        updatedBlocks[index] = { ...block, type: e.target.value };
                        setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                      }}
                      label="Type"
                    >
                      {contentBlockTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <ContentTypeIcon type={type.value} />
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    size="small"
                    label="Order"
                    type="number"
                    value={block.order || (index + 1)}
                    onChange={(e) => {
                      const updatedBlocks = [...formData.contentBlocks];
                      updatedBlocks[index] = { ...block, order: Number(e.target.value) };
                      setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                    }}
                    sx={{ minWidth: 80 }}
                    inputProps={{ min: 1 }}
                  />
                  
                  {block.type === 'heading' && (
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Heading Level</InputLabel>
                      <Select
                        value={block.level || 'h1'}
                        label="Heading Level"
                        onChange={(e) => {
                          const updatedBlocks = [...formData.contentBlocks];
                          updatedBlocks[index] = { ...block, level: e.target.value };
                          setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                        }}
                      >
                        {['h1','h2','h3','h4','h5','h6','h7'].map(lvl => (
                          <MenuItem key={lvl} value={lvl}>{lvl.toUpperCase()}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {block.type === 'code' && (
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={block.language || 'plaintext'}
                        label="Language"
                        onChange={(e) => {
                          const updatedBlocks = [...formData.contentBlocks];
                          updatedBlocks[index] = { ...block, language: e.target.value };
                          setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                        }}
                      >
                        {codeLanguages.map((lang) => (
                          <MenuItem key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <IconButton
                    onClick={() => removeContentBlock(index)}
                    color="error"
                    sx={{ ml: 'auto' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {block.type === 'image' && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Image URL"
                    value={block.url || ''}
                    onChange={(e) => {
                      const updatedBlocks = [...formData.contentBlocks];
                      updatedBlocks[index] = { ...block, url: e.target.value };
                      setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                    }}
                    sx={{ mt: 1 }}
                  />
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={block.type === 'list' ? 4 : 3}
                  value={block.content || ''}
                  onChange={(e) => {
                    const updatedBlocks = [...formData.contentBlocks];
                    updatedBlocks[index] = { ...block, content: e.target.value };
                    setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                  }}
                  placeholder={
                    block.type === 'list'
                      ? 'Enter items separated by new lines'
                      : block.type === 'heading'
                        ? 'Enter heading text'
                        : block.type === 'quote'
                          ? 'Enter quote text'
                          : block.type === 'code'
                            ? 'Enter code'
                            : block.type === 'link'
                              ? 'Enter link text'
                              : 'Enter paragraph text'
                  }
                  helperText={
                    block.type === 'list'
                      ? 'Each line will become a list item'
                      : ''
                  }
                />
                {block.type === 'link' && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Link URL"
                    value={block.url || ''}
                    onChange={(e) => {
                      const updatedBlocks = [...formData.contentBlocks];
                      updatedBlocks[index] = { ...block, url: e.target.value };
                      setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                    }}
                    sx={{ mt: 1 }}
                  />
                )}
              </ContentBlockInput>
            ))}

            {/* Add Content Block (match create modal: button only) */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addContentBlock}
                size="small"
              >
                Add Block
              </Button>
            </Box>

            {/* Live Content Preview for Edit modal */}
            {formData.contentBlocks.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Content Preview
                </Typography>
                <Box sx={{ p: 3, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, bgcolor: 'background.paper' }}>
                  {formData.contentBlocks
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((block, i) => {
                    switch (block.type) {
                      case 'heading':
                        return (
                          <Typography key={i} variant="subtitle1" gutterBottom sx={getHeadingSx(block.level)}>
                            {block.content}
                          </Typography>
                        );
                      case 'paragraph':
                        return (
                          <Typography key={i} paragraph>
                            {block.content}
                          </Typography>
                        );
                      case 'quote':
                        return (
                          <Box key={i} sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 2, my: 2, py: 1 }}>
                            <Typography variant="body1" fontStyle="italic">
                              {block.content}
                            </Typography>
                          </Box>
                        );
                      case 'code':
                        return (
                          <Box key={i} sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', my: 1 }}>
                            {block.content}
                          </Box>
                        );
                      case 'image':
                        return (
                          <Box key={i} sx={{ my: 1 }}>
                            {block.url && (
                              <img
                                src={block.url}
                                alt={block.content || 'image'}
                                style={{ width: '240px', height: '160px', objectFit: 'cover', borderRadius: 8, display: 'block' }}
                              />
                            )}
                            {block.content && (
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                {block.content}
                              </Typography>
                            )}
                          </Box>
                        );
                      case 'list':
                        return (
                          <Box key={i} component="ul" sx={{ pl: 3, my: 1, listStyleType: 'disc' }}>
                            {(block.content || '').split('\n').filter(Boolean).map((item, idx) => (
                              <Typography key={idx} component="li" sx={{ '::marker': { color: 'text.primary' }, mb: 0.5 }}>
                                {item}
                              </Typography>
                            ))}
                          </Box>
                        );
                      case 'link':
                        return (
                          block.url ? (
                            <a
                              key={i}
                              href={block.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'none' }}
                              title={block.url}
                            >
                              {block.content || block.url}
                            </a>
                          ) : (
                            <Typography key={i} variant="body1" sx={{ mb: 1, color: '#1976d2', cursor: 'pointer' }}>
                              {block.content}
                            </Typography>
                          )
                        );
                      default:
                        return null;
                    }
                  })}
                </Box>
              </>
            )}

            {/* Removed Publish immediately switch */}
        </Box>
      </DialogContent>

        <DialogActions sx={{
          p: 4,
          background: 'linear-gradient(135deg, rgba(249,250,251,0.9), rgba(255,255,255,0.9))'
        }}>
        <Button
            onClick={() => { setOpenEditModal(false); setEditingBlog(null); resetForm(); }}
          variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
            }}
        >
          Cancel
        </Button>
          <LoadingButton
            onClick={handleUpdateBlog}
            loading={submitting}
          variant="contained"
            startIcon={<SaveIcon />}
          sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
              textTransform: 'none',
            px: 3,
            '&:hover': {
                background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
              }
          }}
        >
            Update Blog
          </LoadingButton>
      </DialogActions>
    </Dialog>

      {/* Toasts handled by ToastContainer at top-right */}
    </Container>
  );
};


export default BlogsPage;
