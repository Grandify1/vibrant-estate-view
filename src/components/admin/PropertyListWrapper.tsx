
import React from 'react';
import PropertyList from './PropertyList';

interface PropertyListWrapperProps {
  companyId?: string;
}

const PropertyListWrapper: React.FC<PropertyListWrapperProps> = ({ companyId }) => {
  return (
    <PropertyList
      companyId={companyId}
    />
  );
};

export default PropertyListWrapper;
