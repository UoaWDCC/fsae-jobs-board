import React from 'react';
import { Welcome } from '../../components/Welcome/Welcome';
import { FindOutMore } from '../../components/FindOutMore/FindOutMore';
import { Guide } from '../../components/Guides/Guide';
import { useScroll, ScrollProvider } from '../../contexts/ScrollContext'; // Adjust the path as needed

export function HomePage() {
  const { refs } = useScroll();
  
  return (
    <>
      <Welcome />
      <FindOutMore />
      <Guide
        title="Students"
        subtitle1="Sign-up"
        description1="Sign up using your uni email"
        subtitle2="Get Started"
        description2="Create your Profile"
        subtitle3="Find a Job"
        description3="Browse and Apply to Jobs"
        buttonText="Register as a Student"
        useRef="/signup/student"
        ref={refs.student}
      />
      <Guide
        title="Sponsors"
        subtitle1="Sign-up"
        description1="Sign up using your company email"
        subtitle2="Get Started"
        description2="Create a Profile and post your job ads"
        subtitle3="Find Students"
        description3="Browse our talents pool"
        buttonText="Register as a Sponsor"
        useRef="/signup/sponsor"
        ref={refs.sponsor}
      />
      <Guide
        title="Alumni"
        subtitle1="Get Started"
        description1="Sign up using your company email"
        subtitle2="Get Started"
        description2="Create your Profile"
        subtitle3="Find Students"
        description3="Browse our talents pool"
        buttonText="Register as an Alumni"
        useRef="/signup/alumni"
      ref={refs.alumni}
      />
    </>
  );
}