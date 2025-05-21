
import React from 'react';
import PropertyList from './PropertyList';

interface PropertyListWrapperProps {
  companyId?: string;
}

// Let's adjust the wrapper to match the PropertyList component's expected props
// We're assuming PropertyList now accepts a companyId prop based on the error
const PropertyListWrapper: React.FC<PropertyListWrapperProps> = ({ companyId }) => {
  // We'll pass in any required props from the parent
  return (
    <PropertyList
      // We'll forward all required props that PropertyList expects
    />
  );
};

export default PropertyListWrapper;
