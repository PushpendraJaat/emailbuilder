'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ImageUploaderProps {
  onImageUpload: (url: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onImageUpload(data.url)
      } else {
        alert('Error uploading image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Upload Image</Label>
      <Input id="image" type="file" onChange={handleFileChange} accept="image/*" />
      <Button onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
    </div>
  )
}

