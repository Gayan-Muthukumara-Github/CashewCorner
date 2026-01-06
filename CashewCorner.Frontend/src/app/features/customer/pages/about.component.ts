import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-about',
  standalone: true,
  template: `
    <div class="about-page">
      <div class="hero-section">
        <div class="container">
          <h1>About Cashew Corner</h1>
          <p class="hero-subtitle">Premium Quality Cashews Delivered Fresh to Your Door</p>
        </div>
      </div>
      
      <div class="content-section">
        <div class="container">
          <div class="story-grid">
            <div class="story-text">
              <h2>Our Story</h2>
              <p>Founded with a passion for quality and freshness, Cashew Corner has been delivering premium cashew products to customers worldwide. We source our cashews from the finest orchards and ensure they reach you in perfect condition.</p>
              
              <h3>Our Mission</h3>
              <p>To provide the highest quality cashew products while maintaining sustainable practices and supporting local farming communities.</p>
              
              <h3>Quality Promise</h3>
              <ul>
                <li>Fresh, premium-grade cashews</li>
                <li>Carefully selected and processed</li>
                <li>Quality tested before packaging</li>
                <li>Fast and secure delivery</li>
              </ul>
            </div>
            
            <div class="story-image">
              <div class="image-placeholder">
                <img src="https://imgs.search.brave.com/rN_3lmsO2B6-KLn0SjLQIQiSrmDnUKbp8XT-E4PxK-I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjcv/OTA1LzY1OS9zbWFs/bC9hLWJvd2wtb2Yt/cm9hc3RlZC1jYXNo/ZXdzLXJlYWR5LXRv/LWVhdC1hLWhlYWx0/aHktc25hY2stcG5n/LnBuZw" alt="Cashew Corner" class="brand-icon" />
                <p>Premium Cashews</p>
              </div>
            </div>
          </div>
          
          <div class="values-section">
            <h2>Our Values</h2>
            <div class="values-grid">
              <div class="value-card">
                <div class="value-icon">🌱</div>
                <h3>Sustainability</h3>
                <p>We support sustainable farming practices and eco-friendly packaging.</p>
              </div>
              <div class="value-card">
                <div class="value-icon">⭐</div>
                <h3>Quality</h3>
                <p>Every product is carefully selected and quality tested before reaching you.</p>
              </div>
              <div class="value-card">
                <div class="value-icon">🤝</div>
                <h3>Community</h3>
                <p>We work directly with local farmers to support their communities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .about-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    .brand-icon {
      width: 400px;
      height: 400px;
      object-fit: contain;
    }

    .hero-section {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }
    
    .hero-section h1 {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      background: linear-gradient(45deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin: 0;
    }
    
    .content-section {
      padding: 4rem 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .story-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 4rem;
      margin-bottom: 4rem;
    }
    
    .story-text h2 {
      font-size: 2rem;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }
    
    .story-text h3 {
      font-size: 1.5rem;
      color: #334155;
      margin: 2rem 0 1rem 0;
    }
    
    .story-text p {
      color: #64748b;
      line-height: 1.7;
      margin: 0 0 1.5rem 0;
    }
    
    .story-text ul {
      color: #64748b;
      line-height: 1.7;
      padding-left: 1.5rem;
    }
    
    .story-text li {
      margin-bottom: 0.5rem;
    }
    
    .story-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .image-placeholder {
      background: white;
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border: 2px solid #e2e8f0;
    }
    
    .image-placeholder span {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }
    
    .image-placeholder p {
      color: #64748b;
      font-weight: 600;
      margin: 0;
    }
    
    .values-section h2 {
      text-align: center;
      font-size: 2rem;
      color: #1e293b;
      margin: 0 0 3rem 0;
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .value-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .value-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    
    .value-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .value-card h3 {
      font-size: 1.25rem;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }
    
    .value-card p {
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem;
      }
      
      .story-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .container {
        padding: 0 1rem;
      }
    }
    `
  ]
})
export class AboutComponent {}


