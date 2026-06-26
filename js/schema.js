var schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Gensar IT Solutions Pvt Ltd",
  "url": "https://gensardemo.netlify.app",
  "logo": "https://gensardemo.netlify.app/img/gensar_logo.png",
  "description": "Gensar IT Solutions Pvt Ltd is a trusted technology partner delivering innovative IT services, professional training, and industry-focused internship programs.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "addressCountry": "India"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-888-555-9988",
    "contactType": "customer service",
    "email": "info@gensarsolutions.com"
  },
  "sameAs": [
    "https://www.linkedin.com/company/gensar-solutions",
    "https://www.facebook.com/gensarsolutions"
  ]
};
var script = document.createElement('script');
script.type = 'application/ld+json';
script.textContent = JSON.stringify(schemaOrg);
document.head.appendChild(script);
