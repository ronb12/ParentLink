import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFiles, createFileRecord } from '../firebase/firestore';
import { uploadFile, generateFilePath } from '../firebase/storage';
import { Plus, Upload, FileText, Image, File, Download, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Files = () => {
  const { user, userData, isTeacher } = useAuth();
  const [files, setFiles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sharedWith: []
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      loadFiles();
    }
  }, [user]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      if (!user || !user.uid) {
        console.error('User not authenticated');
        setFiles([]);
        return;
      }
      
      // Get files shared with this user
      const filesData = await getFiles(user.uid);
      setFiles(filesData);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !formData.title.trim()) {
      toast.error('Please select a file and enter a title');
      return;
    }

    setUploading(true);

    try {
      // Upload file to Firebase Storage
      const filePath = generateFilePath(user.uid, selectedFile.name);
      const downloadURL = await uploadFile(selectedFile, filePath);

      // Create file record in Firestore
      await createFileRecord({
        title: formData.title.trim(),
        description: formData.description.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        downloadURL,
        filePath,
        uploadedBy: user.uid,
        uploadedByName: userData.name,
        sharedWith: formData.sharedWith,
        uploadedAt: new Date()
      });

      toast.success('File uploaded successfully');
      setShowUploadForm(false);
      setFormData({
        title: '',
        description: '',
        sharedWith: []
      });
      setSelectedFile(null);
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-600" />;
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return <FileText className="h-8 w-8 text-red-600" />;
    } else {
      return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.downloadURL;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          <p className="text-gray-600">Share and access documents, images, and other files</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.fileType)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{file.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{file.fileName}</p>
                  </div>
                </div>
              </div>

              {file.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{file.description}</p>
              )}

              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{formatFileSize(file.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span>{file.uploadedAt && format(file.uploadedAt.toDate(), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>By:</span>
                  <span>{file.uploadedByName}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => window.open(file.downloadURL, '_blank')}
                  className="btn-primary flex items-center justify-center"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-500 mb-4">
              Upload your first file to start sharing documents with parents and teachers.
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Upload className="h-4 w-4" />
              <span>Upload File</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter file title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Enter file description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="input-field"
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="btn-secondary flex-1"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
