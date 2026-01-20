import React from 'react';

const HeroImage = () => {
  return (
    <section
      style={{
        width: '100%',
        minHeight: '400px',
        backgroundColor: '#eae3d2',
        display: 'flex',
        alignItems: 'center',
        padding: '40px 5%',
        boxSizing: 'border-box'
      }}
    >
      {/* LEFT SIDE TEXT */}
      <div style={{ flex: 1, paddingRight: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2
          style={{
            color: '#8B0000',
            fontSize: '2.2rem',
            fontWeight: '700',
            marginBottom: '16px',
            fontFamily: 'Georgia, serif'
          }}
        >
          Bank smarter, not harder.
        </h2>
        <p
          style={{
            color: '#5a0000',
            fontSize: '1.2rem',
            lineHeight: '1.6'
          }}
        >
          Instant access to balances, payments, and insights—24/7. Secure transfers, effortless deposits, and worry-free withdrawals.
        </p>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <img
          src="/banking-banner.png" // replace with your image
          alt="Online Banking"
          style={{
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            borderRadius: '8px'
          }}
        />
      </div>
    </section>
  );
};

export default HeroImage;
