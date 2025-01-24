```markdown
# 📧 EmailBuilder - Next-Gen Email Template Development Toolkit 🚀

A modern email template builder that transforms your marketing workflow ⚡. Craft stunning, responsive email templates with real-time previews, cloud-powered asset management, and seamless HTML export.

![EmailBuilder Demo](https://emailmaker.vercel.app/)

## 🎯 Features

- **🖥️ Visual Template Studio**  
  Simple interface with preview

- **🌩️ Cloud-Powered Workflow**  
  Integrated with Cloudinary for instant image uploads & CDN distribution

- **📦 Template Versioning**  
  Save templates with MongoDB backend

- **⚡ One-Click Export**  
  Generate production-ready HTML/CSS with semantic markup

- **🔮 Smart Previews**  
  Real-time rendering across multiple email client viewports

- **🧩 Component Library**  
  Pre-built responsive blocks for rapid template assembly

## 🛠️ Tech Stack

| Layer                | Technology                          |
|----------------------|-------------------------------------|
| **Frontend**         | Next.js, React and TypeScript
| **Styling**          | Tailwind CSS
| **Cloud Services**   | Cloudinary
| **Database**         | MongoDB

## 🚀 Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/PushpendraJaat/emailbuilder.git
   cd emailbuilder
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**  
   Create `.env.local` file:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/uploadImage` | POST | Securely upload images to Cloudinary CDN |
| `/api/uploadEmailConfig` | POST | Save template configurations to MongoDB |
| `/api/renderAndDownloadTemplate` | POST | Generate downloadable HTML package |
| `/api/getEmailLayout` | GET | Retrieve base email template structure |
| `/api/getImages` | GET | Retrieve all uploaded images |
| `/api/getTemplates` | GET | Retrieve all saved templates |


## 🔧 Configuration Guide

1. **Cloudinary Setup**  
   Create free account at [cloudinary.com](https://cloudinary.com) and add API credentials

2. **MongoDB Atlas**  
   Set up free cluster: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

3. **Template Customization**  
   Modify base template in `/uploads/layout2.html`

## 🤝 Contributing

We welcome contributions! Please follow our guidelines:
```bash
1. Fork the repository
2. Create feature branch: git checkout -b amazing-feature
3. Commit changes: git commit -m 'Add amazing feature'
4. Push to branch: git push origin amazing-feature
5. Open Pull Request
```

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

**Crafted with ❤️ by Pushpendra Sharma**  
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/PushpendraJaat)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/pushpendrajaat)

**Like this project? Give it a ⭐ and share with your network!**
```