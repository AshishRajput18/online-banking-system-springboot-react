import React from 'react';

const WelcomeSection = () => {
  return (
    <section
      style={{
        width: '100%',
        minHeight: '450px',
        backgroundColor: '#f5f5dc',
        display: 'flex',
        alignItems: 'center',
        padding: '40px 5%',
        boxSizing: 'border-box'
      }}
    >
      {/* LEFT SIDE IMAGE */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start', // image to left corner
          alignItems: 'flex-start'
        }}
      >
        <img
          src="/welcome-banner.png"
          alt="Online Banking"
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            borderRadius: '8px'
          }}
        />
      </div>

      {/* RIGHT SIDE TEXT */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: '40px'
        }}
      >
        <h1
          style={{
            color: '#8B0000',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '16px',
            fontFamily: 'Georgia, serif'
          }}
        >
          Welcome to Online Banking System
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#4a4a4a',
            lineHeight: '1.6',
            marginBottom: '12px'
          }}
        >
          Welcome to our cutting-edge Online Banking System where financial management initiates effortlessly without worry.
        </p>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#4a4a4a',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}
        >
          Our secure platform ensures a smooth and intuitive experience, giving you full control over your finances from the comfort of your own device.
        </p>

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
    </section>
  );
};

export default WelcomeSection;
