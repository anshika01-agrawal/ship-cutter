import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

export default function ImageUpload({ onUploaded, defaultCategory = 'cutting' }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);

    try {
      const res = await api.uploadPhoto(formData);
      setStatusMessage({ type: 'success', text: 'Image successfully uploaded to platform storage.' });
      if (onUploaded) onUploaded(res);
      setTimeout(() => {
        handleClear();
      }, 1500);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload photo.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card-surface p-6 border border-dark-border bg-dark-card">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <UploadCloud className="w-4 h-4 text-accent-cyan" />
        <span>Field Inspection & Media Upload</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop zone */}
        {!preview ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-dark-border hover:border-neutral-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-900/40"
          >
            <ImageIcon className="w-10 h-10 text-neutral-500 mb-2" />
            <span className="text-sm font-medium text-white">Click or drag image here</span>
            <span className="text-xs text-text-secondary mt-1">PNG, JPG, WEBP up to 25MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-neutral-700 max-h-64 flex items-center justify-center bg-black">
            <img src={preview} alt="Upload preview" className="max-h-64 object-contain" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-white hover:bg-red-900/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-text-secondary mb-1">IMAGE TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hull Cut Line Segment 4"
              className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary mb-1">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
            >
              <option value="robot">🤖 Robotic Crawler & Autonomous Units</option>
              <option value="machine">⚙️ Industrial Machinery & Plasma Cutters</option>
              <option value="cutting">🔥 Cutting In-Progress</option>
              <option value="parts">🧩 Extracted Structural Parts</option>
              <option value="material">♻️ Recycled Material / Scrap</option>
              <option value="before_after">⚖️ Before & After Dismantling</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1">NOTES / DESCRIPTION</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Thermal bevel angle, kerf measurement, or operator notes..."
            className="w-full bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-400 resize-none"
          />
        </div>

        {/* Status */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                : 'bg-red-950/40 text-red-300 border border-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || isUploading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
        >
          {isUploading ? 'Uploading to Server...' : 'Confirm & Upload Image'}
        </button>
      </form>
    </div>
  );
}
