'use client';
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploader from './ImageUploader';

export default function EmailBuilder() {
  const [layout, setLayout] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchEmailLayout = async () => {
      try {
        const response = await fetch('/api/getEmailLayout');
        if (!response.ok) throw new Error('Failed to fetch email layout');
        const data = await response.text();
        setLayout(data);
      } catch (error) {
        console.error('Error fetching email layout:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchEmailLayout();
  }, []);

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const emailConfig = { title, content, imageUrl };
      const response = await fetch('/api/uploadEmailConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to save email template');
      }
      alert('Email template saved successfully!');
    } catch (error) {
      console.error('Error saving email template:', error);
      alert('Error saving email template');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/renderAndDownloadTemplate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email_template.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating email template:', error);
      alert('Error generating email template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {pageLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Email Configuration Card */}
            <Card className="shadow-lg border border-gray-200 rounded-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Email Configuration
                </h2>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="title" className="text-gray-600">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter email title"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content" className="text-gray-600">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter email content"
                      rows={5}
                      className="mt-2"
                    />
                  </div>
                  <ImageUploader onImageUpload={handleImageUpload} />
                  <div className="flex flex-wrap gap-4 mt-4">
                    <Button onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Saving...' : 'Save Template'}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      disabled={loading}
                    >
                      {loading ? 'Downloading...' : 'Download HTML'}
                    </Button>
                    <Button><Link href="/images">View Uploaded Images</Link> </Button>
                    <Button><Link href="/templatess">View Saved Templates</Link> </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Preview Card */}
            <Card className="shadow-lg border border-gray-200 rounded-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Preview</h2>
                <div
                  className="border border-dashed border-gray-300 bg-white p-6 rounded-md shadow-sm"
                  dangerouslySetInnerHTML={{
                    __html: layout
                      .replace(/{{title}}/g, title || 'Your Title Here')
                      .replace(/{{content}}/g, content || 'Your Content Here')
                      .replace(/{{imageUrl}}/g, imageUrl || ''),
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
