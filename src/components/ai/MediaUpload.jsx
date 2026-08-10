import React, { useState, useRef } from 'react';
import { X, FileText, Loader2, Paperclip, ImageDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const IMAGE_RE = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;
const MAX_DIMENSION = 1600; // px
const JPEG_QUALITY = 0.85;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB guard
const TARGET_IMAGE_SIZE = 3 * 1024 * 1024; // keep compressed images under 3MB

function isImageUrl(url = '') {
  return IMAGE_RE.test(url) || /image\//i.test(url) || url.includes('/images/');
}

/**
 * Compress/resize an image File through a canvas before upload.
 * Returns a File (JPEG) when compression is useful, otherwise the original.
 */
const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * Compress/resize an image File through a canvas before upload.
 * Progressively shrinks dimensions and quality until the result fits
 * TARGET_IMAGE_SIZE, so large camera images never fail to upload.
 * Returns the smallest produced File (JPEG), or the original on failure.
 */
async function compressImage(file) {
  if (!file.type.startsWith('image/')) return file;
  // Skip SVG/GIF (can't meaningfully recompress via canvas)
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
  try {
    const dataUrl = await readAsDataURL(file);
    const img = await loadImage(dataUrl);
    const { width, height } = img;
    let scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const safeName = (file.name || 'image').replace(/\.[^.]+$/, '') + '.jpg';
    let best = file;
    for (let attempt = 0; attempt < 3 && scale > 0.05; attempt++) {
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const quality = Math.max(0.5, JPEG_QUALITY - attempt * 0.12);
      const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
      if (!blob) break;
      const candidate = new File([blob], safeName, { type: 'image/jpeg' });
      if (candidate.size < best.size) best = candidate;
      if (candidate.size <= TARGET_IMAGE_SIZE) break;
      scale *= 0.65; // shrink further if still too large
    }
    return best;
  } catch {
    return file; // fallback to original if compression fails (e.g. HEIC on Chrome)
  }
}

/**
 * Upload a single file with one automatic retry to absorb transient
 * network/server hiccups. Returns the file_url or null.
 */
const uploadWithRetry = async (file) => {
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (file_url) return file_url;
    } catch (e) {
      lastErr = e;
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 600));
  }
  return null;
};

/**
 * Reusable media/file uploader for AI analysis features.
 * Uploads files via Core.UploadFile and exposes the resulting URLs to the parent.
 */
export default function MediaUpload({
  fileUrls = [],
  onChange,
  label = 'Lampirkan gambar/file',
  compact = false,
  accept = 'image/*,.pdf,.doc,.docx,.txt,.csv,.json',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setError('');
    // Size guard
    const oversized = Array.from(files).filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length) {
      setError(`Ukuran file melebihi ${MAX_FILE_SIZE / 1024 / 1024}MB. Kecilkan/ukur ulang dahulu.`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setUploading(true);
    try {
      const uploaded = [];
      const failed = [];
      for (const file of Array.from(files)) {
        const prepared = await compressImage(file);
        const url = await uploadWithRetry(prepared);
        if (url) uploaded.push(url);
        else failed.push(file.name || 'file');
      }
      if (uploaded.length) onChange([...fileUrls, ...uploaded]);
      if (failed.length && !uploaded.length) {
        setError(`Gagal mengunggah ${failed.length} file setelah percobaan ulang. Coba perkecil ukuran atau ganti format (JPG/PNG).`);
      } else if (failed.length) {
        setError(`Sebagian file gagal diunggah: ${failed.join(', ')}. File lain berhasil.`);
      } else if (!uploaded.length) {
        setError('Unggah selesai tetapi tidak ada URL file yang dikembalikan.');
      }
    } catch (e) {
      const detail = e?.message || e?.error || e?.details || (typeof e === 'string' ? e : 'Gagal mengunggah file.');
      setError(`Gagal mengunggah: ${detail}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeFile = (idx) => onChange(fileUrls.filter((_, i) => i !== idx));

  return (
    <div className={compact ? '' : 'space-y-2'}>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
          {uploading ? 'Mengunggah...' : label}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {fileUrls.length > 0 && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <ImageDown className="w-3 h-3" />
            {fileUrls.length} file terlampir untuk analisis AI
          </span>
        )}
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {fileUrls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {fileUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              {isImageUrl(url) ? (
                <img src={url} alt="lampiran" className="w-14 h-14 object-cover rounded-lg border border-border" />
              ) : (
                <div className="w-14 h-14 rounded-lg border border-border bg-secondary flex flex-col items-center justify-center gap-0.5 p-1">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[8px] text-muted-foreground truncate w-full text-center leading-tight">
                    {decodeURIComponent(url.split('/').pop() || 'file').slice(0, 10)}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity shadow"
                aria-label="Hapus lampiran"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}