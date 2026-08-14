import React, { useState } from 'react';
import MainContent from '../components/MainContent';
import Timeline from '../components/Timeline';

const HomePage = () => {
  const [trackingResult, setTrackingResult] = useState(null);

  return (
    <>
      <MainContent onTrackResult={setTrackingResult} />
      <Timeline trackingResult={trackingResult} />
    </>
  );
};

export default HomePage;
