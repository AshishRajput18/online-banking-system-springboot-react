import React from 'react';

const ExperienceSection = () => {
  return (
    <section
      style={{
        width: '100%',
        minHeight: '450px',
        backgroundColor: '#eae3d2', // slightly different shade to separate sections
        display: 'flex',
        alignItems: 'center',
        padding: '40px 5%',
        boxSizing: 'border-box'
      }}
    >
      {/* LEFT SIDE TEXT */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start', // left-aligned text
          paddingRight: '40px'
        }}
      >
        <h1
          style={{
            color: '#8B0000',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '20px',
            fontFamily: 'Georgia, serif'
          }}
        >
          Experience Effortless Financial Management
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#4a4a4a',
            lineHeight: '1.6',
            marginBottom: '12px'
          }}
        >
          Discover a new level of financial control through our intuitive Online Banking System. 
          Seamlessly manage your banking experience. Whether you're transferring funds, depositing savings, or making withdrawals, our platform ensures security and user-friendly interface.
        </p>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#4a4a4a',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}
        >
          Empower yourself with effortless financial management and enjoy the freedom to take charge of your accounts from the comfort of your own device. Join the revolutionizing way you...
        </p>

        {/* RED GET STARTED BUTTON */}
        <button
          style={{
            backgroundColor: '#8B0000',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Get Started
        </button>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',  // image to right corner
          alignItems: 'center'
        }}
      >
        <img
          src="/experience-banner.png" // replace with your image path
          alt="Experience Online Banking"
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            borderRadius: '8px'
          }}
        />
      </div>
    </section>
  );
};

export default ExperienceSection;
