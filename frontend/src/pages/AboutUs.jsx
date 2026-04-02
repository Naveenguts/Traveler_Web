import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <a href="/">Home</a>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">About Travelers</span>
      </div>

      {/* Hero Section - Who We Are */}
      <section className="about-section hero-section">
        <div className="hero-image-wrapper">
          <img 
            src="https://via.placeholder.com/1600x600/4ECDC4/FFFFFF?text=About+Us" 
            alt="Green forest and river" 
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <h1 className="about-title">Who we are</h1>
          <p className="about-subtitle">Discover our mission, values, and the people behind Travelers</p>
        </div>
      </section>

      {/* About Company Section */}
      <section className="about-section company-info-section">
        <div className="about-content-wrapper">
          <div className="about-text-block">
            <h2 className="about-section-title">We are a travel company<br/>that cares.</h2>
            <p className="about-description">
              We believe remarkable things happen when people care. Travelers takes on the risk and provides the coverage and service you need to help protect the things that are important to you — your home, your car, your valuables and your business. Over the past 170+ years, we have earned a reputation as one of the best property casualty insurers in the industry because of our extraordinary dedication to our customers and our communities.
            </p>
            <p className="about-description">
              Our deep risk expertise, focus on innovation and sense of responsibility to the people we are privileged to serve have made us a leader in personal, business and specialty insurance and the only property casualty company in the Dow Jones Industrial Average. Our more than 30,000 employees and 15,000 independent agents and brokers in the United States, Canada, the United Kingdom and Ireland help bring peace of mind to our customers.
            </p>
          </div>
          <div className="about-image-block">
            <img 
              src="https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Our+Team" 
              alt="Modern architecture" 
              className="about-image"
              style={{ borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      {/* Three Column Section */}
      <section className="about-section three-column-section">
        <div className="three-columns">
          <div className="column-item">
            <h3 className="column-title">Individuals</h3>
            <p className="column-description">
              We help when the unexpected happens. You don't always see what's around the corner, but you can be ready.
            </p>
          </div>
          <div className="column-item">
            <h3 className="column-title">Businesses</h3>
            <p className="column-description">
              We offer broad insurance options to identify and reduce risks for businesses of any size.
            </p>
          </div>
          <div className="column-item">
            <h3 className="column-title">History</h3>
            <p className="column-description">
              We've earned a reputation over more than 170 years because we take care of our customers.
            </p>
          </div>
        </div>
      </section>

      {/* Diversity Section */}
      <section className="about-section alternate-section">
        <div className="alternate-content">
          <div className="alternate-image">
            <img 
              src="https://via.placeholder.com/300x300/45B7D1?text=Diversity" 
              alt="Diversity and inclusion" 
              className="alternate-img"
            />
          </div>
          <div className="alternate-text">
            <h3 className="alternate-title">Diversity and inclusion</h3>
            <p className="alternate-description">
              We share a commitment to embracing the power of our differences to continue building an inclusive culture.
            </p>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="about-section alternate-section reverse">
        <div className="alternate-content">
          <div className="alternate-text">
            <h3 className="alternate-title">Sustainability</h3>
            <p className="alternate-description">
              We're committed to performing today, transforming for tomorrow and fulfilling our promise to our customers, communities and employees.
            </p>
            <button className="about-button">More Sustainability</button>
          </div>
          <div className="alternate-image">
            <img 
              src="https://via.placeholder.com/300x300/A29BFE/FFFFFF?text=Sustainability" 
              alt="Sustainability" 
              className="alternate-img"
            />
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="about-section alternate-section">
        <div className="alternate-content">
          <div className="alternate-image">
            <img 
              src="https://via.placeholder.com/300x300/FFA07A/FFFFFF?text=Community" 
              alt="Community" 
              className="alternate-img"
            />
          </div>
          <div className="alternate-text">
            <h3 className="alternate-title">Community</h3>
            <p className="alternate-description">
              With a focus on equity and inclusion, we target our giving and volunteerism to help improve academic and career success, develop thriving neighborhoods and create culturally enriched communities.
            </p>
            <button className="about-button">More Community</button>
          </div>
        </div>
      </section>

      {/* Citizen Travelers Section */}
      <section className="about-section alternate-section reverse">
        <div className="alternate-content">
          <div className="alternate-text">
            <h3 className="alternate-title">Citizen Travelers</h3>
            <p className="alternate-description">
              We provide nonpartisan resources and support to encourage civic involvement, develop leaders and inspire a coalition of engaged citizens and businesses.
            </p>
            <button className="about-button">More Citizen Travelers<sup>SM</sup></button>
          </div>
          <div className="alternate-image">
            <img 
              src="https://via.placeholder.com/300x300/98D8C8/FFFFFF?text=Citizen+Travelers" 
              alt="Citizen Travelers" 
              className="alternate-img"
            />
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="about-section alternate-section">
        <div className="alternate-content">
          <div className="alternate-image">
            <img 
              src="https://via.placeholder.com/300x300/6C5CE7/FFFFFF?text=Careers"
              alt="Careers" 
              className="alternate-img"
            />
          </div>
          <div className="alternate-text">
            <h3 className="alternate-title">Careers</h3>
            <p className="alternate-description">
              We employ some of the most talented and passionate people in the industry, and we're always looking for new team members.
            </p>
            <button className="about-button">More Careers</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
